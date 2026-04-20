import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Newspaper, Plus } from 'lucide-react';
import type { NewsItem } from '@/types/visdrone';
import { NEWS_CATEGORIES } from '@/types/visdrone/constants';
import { fetchAllNews, createNews, updateNews, deleteNews } from '@/services/adminCrudService';
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
    key: 'title',
    label: '标题',
    render: (item: NewsItem) => (
      <div className="max-w-xs truncate font-medium">{item.title}</div>
    ),
  },
  { key: 'date', label: '日期' },
  {
    key: 'category',
    label: '分类',
    render: (item: NewsItem) => (
      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
        {item.category}
      </span>
    ),
  },
  {
    key: 'image',
    label: '图片',
    render: (item: NewsItem) =>
      item.image ? (
        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded" />
      ) : (
        <span className="text-slate-400">无</span>
      ),
  },
];

export default function NewsAdmin() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    url: '',
    date: '',
    excerpt: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllNews();
    setNews(data);
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
      url: '',
      date: '',
      excerpt: '',
      image: '',
      category: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: NewsItem) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deleteNews(deleteId);
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
      result = await updateNews(editingItem.id, dataToSave);
    } else {
      result = await createNews(dataToSave);
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
          <h1 className="text-2xl font-bold">新闻管理</h1>
          <p className="text-slate-500">管理系统新闻和公告</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加新闻
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="新闻总数" value={news.length} icon={<Newspaper className="w-6 h-6" />} />
      </div>

      <DataTable
        data={news}
        columns={columns}
        searchPlaceholder="搜索新闻标题..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无新闻"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑新闻' : '添加新闻'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="标题" required>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入新闻标题"
              />
            </FormField>

            <FormRow>
              <FormField label="日期" required>
                <Input
                  type="month"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormField>
              <FormField label="分类" required>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormRow>

            <FormField label="链接">
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="输入原文链接"
              />
            </FormField>

            <FormField label="摘要" required>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="输入新闻摘要"
                rows={3}
              />
            </FormField>

            <FormField label="图片">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                bucket="news"
                aspectRatio="video"
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
        title="删除新闻"
        description="确定要删除这条新闻吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
