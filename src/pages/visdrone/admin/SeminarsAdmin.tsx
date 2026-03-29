import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar, Plus } from 'lucide-react';
import type { SeminarEvent, SeminarType, SeminarGroup } from '@/types/visdrone';
import { fetchAllSeminars, createSeminar, updateSeminar, deleteSeminar } from '@/services/adminCrudService';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SEMINAR_TYPES: { value: SeminarType; label: string }[] = [
  { value: 'group_meeting', label: '组会' },
  { value: 'invited_talk', label: '特邀报告' },
  { value: 'workshop', label: '学术会议' },
];

const SEMINAR_GROUPS: { value: SeminarGroup; label: string }[] = [
  { value: 'learning', label: '学习范式' },
  { value: 'multimodal', label: '多模态学习' },
  { value: 'embodied', label: '具身智能' },
];

const columns = [
  {
    key: 'title',
    label: '标题',
    render: (item: SeminarEvent) => (
      <div className="max-w-xs truncate font-medium">{item.title}</div>
    ),
  },
  {
    key: 'type',
    label: '类型',
    render: (item: SeminarEvent) => {
      const typeConfig = SEMINAR_TYPES.find(t => t.value === item.type);
      return <span className="text-slate-600">{typeConfig?.label || item.type}</span>;
    },
  },
  {
    key: 'group',
    label: '组别',
    render: (item: SeminarEvent) => {
      const groupConfig = SEMINAR_GROUPS.find(g => g.value === item.group);
      return <span className="text-slate-600">{groupConfig?.label || '-'}</span>;
    },
  },
  { key: 'date', label: '日期' },
  { key: 'speaker', label: '报告人' },
];

export default function SeminarsAdmin() {
  const [seminars, setSeminars] = useState<SeminarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SeminarEvent | null>(null);
  const [formData, setFormData] = useState<Partial<SeminarEvent>>({
    title: '',
    date: '',
    speaker: '',
    abstract: '',
    type: 'group_meeting',
    group: 'visdrone',
    ppt_url: '',
    paper_url: '',
    video_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSeminars();
      setSeminars(data || []);
    } catch (err) {
      console.error('Failed to load seminars:', err);
      setSeminars([]);
    }
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
      date: '',
      speaker: '',
      abstract: '',
      type: 'group_meeting',
      group: 'learning',
      ppt_url: '',
      paper_url: '',
      video_url: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: SeminarEvent) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (item: SeminarEvent) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const result = await deleteSeminar(deleteId);
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
      result = await updateSeminar(editingItem.id, dataToSave);
    } else {
      result = await createSeminar(dataToSave);
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
          <h1 className="text-2xl font-bold">学术活动管理</h1>
          <p className="text-slate-500">管理组会、特邀报告和学术会议</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          添加活动
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="组会"
          value={seminars.filter(s => s.type === 'group_meeting').length}
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatsCard
          title="特邀报告"
          value={seminars.filter(s => s.type === 'invited_talk').length}
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatsCard
          title="学术会议"
          value={seminars.filter(s => s.type === 'workshop').length}
          icon={<Calendar className="w-6 h-6" />}
        />
      </div>

      <DataTable
        data={seminars}
        columns={columns}
        searchPlaceholder="搜索学术活动..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无学术活动"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑活动' : '添加活动'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <FormRow>
              <FormField label="标题" required>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="如: 深度学习在目标检测中的应用"
                />
              </FormField>
              <FormField label="日期" required>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="类型">
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as SeminarType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMINAR_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="组别">
                <Select
                  value={formData.group}
                  onValueChange={(v) => setFormData({ ...formData, group: v as SeminarGroup })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择组别" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMINAR_GROUPS.map((group) => (
                      <SelectItem key={group.value} value={group.value}>{group.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormRow>

            <FormField label="报告人">
              <Input
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                placeholder="如: 张三 教授"
              />
            </FormField>

            <FormField label="摘要">
              <Textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                placeholder="报告摘要..."
                rows={3}
              />
            </FormField>

            <FormRow>
              <FormField label="PPT 链接">
                <Input
                  value={formData.ppt_url}
                  onChange={(e) => setFormData({ ...formData, ppt_url: e.target.value })}
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="论文链接">
                <Input
                  value={formData.paper_url}
                  onChange={(e) => setFormData({ ...formData, paper_url: e.target.value })}
                  placeholder="https://..."
                />
              </FormField>
            </FormRow>

            <FormField label="视频链接">
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://..."
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="确认删除"
        description="确定要删除这个学术活动吗？此操作不可撤销。"
      />
    </div>
  );
}
