import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Handshake, Plus } from 'lucide-react';
import type { Partner as PartnerType } from '@/types/visdrone';
import { fetchAllPartners, createPartner, updatePartner, deletePartner } from '@/services/adminCrudService';
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

const columns = [
  {
    key: 'display_order',
    label: '排序',
    render: (item: PartnerType) => (
      <span className="text-slate-500 w-8 text-center">{item.display_order}</span>
    ),
  },
  {
    key: 'name',
    label: '单位名称',
    render: (item: PartnerType) => (
      <div className="max-w-xs truncate font-medium">{item.name}</div>
    ),
  },
  {
    key: 'website',
    label: '网站',
    render: (item: PartnerType) =>
      item.website ? (
        <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline max-w-[200px] truncate block">
          {item.website}
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  },
];

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PartnerType | null>(null);
  const [formData, setFormData] = useState<Partial<PartnerType>>({
    name: '',
    logo_url: '',
    website: '',
    description: '',
    display_order: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllPartners();
    setPartners(data);
    setLoading(false);
  };

  const generateId = (name: string): string => {
    return 'partner_' + name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '').substring(0, 16) + Date.now();
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: '',
      name: '',
      logo_url: '',
      website: '',
      description: '',
      display_order: partners.length,
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: PartnerType) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: PartnerType) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deletePartner(deleteId);
      if (result.success) {
        loadData();
      }
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('请填写单位名称');
      return;
    }

    const dataToSave = {
      id: editingItem?.id || generateId(formData.name),
      name: formData.name.trim(),
      logo_url: formData.logo_url || null,
      website: formData.website || null,
      description: formData.description || null,
      display_order: formData.display_order ?? 0,
    };

    let result;
    if (editingItem) {
      result = await updatePartner(editingItem.id, dataToSave);
    } else {
      result = await createPartner(dataToSave);
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
          <h1 className="text-2xl font-bold">合作单位管理</h1>
          <p className="text-slate-500">管理首页展示的合作单位</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加合作单位
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="合作单位总数" value={partners.length} icon={<Handshake className="w-6 h-6" />} />
      </div>

      <DataTable
        data={partners}
        columns={columns}
        searchPlaceholder="搜索单位名称..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无合作单位"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑合作单位' : '添加合作单位'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="单位名称" required>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入合作单位名称，如：华为、长安汽车"
              />
            </FormField>

            <FormRow>
              <FormField label="Logo 图片链接">
                <Input
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="输入 Logo 图片 URL（可选）"
                />
              </FormField>
              <FormField label="排序序号">
                <Input
                  type="number"
                  value={String(formData.display_order ?? 0)}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="数字越小越靠前"
                />
              </FormField>
            </FormRow>

            <FormField label="官网地址">
              <Input
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="输入官方网站 URL（可选）"
              />
            </FormField>

            <FormField label="简介描述">
              <Input
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简短描述（可选）"
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
        title="删除合作单位"
        description="确定要删除这个合作单位吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
