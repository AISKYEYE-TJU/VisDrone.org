import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Plus, Mail, RefreshCw, Database, FileCode, ArrowRight, AlertCircle } from 'lucide-react';
import type { TeamMember } from '@/types/visdrone';
import { TEAM_ROLES } from '@/types/visdrone/constants';
import { teamMembers as localTeamMembers, getTeamStats } from '@/data/visdrone/team';
import { fetchAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, syncTeamMembersToDatabase, clearTeamMembersDatabase } from '@/services/adminCrudService';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const columns = [
  {
    key: 'name',
    label: '姓名',
    render: (item: TeamMember) => (
      <div className="flex items-center gap-3">
        {item.image ? (
          <img src={item.image} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            {item.name[0]}
          </div>
        )}
        <div>
          <div className="font-medium">{item.name}</div>
          {item.name_en && <div className="text-xs text-slate-500">{item.name_en}</div>}
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: '角色',
    render: (item: TeamMember) => {
      const roleColors: Record<string, string> = {
        PI: 'bg-purple-100 text-purple-700',
        Professor: 'bg-blue-100 text-blue-700',
        PhD: 'bg-green-100 text-green-700',
        Master: 'bg-cyan-100 text-cyan-700',
        Visiting: 'bg-orange-100 text-orange-700',
        Alumni: 'bg-gray-100 text-gray-700',
      };
      const roles = item.roles || (item.role ? [item.role] : []);
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map(r => (
            <span key={r} className={`px-2 py-1 rounded text-xs ${roleColors[r] || 'bg-slate-100 text-slate-700'}`}>
              {r}
            </span>
          ))}
        </div>
      );
    },
  },
  { key: 'title', label: '职称' },
  { key: 'year', label: '年级' },
  {
    key: 'email',
    label: '邮箱',
    render: (item: TeamMember) => item.email ? (
      <a href={`mailto:${item.email}`} className="text-primary hover:underline flex items-center gap-1">
        <Mail className="w-3 h-3" />
        {item.email}
      </a>
    ) : '-',
  },
];

