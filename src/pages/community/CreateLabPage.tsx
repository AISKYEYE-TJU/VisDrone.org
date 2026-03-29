import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FlaskConical, ArrowLeft, Users, FileText, Database,
  Code, Calendar, MessageSquare, Plus, Save, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { labService } from '@/services/labService';

const disciplines = [
  { value: '人工智能', label: '人工智能' },
  { value: '生物医学', label: '生物医学' },
  { value: '物理学', label: '物理学' },
  { value: '工程学', label: '工程学' },
  { value: '其他', label: '其他' }
];

const CreateLabPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    discipline: '人工智能',
    description: '',
    avatar: '',
    coverImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 生成实验室头像（使用实验室名称的前两个字符）
      const labAvatar = formData.name.substring(0, 2).toUpperCase();
      // 生成默认封面图片
      const defaultCoverImage = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=research%20laboratory%20${encodeURIComponent(formData.discipline)}%20science%20research%20modern%20lab%20environment%20no%20text%20no%20words%20no%20letters%20clean%20professional%20setting&image_size=landscape_16_9`;

      // 使用labService创建实验室
      const newLab = await labService.createLab({
        name: formData.name,
        discipline: formData.discipline,
        description: formData.description,
        avatar: labAvatar || formData.avatar,
        cover_image: formData.coverImage || defaultCoverImage
      });

      console.log('创建实验室:', newLab);

      setIsSubmitting(false);
      // 导航到实验室详情页面
      navigate(`/oplclaw/community/lab/${newLab.id}`);
    } catch (error) {
      console.error('创建实验室失败:', error);
      setIsSubmitting(false);
      // 可以添加错误提示
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <FlaskConical className="w-3 h-3 mr-1" />
            创建实验室
          </Badge>
          <h1 className="text-3xl font-bold mb-3">创建你的OPL实验室</h1>
          <p className="text-muted-foreground max-w-2xl">
            搭建专属科研空间，邀请团队成员协作，管理科研项目和资源
          </p>
        </motion.div>
        <Button variant="outline" asChild>
          <Link to="/oplclaw/community">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回社区
          </Link>
        </Button>
      </div>

      {/* Create Lab Form */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            实验室信息
          </CardTitle>
          <CardDescription>
            填写以下信息创建你的专属实验室
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">实验室名称</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="输入实验室名称"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discipline">学科领域</Label>
                  <Select
                    value={formData.discipline}
                    onValueChange={(value) => handleSelectChange('discipline', value)}
                  >
                    <SelectTrigger id="discipline">
                      <SelectValue placeholder="选择学科领域" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline.value} value={discipline.value}>
                          {discipline.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">实验室描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="描述你的实验室研究方向和目标"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">实验室头像</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="输入2-4个字符作为头像（如AI、NL等）"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverImage">封面图片URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="输入封面图片URL（可选）"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">实验室功能</h3>
              <div className="flex items-center gap-2">
                <Checkbox id="meetingSystem" defaultChecked />
                <Label htmlFor="meetingSystem">启用会议系统</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="projectManagement" defaultChecked />
                <Label htmlFor="projectManagement">启用项目管理</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="resourceSharing" defaultChecked />
                <Label htmlFor="resourceSharing">启用资源共享</Label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    创建实验室
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/oplclaw/community">
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="max-w-3xl mx-auto bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-orange-800 mb-2">创建实验室小贴士</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 选择一个清晰、专业的实验室名称</li>
                <li>• 详细描述实验室的研究方向和目标</li>
                <li>• 选择合适的学科领域，便于其他科研人员找到你的实验室</li>
                <li>• 创建后你可以邀请团队成员加入，管理科研项目和资源</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLabPage;