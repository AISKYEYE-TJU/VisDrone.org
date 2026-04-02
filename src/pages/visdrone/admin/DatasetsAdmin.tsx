import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Database, Plus, ExternalLink } from 'lucide-react';
import type { Dataset } from '@/types/visdrone';
import { DATASET_CATEGORIES } from '@/types/visdrone/constants';
import { fetchAllDatasets, createDataset, updateDataset, deleteDataset } from '@/services/adminCrudService';
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
import { ImageUpload } from '@/components/admin/ImageUpload';

const columns = [
  {
    key: 'name',
    label: '名称',
    render: (item: Dataset) => (
      <div className="flex items-center gap-3">
        {item.image ? (
          <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
        ) : (
          <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-500">
            <Database className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-slate-500 truncate max-w-[150px]">{item.full_name}</div>
        </div>
      </div>
    ),
  },
  { key: 'full_name', label: '全称' },
  {
    key: 'category',
    label: '分类',
    render: (item: Dataset) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
        {item.category}
      </span>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    render: (item: Dataset) =>
      item.github ? (
        <a
          href={item.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          链接
        </a>
      ) : (
        <span className="text-slate-400">无</span>
      ),
  },
  {
    key: 'stars',
    label: 'Stars',
    render: (item: Dataset) => item.stars || '-',
  },
];

export default function DatasetsAdmin() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Dataset | null>(null);
  const [formData, setFormData] = useState<Partial<Dataset>>({
    name: '',
    full_name: '',
    description: '',
    category: '',
    paper_title: '',
    paper_venue: '',
    paper_year: 2024,
    authors: [],
    features: [],
    stats: {},
    github: '',
    image: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllDatasets();
    setDatasets(data);
    setLoading(false);
  };

  const generateId = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20) + Date.now();
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      id: '',
      name: '',
      full_name: '',
      description: '',
      category: '',
      paper_title: '',
      paper_venue: '',
      paper_year: 2024,
      authors: [],
      features: [],
      stats: {},
      github: '',
      image: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Dataset) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: Dataset) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deleteDataset(deleteId);
      if (result.success) loadData();
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.full_name) {
      toast.error('请填写必填项');
      return;
    }

    const dataToSave = {
      ...formData,
      id: editingItem?.id || generateId(formData.name),
    };

    let result;
    if (editingItem) {
      result = await updateDataset(editingItem.id, dataToSave);
    } else {
      result = await createDataset(dataToSave);
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
          <h1 className="text-2xl font-bold">数据集管理</h1>
          <p className="text-slate-500">管理研究数据集</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加数据集
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="数据集总数" value={datasets.length} icon={<Database className="w-6 h-6" />} />
      </div>

      <DataTable
        data={datasets}
        columns={columns}
        searchPlaceholder="搜索数据集..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无数据集"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑数据集' : '添加数据集'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <FormRow>
              <FormField label="简称" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如: VisDrone"
                />
              </FormField>
              <FormField label="全称" required>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="如: VisDrone Dataset"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="分类">
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATASET_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="GitHub">
                <Input
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </FormField>
            </FormRow>

            <FormField label="封面图片">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                bucket="dataset"
                id={formData.name}
                aspectRatio="video"
              />
            </FormField>

            <FormField label="描述" required>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="数据集描述"
                rows={3}
              />
            </FormField>

            <FormField label="特性标签">
              <Input
                value={formData.features?.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="用逗号分隔多个特性"
              />
            </FormField>

            <FormRow>
              <FormField label="关联论文标题">
                <Input
                  value={formData.paper_title}
                  onChange={(e) => setFormData({ ...formData, paper_title: e.target.value })}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="发表会议/期刊">
                <Input
                  value={formData.paper_venue}
                  onChange={(e) => setFormData({ ...formData, paper_venue: e.target.value })}
                  placeholder="如: CVPR 2024"
                />
              </FormField>
              <FormField label="年份">
                <Input
                  type="number"
                  value={formData.paper_year}
                  onChange={(e) => setFormData({ ...formData, paper_year: parseInt(e.target.value) })}
                />
              </FormField>
            </FormRow>

            <FormField label="作者（用英文逗号分隔）">
              <Input
                value={formData.authors?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  authors: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                })}
                placeholder="如: Zhu, Pengfei, Wang, Xing"
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
        title="删除数据集"
        description="确定要删除这个数据集吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
