import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Brain, Plus, Github, Star } from 'lucide-react';
import type { Model } from '@/types/visdrone';
import { MODEL_TASKS } from '@/types/visdrone/constants';
import { fetchAllModels, createModel, updateModel, deleteModel } from '@/services/adminCrudService';
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
    label: '模型名称',
    render: (item: Model) => (
      <div className="flex items-center gap-3">
        {item.image ? (
          <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
        ) : (
          <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-500">
            <Brain className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-slate-500 truncate max-w-[150px]">{item.full_name}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'task',
    label: '任务',
    render: (item: Model) => (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
        {item.task}
      </span>
    ),
  },
  {
    key: 'stars',
    label: 'Stars',
    render: (item: Model) => (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        {item.stars || 0}
      </div>
    ),
  },
  {
    key: 'paper',
    label: '论文',
    render: (item: Model) => (
      <div className="text-xs text-slate-500 truncate max-w-xs">
        {item.paper_venue} {item.paper_year}
      </div>
    ),
  },
];

export default function ModelsAdmin() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Model | null>(null);
  const [formData, setFormData] = useState<Partial<Model>>({
    name: '',
    full_name: '',
    description: '',
    task: '',
    paper_title: '',
    paper_venue: '',
    paper_year: new Date().getFullYear(),
    paper_url: '',
    features: [],
    github: '',
    stars: 0,
    forks: 0,
    image: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllModels();
    setModels(data);
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
      task: '',
      paper_title: '',
      paper_venue: '',
      paper_year: new Date().getFullYear(),
      paper_url: '',
      features: [],
      github: '',
      stars: 0,
      forks: 0,
      image: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Model) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: Model) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deleteModel(deleteId);
      if (result.success) {
        loadData();
      }
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.task) {
      toast.error('请填写必填项');
      return;
    }

    const dataToSave = {
      ...formData,
      id: editingItem?.id || generateId(formData.name),
    };

    let result;
    if (editingItem) {
      result = await updateModel(editingItem.id, dataToSave);
    } else {
      result = await createModel(dataToSave);
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
          <h1 className="text-2xl font-bold">模型管理</h1>
          <p className="text-slate-500">管理团队模型</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加模型
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="模型总数" value={models.length} icon={<Brain className="w-6 h-6" />} />
      </div>

      <DataTable
        data={models}
        columns={columns}
        searchPlaceholder="搜索模型名称..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无模型"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑模型' : '添加模型'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormRow>
              <FormField label="简称" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如: R-CNN"
                />
              </FormField>
              <FormField label="全称" required>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="如: Region-based CNN"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="任务类型" required>
                <Select
                  value={formData.task}
                  onValueChange={(v) => setFormData({ ...formData, task: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择任务" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_TASKS.map((task) => (
                      <SelectItem key={task} value={task}>{task}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="GitHub">
                <Input
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="如: https://github.com/..."
                />
              </FormField>
            </FormRow>

            <FormField label="模型图标/封面">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                bucket="model"
                id={formData.name}
                aspectRatio="square"
              />
            </FormField>

            <FormField label="描述" required>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="输入模型描述"
                rows={3}
              />
            </FormField>

            <FormField label="特性">
              <Input
                value={formData.features?.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="用逗号分隔多个特性"
              />
            </FormField>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">关联论文</h3>
              <FormField label="论文标题">
                <Input
                  value={formData.paper_title}
                  onChange={(e) => setFormData({ ...formData, paper_title: e.target.value })}
                  placeholder="输入论文标题"
                />
              </FormField>
              <FormRow>
                <FormField label="发表场所">
                  <Input
                    value={formData.paper_venue}
                    onChange={(e) => setFormData({ ...formData, paper_venue: e.target.value })}
                    placeholder="如: CVPR"
                  />
                </FormField>
                <FormField label="年份">
                  <Input
                    type="number"
                    value={formData.paper_year}
                    onChange={(e) => setFormData({ ...formData, paper_year: parseInt(e.target.value) })}
                    min={2000}
                    max={2030}
                  />
                </FormField>
              </FormRow>
              <FormField label="论文链接">
                <Input
                  value={formData.paper_url}
                  onChange={(e) => setFormData({ ...formData, paper_url: e.target.value })}
                  placeholder="输入论文链接"
                />
              </FormField>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>{editingItem ? '保存' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="删除模型"
        description="确定要删除这个模型吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