export default function TeamAdmin() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [dataSource, setDataSource] = useState<'local' | 'database'>('local');
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    name_en: '',
    roles: [],
    role: '',
    title: '',
    year: '',
    bio: '',
    image: '',
    email: '',
    homepage: '',
    research_interests: [],
  });

  const stats = getTeamStats();

  useEffect(() => {
    loadData();
  }, [dataSource]);

  const loadData = async () => {
    setLoading(true);
    if (dataSource === 'local') {
      setTeam(localTeamMembers);
    } else {
      const data = await fetchAllTeamMembers();
      setTeam(data);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      name_en: '',
      roles: [],
      role: '',
      title: '',
      year: '',
      bio: '',
      image: '',
      email: '',
      homepage: '',
      research_interests: [],
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: TeamMember) => {
    setEditingItem(item);
    const roles = item.roles || (item.role ? [item.role] : []);
    setFormData({ ...item, roles });
    setDialogOpen(true);
  };

  const handleDelete = (item: TeamMember) => {
    setDeleteId(item.id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      if (dataSource === 'database') {
        const result = await deleteTeamMember(deleteId);
        if (result.success) {
          loadData();
        }
      } else {
        toast.info('本地数据模式下，请直接编辑 team.ts 文件');
      }
      setDeleteId(null);
    }
  };

  const generateId = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '');
  };

  const handleSave = async () => {
    if (!formData.name || formData.roles.length === 0 || !formData.bio) {
      toast.error('请填写必填项（姓名、角色、个人简介）');
      return;
    }

    const dataToSave = {
      ...formData,
      id: editingItem?.id || generateId(formData.name),
      roles: formData.roles,
      role: formData.roles[0] || '',
    };

    if (dataSource === 'database') {
      let result;
      if (editingItem) {
        result = await updateTeamMember(editingItem.id, dataToSave);
      } else {
        result = await createTeamMember(dataToSave as Record<string, unknown>);
      }

      if (result.success) {
        setDialogOpen(false);
        loadData();
      }
    } else {
      toast.info('本地数据模式下，请直接编辑 team.ts 文件或使用数据同步功能');
      setDialogOpen(false);
    }
  };

  const handleSyncToDatabase = async () => {
    setSyncing(true);
    try {
      const result = await syncTeamMembersToDatabase(localTeamMembers);
      if (result.success) {
        toast.success(`成功同步 ${result.count} 条数据到云端数据库`);
        setSyncDialogOpen(false);
        if (dataSource === 'database') {
          loadData();
        }
      } else {
        toast.error('同步失败: ' + result.error);
      }
    } catch (error) {
      toast.error('同步出错');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">团队管理</h1>
          <p className="text-slate-500">管理团队成员信息（共 {stats.total} 人）</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSyncDialogOpen(true)} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            数据同步
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            添加成员
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <StatsCard title="团队总数" value={stats.total} icon={<Users className="w-6 h-6" />} />
        <StatsCard title="PI" value={stats.pi} />
        <StatsCard title="教师" value={stats.professor} />
        <StatsCard title="博士生" value={stats.phd} />
        <StatsCard title="硕士生" value={stats.master} />
        <StatsCard title="访问/毕业" value={stats.visiting + stats.alumni} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">数据源选择</CardTitle>
              <CardDescription>选择要查看和编辑的数据源</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={dataSource === 'local' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDataSource('local')}
                className="gap-2"
              >
                <FileCode className="w-4 h-4" />
                本地文件
              </Button>
              <Button
                variant={dataSource === 'database' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDataSource('database')}
                className="gap-2"
              >
                <Database className="w-4 h-4" />
                云端数据库
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-600">
            {dataSource === 'local' ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                当前显示本地 team.ts 文件数据（{localTeamMembers.length} 人）
                <span className="text-xs text-slate-400 ml-2">只读模式，请使用数据同步功能更新</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                当前显示云端数据库数据（{team.length} 人）
                <span className="text-xs text-slate-400 ml-2">可在线编辑</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DataTable
        data={team}
        columns={columns}
        searchPlaceholder="搜索成员姓名..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        emptyMessage="暂无成员"
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑成员' : '添加成员'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField label="照片">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                bucket="team"
                id={editingItem?.id || formData.name}
                aspectRatio="square"
              />
            </FormField>

            <FormRow>
              <FormField label="姓名" required>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="输入中文姓名"
                />
              </FormField>
              <FormField label="英文名">
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="输入英文名"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="角色" required>
                <div className="flex flex-wrap gap-4">
                  {TEAM_ROLES.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={formData.roles?.includes(role)}
                        onCheckedChange={(checked) => {
                          const currentRoles = formData.roles || [];
                          const newRoles = checked
                            ? [...currentRoles, role]
                            : currentRoles.filter(r => r !== role);
                          setFormData({ ...formData, roles: newRoles });
                        }}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm font-normal cursor-pointer">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </FormField>
              <FormField label="职称">
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="如: 教授、博士生"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="年级">
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="如: 2024级、2022年"
                />
              </FormField>
              <FormField label="邮箱">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="输入邮箱"
                />
              </FormField>
            </FormRow>

            <FormField label="个人主页">
              <Input
                value={formData.homepage}
                onChange={(e) => setFormData({ ...formData, homepage: e.target.value })}
                placeholder="输入主页链接"
              />
            </FormField>

            <FormField label="个人简介" required>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder={formData.roles?.includes('Alumni') ? '格式: 就业单位 | 职位' : '输入个人简介'}
                rows={4}
              />
            </FormField>

            <FormField label="研究方向">
              <Input
                value={formData.research_interests?.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  research_interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="用逗号分隔多个研究方向"
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>{editingItem ? '保存' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>数据同步</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileCode className="w-5 h-5 text-blue-500" />
                  本地 → 云端
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p><strong>数据源:</strong> team.ts 本地文件（{localTeamMembers.length} 人）</p>
                <p><strong>目标:</strong> Supabase 云端数据库</p>
                <p><strong>操作:</strong> 将本地数据同步到云端</p>
                <Button
                  onClick={handleSyncToDatabase}
                  disabled={syncing}
                  className="w-full mt-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      同步中...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      同步到云端
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="w-5 h-5 text-green-500" />
                  云端 → 本地
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p><strong>数据源:</strong> Supabase 云端数据库</p>
                <p><strong>目标:</strong> team.ts 本地文件</p>
                <p><strong>操作:</strong> 导出云端数据到本地文件</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const dataStr = JSON.stringify(team, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'team_export.json';
                    a.click();
                    toast.success('数据已导出，请手动更新 team.ts 文件');
                  }}
                  className="w-full mt-2"
                >
                  导出 JSON
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  清理云端数据
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-2">
                <p className="text-red-600"><strong>警告:</strong> 此操作将删除云端数据库中的所有团队成员数据</p>
                <p>当前云端: {team.length} 人 | 本地: {localTeamMembers.length} 人</p>
                <p className="text-xs text-slate-500">用于清理重复或旧数据，清理后请重新同步本地数据</p>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (confirm('确定要清理云端数据库中的所有团队成员数据吗？此操作无法撤销！')) {
                      const result = await clearTeamMembersDatabase();
                      if (result.success) {
                        toast.success('云端数据已清理');
                        if (dataSource === 'database') {
                          loadData();
                        }
                      } else {
                        toast.error('清理失败: ' + result.error);
                      }
                    }
                  }}
                  className="w-full mt-2"
                >
                  清理云端数据
                </Button>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="删除成员"
        description="确定要删除这个成员吗？此操作无法撤销。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
