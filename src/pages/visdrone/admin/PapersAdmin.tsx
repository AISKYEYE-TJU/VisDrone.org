import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FileText, Plus, ExternalLink } from 'lucide-react';
import type { Paper } from '@/types/visdrone';
import { PAPER_TYPES } from '@/types/visdrone/constants';
import { fetchAllPapers, createPaper, updatePaper, deletePaper } from '@/services/adminCrudService';
import { DataTable, StatsCard, ConfirmDialog, FormField, FormRow } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const columns = [
  {
    key: 'title',
    label: '标题',
    render: (item: Paper) => (
      <div className="max-w-xs truncate font-medium">{item.title}</div>
    ),
  },
  {
    key: 'authors',
    label: '作者',
    render: (item: Paper) => (
      <div className="max-w-xs truncate text-slate-600">{item.authors?.slice(0, 3).join(', ')}{item.authors?.length > 3 ? '...' : ''}</div>
    ),
  },
  { key: 'venue', label: '期刊/会议', render: (item: Paper) => (
    <span className="text-slate-600">{item.venue} {item.year}</span>
  )},
  {
    key: 'type',
    label: '类型',
    render: (item: Paper) => (
      <span className={`px-2 py-1 rounded text-xs ${item.type === 'conference' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
        {item.type === 'conference' ? '会议' : '期刊'}
      </span>
    ),
  },
];

export default function PapersAdmin() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Paper | null>(null);
  const [formData, setFormData] = useState<Partial<Paper>>({
    title: '',
    authors: [],
    venue: '',
    year: new Date().getFullYear(),
    type: 'conference',
    doi: '',
    pdf_url: '',
    code_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllPapers();
    setPapers(data);
    setLoading(false);
  };

  const generateId = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20) + Date.now();
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: '',
      title: '',
      authors: [],
      venue: '',
      year: new Date().getFullYear(),
      type: 'conference',
      doi: '',
      pdf_url: '',
      code_url: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Paper) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: Paper) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deletePaper(deleteId);
      if (result.success) {
        loadData();
      }
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.venue || !formData.authors?.length) {
      toast.error('请填写必填项');
      return;
    }

    const dataToSave = {
      ...formData,
      id: editingItem?.id || generateId(formData.title),
    };

    let result;
    if (editingItem) {
      result = await updatePaper(editingItem.id, dataToSave);
    } else {
      result = await createPaper(dataToSave);
    }

    if (result.success) {
      setDialogOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">论文管理</h1>
          <p className="text-slate-500">管理团队发表论文</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加论文
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="论文总数" value={papers.length} icon={<FileText className="w-6 h-6" />} />
      </div>

      <DataTable
        data={papers}
        columns={columns}
        searchPlaceholder="搜索论文标题..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无论文"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑论文' : '添加论文'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="标题" required>
              <Textarea
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入论文标题"
                rows={2}
              />
            </FormField>

            <FormField label="作者" required>
              <Input
                value={formData.authors?.join(', ')}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="用逗号分隔多个作者"
              />
            </FormField>

            <FormRow>
              <FormField label="期刊/会议" required>
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="如: CVPR 2024"
                />
              </FormField>
              <FormField label="年份" required>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min={2000}
                  max={2030}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="类型" required>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as 'conference' | 'journal' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">会议论文</SelectItem>
                    <SelectItem value="journal">期刊论文</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="DOI">
                <Input
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  placeholder="如: 10.1109/CVPR.2024.12345"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="PDF链接">
                <Input
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="输入 PDF 链接"
                />
              </FormField>
              <FormField label="代码链接">
                <Input
                  value={formData.code_url}
                  onChange={(e) => setFormData({ ...formData, code_url: e.target.value })}
                  placeholder="输入代码仓库链接"
                />
              </FormField>
            </FormRow>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>{editingItem ? '保存' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="删除论文"
        description="确定要删除这篇论文吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
