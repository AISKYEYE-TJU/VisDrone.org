import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Users, BookOpen, Settings, 
  Database, Activity, Plus, Edit, Trash2,
  Download, Upload, Search, Filter, Eye,
  Save, X, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { researchProjects, publications, teamMembers } from '@/data/index';
import { ResearchProject, Publication, TeamMember } from '@/lib';

// 数据类型
type DataType = 'project' | 'publication' | 'member';

interface DataItem {
  id: string;
  type: DataType;
  data: any;
}

const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DataType>('project');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // 获取当前类型的数据
  const getCurrentData = (): any[] => {
    switch (activeTab) {
      case 'project':
        return researchProjects;
      case 'publication':
        return publications;
      case 'member':
        return teamMembers;
      default:
        return [];
    }
  };

  // 过滤数据
  const filteredData = getCurrentData().filter(item => {
    const searchLower = searchTerm.toLowerCase();
    if (activeTab === 'project') {
      return (item as ResearchProject).title.toLowerCase().includes(searchLower);
    } else if (activeTab === 'publication') {
      return (item as Publication).title.toLowerCase().includes(searchLower);
    } else {
      return (item as TeamMember).name.toLowerCase().includes(searchLower);
    }
  });

  // 处理新建
  const handleNew = () => {
    const emptyData: any = {};
    
    // 根据当前类型创建空数据
    if (activeTab === 'project') {
      emptyData.title = '';
      emptyData.titleEn = '';
      emptyData.description = '';
      emptyData.status = '进行中';
      emptyData.year = new Date().getFullYear().toString();
      emptyData.tags = [];
      emptyData.image = '';
    } else if (activeTab === 'publication') {
      emptyData.title = '';
      emptyData.authors = [];
      emptyData.venue = '';
      emptyData.year = new Date().getFullYear();
      emptyData.type = '期刊论文';
      emptyData.isSelected = false;
      emptyData.doi = '';
    } else if (activeTab === 'member') {
      emptyData.name = '';
      emptyData.nameEn = '';
      emptyData.role = 'Master';
      emptyData.title = '';
      emptyData.bio = '';
      emptyData.researchInterests = [];
      emptyData.email = '';
      emptyData.image = '';
    }
    
    setSelectedItem({ id: 'new', type: activeTab, data: emptyData });
    setEditData(emptyData);
    setIsEditing(true);
  };

  // 处理编辑
  const handleEdit = (item: any) => {
    setSelectedItem({ id: item.id, type: activeTab, data: item });
    setEditData({ ...item });
    setIsEditing(true);
  };

  // 处理保存
  const handleSave = () => {
    console.log('保存数据:', editData);
    // TODO: 实际保存逻辑，需要调用 API 或更新数据
    alert('保存成功！\n注意：当前为演示模式，数据未实际保存到服务器。');
    setIsEditing(false);
    setSelectedItem(null);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      console.log('删除:', id);
    }
  };

  // 导出数据
  const handleExport = () => {
    const data = getCurrentData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          console.log('导入数据:', data);
          alert(`成功导入 ${data.length} 条记录`);
        } catch (error) {
          alert('导入失败：文件格式错误');
        }
      };
      reader.readAsText(file);
    }
  };

  // 下载示例文档
  const handleDownloadExample = () => {
    const exampleData: any[] = [];
    
    if (activeTab === 'project') {
      exampleData.push({
        id: 'example-project',
        title: '示例研究项目',
        titleEn: 'Example Research Project',
        description: '这是一个示例研究项目的描述',
        image: '',
        tags: ['人工智能', '设计', '人机协同'],
        status: '进行中',
        year: '2026'
      });
    } else if (activeTab === 'publication') {
      exampleData.push({
        id: 'example-publication',
        title: '示例论文标题',
        authors: ['作者1', '作者2', '作者3'],
        venue: '示例期刊',
        year: 2026,
        type: '期刊论文',
        isSelected: false,
        doi: ''
      });
    } else if (activeTab === 'member') {
      exampleData.push({
        id: 'example-member',
        name: '示例成员',
        nameEn: 'Example Member',
        role: 'Master',
        title: '硕士生',
        image: '',
        bio: '这是一个示例成员的简介',
        researchInterests: ['人工智能', '设计'],
        email: 'example@seu.edu.cn'
      });
    }
    
    const blob = new Blob([JSON.stringify(exampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-example.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 一键更新
  const handleBulkUpdate = () => {
    console.log('一键更新所有内容');
    // 这里可以实现实际的更新逻辑，例如调用API更新所有内容
    alert('一键更新成功！\n注意：当前为演示模式，数据未实际更新到服务器。');
  };

  // 处理头像上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 这里可以实现实际的上传逻辑，例如上传到服务器
      // 为了演示，我们使用FileReader来读取文件并显示预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditData({ ...editData, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  // 渲染表单字段
  const renderFormFields = () => {
    if (!editData) return null;

    switch (activeTab) {
      case 'project':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">项目名称</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="titleEn">英文名称</Label>
              <Input
                id="titleEn"
                value={editData.titleEn || ''}
                onChange={(e) => setEditData({ ...editData, titleEn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">项目描述</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>状态</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="进行中">进行中</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
              <div>
                <Label>年份</Label>
                <Input
                  value={editData.year}
                  onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>标签（逗号分隔）</Label>
              <Input
                value={editData.tags.join(', ')}
                onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()) })}
              />
            </div>
          </div>
        );

      case 'publication':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">论文标题</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="authors">作者（逗号分隔）</Label>
              <Input
                id="authors"
                value={editData.authors.join(', ')}
                onChange={(e) => setEditData({ ...editData, authors: e.target.value.split(',').map(a => a.trim()) })}
              />
            </div>
            <div>
              <Label htmlFor="venue">发表 venue</Label>
              <Input
                id="venue"
                value={editData.venue}
                onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>年份</Label>
                <Input
                  type="number"
                  value={editData.year}
                  onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>类型</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={editData.type}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                >
                  <option value="期刊论文">期刊论文</option>
                  <option value="会议论文">会议论文</option>
                  <option value="专著">专著</option>
                  <option value="教材">教材</option>
                  <option value="专利">专利</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isSelected"
                checked={editData.isSelected || false}
                onCheckedChange={(checked) => setEditData({ ...editData, isSelected: checked })}
              />
              <Label htmlFor="isSelected">精选展示</Label>
            </div>
          </div>
        );

      case 'member':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nameEn">英文名</Label>
              <Input
                id="nameEn"
                value={editData.nameEn || ''}
                onChange={(e) => setEditData({ ...editData, nameEn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">角色</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              >
                <option value="PI">PI</option>
                <option value="Professor">教授</option>
                <option value="PhD">博士生</option>
                <option value="Master">硕士生</option>
                <option value="Alumni">校友</option>
              </select>
            </div>
            <div>
              <Label htmlFor="title">职称/头衔</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>个人头像</Label>
              <div className="space-y-2">
                {editData.image && (
                  <div className="flex items-center gap-2">
                    <img 
                      src={editData.image} 
                      alt="头像预览" 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditData({ ...editData, image: '' })}
                    >
                      移除
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传头像
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">简介</Label>
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">内容管理</h2>
          <p className="text-muted-foreground">管理研究项目、出版物和团队成员信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('file-input')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            导入
          </Button>
          <Button variant="outline" onClick={handleDownloadExample}>
            <FileText className="w-4 h-4 mr-2" />
            示例文档
          </Button>
          <Button variant="outline" onClick={handleBulkUpdate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            一键更新
          </Button>
          <input
            id="file-input"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <Button onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" />
            新建
          </Button>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* 标签页切换 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DataType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="project">
            <FileText className="w-4 h-4 mr-2" />
            研究项目
          </TabsTrigger>
          <TabsTrigger value="publication">
            <BookOpen className="w-4 h-4 mr-2" />
            出版物
          </TabsTrigger>
          <TabsTrigger value="member">
            <Users className="w-4 h-4 mr-2" />
            团队成员
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {activeTab === 'project' ? (item as ResearchProject).title :
                         activeTab === 'publication' ? (item as Publication).title :
                         (item as TeamMember).name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {activeTab === 'project' && (item as ResearchProject).description}
                        {activeTab === 'publication' && `${(item as Publication).venue}, ${(item as Publication).year}`}
                        {activeTab === 'member' && (item as TeamMember).title}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeTab === 'project' && (
                        <Badge variant={(item as ResearchProject).status === '进行中' ? 'default' : 'secondary'}>
                          {(item as ResearchProject).status}
                        </Badge>
                      )}
                      {activeTab === 'publication' && (item as Publication).isSelected && (
                        <Badge variant="default">精选</Badge>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 编辑对话框 */}
      {isEditing && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">
                {selectedItem.id === 'new' ? '新建' : '编辑'}
                {selectedItem.type === 'project' ? '项目' : 
                 selectedItem.type === 'publication' ? '出版物' : '成员'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="p-4">
                {renderFormFields()}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
