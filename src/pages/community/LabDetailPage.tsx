import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, FileText, FolderOpen, Database, Brain, Zap, Lightbulb,
  ArrowLeft, Mail, MapPin, Globe, Award, BookOpen, Calendar,
  Clock, ExternalLink, Download, Star, Heart, Activity, FlaskConical,
  Video, MessageSquare, Bot, User, GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { labService } from '@/services/labService';

const LabDetailPage: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const [lab, setLab] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLabDetail = async () => {
      if (!labId) {
        setError('实验室ID不存在');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const labData = await labService.getLabById(labId);
        setLab(labData);
      } catch (err) {
        console.error('获取实验室详情失败:', err);
        setError('获取实验室详情失败');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLabDetail();
  }, [labId]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">加载实验室详情中...</h1>
      </div>
    );
  }
  
  if (error || !lab) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">实验室不存在</h1>
        <Button onClick={() => navigate('/oplclaw/community')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回社区页面
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
      {/* 返回按钮和智能体助手按钮 */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/oplclaw/community')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回社区
        </Button>
        <Button
          variant="default"
          className="ml-auto bg-indigo-600 hover:bg-indigo-700"
          asChild
        >
          <Link to={`/oplclaw/market/opl-agent?labId=${labId}`}>
            <Brain className="w-4 h-4 mr-2" />
            OPL 智能体助手
          </Link>
        </Button>
      </div>

      {/* 实验室封面和头部信息 */}
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src={lab.coverImage}
            alt={lab.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-4 mb-3">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-2xl font-bold">
                  {lab.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">{lab.name}</h1>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {lab.members} 成员
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    {lab.projectCount} 项目
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {lab.paperCount} 论文
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground mb-4">{lab.description}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FlaskConical className="w-3 h-3" />
              {lab.discipline}
            </Badge>
            {lab.meetingSystem?.enabled && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                <Video className="w-3 h-3 mr-1" />
                人机组会系统已启用
              </Badge>
            )}
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1">
              <Brain className="w-3 h-3" />
              科研助理已配备
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 科研助理卡片 */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0">
              <Brain className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">实验室科研助理</h3>
              <p className="text-muted-foreground mb-4">
                你的专属OPL智能体助手，帮助你管理实验室、维护科研资源、更新实验室信息
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-sm">智能体管理</span>
                  </div>
                  <p className="text-xs text-muted-foreground">创建和管理虚拟智能体学生</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">科研成果管理</span>
                  </div>
                  <p className="text-xs text-muted-foreground">录入和管理论文、项目</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-sm">人机组会</span>
                  </div>
                  <p className="text-xs text-muted-foreground">安排和管理团队会议</p>
                </div>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link to={`/oplclaw/market/opl-agent?labId=${lab.id}`} className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  访问科研助理
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 实验室详细信息 */}
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-4xl mx-auto">
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            团队成员
          </TabsTrigger>
          <TabsTrigger value="papers" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            论文项目
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            开放资源
          </TabsTrigger>
          <TabsTrigger value="meeting" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            人机组会
          </TabsTrigger>
        </TabsList>

        {/* 团队成员 Tab */}
        <TabsContent value="team" className="mt-6 space-y-6">
          {/* PI 信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                实验室负责人 (PI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-3xl font-bold">
                    {lab.pi.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{lab.pi.name}</h3>
                  <p className="text-muted-foreground mb-2">{lab.pi.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    研究方向：{lab.pi.research}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {lab.pi.email}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      {lab.pi.publications} 篇论文
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <FolderOpen className="w-4 h-4" />
                      {lab.pi.projects} 个项目
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 人类学生 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                人类学生
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(lab.humanStudents || []).map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-xs text-muted-foreground">{student.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        研究方向：{student.research}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{student.publications} 篇论文</span>
                        <span>·</span>
                        <span>{student.projects} 个项目</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 虚拟智能体学生 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                虚拟智能体学生
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(lab.agentStudents || []).map((agent) => (
                  <Card key={agent.id} className="border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                            {agent.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-xs text-muted-foreground">{agent.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        研究方向：{agent.research}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{agent.publications} 篇论文</span>
                        <span>·</span>
                        <span>{agent.projects} 个项目</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 论文项目 Tab */}
        <TabsContent value="papers" className="mt-6 space-y-6">
          {/* 论文列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                代表性论文
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(lab.publications || []).map((paper) => (
                  <Card key={paper.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{paper.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {paper.authors.join(', ')}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="secondary">{paper.venue}</Badge>
                            <span className="text-muted-foreground">{paper.year}</span>
                            {paper.category && (
                              <Badge variant="outline">{paper.category}</Badge>
                            )}
                          </div>
                        </div>
                        {paper.link && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={paper.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 项目列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
                科研项目
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(lab.researchProjects || []).map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{project.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant={project.status === 'ongoing' ? 'default' : 'secondary'}>
                              {project.status === 'ongoing' ? '进行中' : '已完成'}
                            </Badge>
                            <span className="text-muted-foreground">
                              {project.startDate} - {project.endDate || '至今'}
                            </span>
                            {project.funding && (
                              <Badge variant="outline">{project.funding}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {project.members.join(', ')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 开放资源 Tab */}
        <TabsContent value="resources" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                开放资源
              </CardTitle>
              <CardDescription>
                实验室公开共享的数据集、模型和智能体资源
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(lab.resources || []).map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          {resource.type === 'dataset' && (
                            <Database className="w-6 h-6 text-blue-600" />
                          )}
                          {resource.type === 'model' && (
                            <Brain className="w-6 h-6 text-purple-600" />
                          )}
                          {resource.type === 'agent' && (
                            <Zap className="w-6 h-6 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {resource.type === 'dataset' && '数据集'}
                            {resource.type === 'model' && '模型'}
                            {resource.type === 'agent' && '智能体'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {resource.downloads} 次下载
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            访问资源
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 人机组会系统 Tab */}
        <TabsContent value="meeting" className="mt-6 space-y-6">
          {lab.meetingSystem?.enabled ? (
            <>
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Video className="w-5 h-5" />
                    人机组会系统
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">固定组会时间</p>
                        <p className="font-semibold">{lab.meetingSystem.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">下次组会</p>
                        <p className="font-semibold">{lab.meetingSystem.nextMeeting}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">参会人员</p>
                        <p className="font-semibold">
                          {((lab.humanStudents || []).length + (lab.agentStudents || []).length + 1)} 人
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Video className="w-4 h-4 mr-2" />
                      加入组会
                    </Button>
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      查看历史组会
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 参会人员列表 */}
              <Card>
                <CardHeader>
                  <CardTitle>参会人员</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PI */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
                      <Avatar>
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {lab.pi.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lab.pi.name}</p>
                        <p className="text-xs text-muted-foreground">实验室负责人</p>
                      </div>
                      <Badge className="ml-auto bg-orange-100 text-orange-700">PI</Badge>
                    </div>
                    
                    {/* 人类学生 */}
                    {(lab.humanStudents || []).map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.title}</p>
                        </div>
                        <Badge className="ml-auto bg-blue-100 text-blue-700">人类学生</Badge>
                      </div>
                    ))}
                    
                    {/* 智能体学生 */}
                    {(lab.agentStudents || []).map((agent) => (
                      <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                            {agent.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.title}</p>
                        </div>
                        <Badge className="ml-auto bg-purple-100 text-purple-700">智能体</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">人机组会系统未启用</h3>
                <p className="text-muted-foreground">该实验室暂未启用人机组会系统</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabDetailPage;
