import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Lightbulb, Plus } from 'lucide-react';
import type { Patent } from '@/types/visdrone';
import { PATENT_TYPES } from '@/types/visdrone/constants';
import { fetchAllPatents, createPatent, updatePatent, deletePatent } from '@/services/adminCrudService';
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

const columns = [
  {
    key: 'title',
    label: '标题',
    render: (item: Patent) => (
      <div className="max-w-xs truncate font-medium">{item.title}</div>
    ),
  },
  {
    key: 'inventors',
    label: '发明人',
    render: (item: Patent) => (
      <div className="max-w-xs truncate text-slate-600">{item.inventors?.slice(0, 3).join(', ')}{item.inventors?.length > 3 ? '...' : ''}</div>
    ),
  },
  { key: 'number', label: '专利号' },
  { key: 'date', label: '日期' },
  {
    key: 'type',
    label: '类型',
    render: (item: Patent) => (
      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
        {item.type}
      </span>
    ),
  },
];

export default function PatentsAdmin() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Patent | null>(null);
  const [formData, setFormData] = useState<Partial<Patent>>({
    title: '',
    inventors: [],
    number: '',
    date: '',
    type: '发明',
    pdf_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllPatents();
    setPatents(data);
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
      inventors: [],
      number: '',
      date: '',
      type: '发明',
      pdf_url: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Patent) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: Patent) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deletePatent(deleteId);
      if (result.success) {
        loadData();
      }
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.number || !formData.inventors?.length) {
      toast.error('请填写必填项');
      return;
    }

    const dataToSave = {
      ...formData,
      id: editingItem?.id || generateId(formData.title),
    };

    let result;
    if (editingItem) {
      result = await updatePatent(editingItem.id, dataToSave);
    } else {
      result = await createPatent(dataToSave);
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
          <h1 className="text-2xl font-bold">专利管理</h1>
          <p className="text-slate-500">管理团队专利</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加专利
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="专利总数" value={patents.length} icon={<Lightbulb className="w-6 h-6" />} />
      </div>

      <DataTable
        data={patents}
        columns={columns}
        searchPlaceholder="搜索专利标题..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无专利"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑专利' : '添加专利'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="标题" required>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入专利标题"
              />
            </FormField>

            <FormField label="发明人" required>
              <Input
                value={formData.inventors?.join(', ')}
                onChange={(e) => setFormData({ ...formData, inventors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="用逗号分隔多个发明人"
              />
            </FormField>

            <FormRow>
              <FormField label="专利号" required>
                <Input
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="如: ZL202310123456.7"
                />
              </FormField>
              <FormField label="类型" required>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as '发明' | '实用新型' | '外观设计' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {PATENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormRow>

            <FormField label="日期">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </FormField>

            <FormField label="PDF链接">
              <Input
                value={formData.pdf_url}
                onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                placeholder="输入专利 PDF 链接"
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>{editingItem ? '保存' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="删除专利"
        description="确定要删除这个专利吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
