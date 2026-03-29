import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Award, Plus } from 'lucide-react';
import type { Award as AwardType } from '@/types/visdrone';
import { fetchAllAwards, createAward, updateAward, deleteAward } from '@/services/adminCrudService';
import { DataTable, StatsCard, ConfirmDialog, FormField, FormRow } from '@/components/admin/AdminComponents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const columns = [
  {
    key: 'title',
    label: '奖项名称',
    render: (item: AwardType) => (
      <div className="max-w-xs truncate font-medium">{item.title}</div>
    ),
  },
  {
    key: 'authors',
    label: '获奖人',
    render: (item: AwardType) => (
      <div className="max-w-xs truncate text-slate-600">{item.authors?.slice(0, 3).join(', ')}{item.authors?.length > 3 ? '...' : ''}</div>
    ),
  },
  { key: 'date', label: '获奖时间' },
  { key: 'venue', label: '颁奖机构' },
];

export default function AwardsAdmin() {
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<AwardType | null>(null);
  const [formData, setFormData] = useState<Partial<AwardType>>({
    title: '',
    authors: [],
    venue: '',
    date: '',
    pdf_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllAwards();
    setAwards(data);
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
      date: '',
      pdf_url: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: AwardType) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: AwardType) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deleteAward(deleteId);
      if (result.success) {
        loadData();
      }
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      toast.error('请填写必填项');
      return;
    }

    const dataToSave = {
      ...formData,
      id: editingItem?.id || generateId(formData.title),
    };

    let result;
    if (editingItem) {
      result = await updateAward(editingItem.id, dataToSave);
    } else {
      result = await createAward(dataToSave);
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
          <h1 className="text-2xl font-bold">奖项管理</h1>
          <p className="text-slate-500">管理团队获奖情况</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加奖项
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="奖项总数" value={awards.length} icon={<Award className="w-6 h-6" />} />
      </div>

      <DataTable
        data={awards}
        columns={columns}
        searchPlaceholder="搜索奖项名称..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无奖项"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑奖项' : '添加奖项'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="奖项名称" required>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入奖项名称"
              />
            </FormField>

            <FormField label="获奖人">
              <Input
                value={formData.authors?.join(', ')}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="用逗号分隔多个获奖人"
              />
            </FormField>

            <FormRow>
              <FormField label="获奖时间" required>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormField>
              <FormField label="颁奖机构">
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="如: 中国人工智能学会"
                />
              </FormField>
            </FormRow>

            <FormField label="证书链接">
              <Input
                value={formData.pdf_url}
                onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                placeholder="输入证书 PDF 链接"
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
        title="删除奖项"
        description="确定要删除这个奖项吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
