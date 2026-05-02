import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, FlaskConical, Users, FileText, FolderOpen, Video,
  Plus, Save, X, ArrowLeft, Bot, GraduationCap,
  MessageSquare, Calendar, Clock, Check, AlertCircle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { labService } from '@/services/labService';

interface AgentStudent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  research: string;
  publications: number;
  projects: number;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  link?: string;
  category?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  members: string[];
  funding?: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  agenda: string;
  participants: string[];
}

const OPLAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const { labId: paramLabId } = useParams<{ labId: string }>();
  // 从 URL 参数中获取 labId
  const searchParams = new URLSearchParams(window.location.search);
  const queryLabId = searchParams.get('labId');
  const labId = paramLabId || queryLabId;
  const [activeTab, setActiveTab] = useState('agents');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 智能体学生表单
  const [agentStudent, setAgentStudent] = useState({
    name: '',
    avatar: '🤖',
    title: '科研智能体',
    research: '',
    publications: 0,
    projects: 0
  });

  // 论文表单
  const [paper, setPaper] = useState({
    title: '',
    authors: '',
    venue: '',
    year: new Date().getFullYear().toString(),
    category: ''
  });

  // 项目表单
  const [project, setProject] = useState({
    name: '',
    description: '',
    status: 'ongoing',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    members: '',
    funding: ''
  });

  // 会议表单
  const [meeting, setMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    agenda: '',
    participants: ''
  });

  const handleAgentStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgentStudent(prev => ({ ...prev, [name]: value }));
  };

  const handlePaperChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaper(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleMeetingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeeting(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAgentStudent = async () => {
    setIsLoading(true);
    try {
      const newAgent = await labService.addAgentStudent(labId!, {
        name: agentStudent.name,
        avatar: agentStudent.avatar,
        title: agentStudent.title,
        research: agentStudent.research,
        publications: parseInt(agentStudent.publications.toString()) || 0,
        projects: parseInt(agentStudent.projects.toString()) || 0
      });

      setSuccessMessage('智能体学生创建成功！');
      // 重置表单
      setAgentStudent({
        name: '',
        avatar: '🤖',
        title: '科研智能体',
        research: '',
        publications: 0,
        projects: 0
      });
    } catch (error) {
      console.error('添加智能体学生失败:', error);
      setSuccessMessage('创建智能体学生失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaper = async () => {
    setIsLoading(true);
    try {
      const newPaper = await labService.addPaper(labId!, {
        title: paper.title,
        authors: paper.authors.split(',').map(a => a.trim()),
        venue: paper.venue,
        year: parseInt(paper.year) || new Date().getFullYear(),
        category: paper.category
      });

      setSuccessMessage('论文添加成功！');
      // 重置表单
      setPaper({
        title: '',
        authors: '',
        venue: '',
        year: new Date().getFullYear().toString(),
        category: ''
      });
    } catch (error) {
      console.error('添加论文失败:', error);
      setSuccessMessage('添加论文失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    setIsLoading(true);
    try {
      const newProject = await labService.addProject(labId!, {
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.startDate,
        end_date: project.endDate,
        members: project.members.split(',').map(m => m.trim()),
        funding: project.funding
      });

      setSuccessMessage('项目添加成功！');
      // 重置表单
      setProject({
        name: '',
        description: '',
        status: 'ongoing',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        members: '',
        funding: ''
      });
    } catch (error) {
      console.error('添加项目失败:', error);
      setSuccessMessage('添加项目失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    setIsLoading(true);
    try {
      await labService.updateMeetingSystem(labId!, {
        enabled: true,
        schedule: '每周一次',
        next_meeting: `${meeting.date} ${meeting.time}`
      });

      setSuccessMessage('会议安排成功！');
      // 重置表单
      setMeeting({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        agenda: '',
        participants: ''
      });
    } catch (error) {
      console.error('安排会议失败:', error);
      setSuccessMessage('安排会议失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        onClick={() => navigate(labId ? `/oplclaw/community/lab/${labId}` : '/oplclaw/community')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回
      </Button>

      {/* 智能体头部 */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">OPL 智能体助手</h1>
              <p className="text-white/80">
                帮助你管理实验室，创建智能体学生，录入论文和项目，安排人机组会
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成功消息 */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">{successMessage}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSuccessMessage('')}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* 功能标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-4xl mx-auto">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            创建智能体学生
          </TabsTrigger>
          <TabsTrigger value="papers" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            录入论文
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            录入项目
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            安排组会
          </TabsTrigger>
        </TabsList>

        {/* 创建智能体学生 */}
        <TabsContent value="agents" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                创建虚拟智能体学生
              </CardTitle>
              <CardDescription>
                为你的实验室添加智能体学生，协助科研工作
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">智能体名称</Label>
                  <Input
                    id="agentName"
                    name="name"
                    value={agentStudent.name}
                    onChange={handleAgentStudentChange}
                    placeholder="输入智能体名称"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentAvatar">智能体头像</Label>
                  <Input
                    id="agentAvatar"
                    name="avatar"
                    value={agentStudent.avatar}
                    onChange={handleAgentStudentChange}
                    placeholder="输入emoji或字符"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentTitle">智能体 title</Label>
                <Input
                  id="agentTitle"
                  name="title"
                  value={agentStudent.title}
                  onChange={handleAgentStudentChange}
                  placeholder="输入智能体 title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentResearch">研究方向</Label>
                <Textarea
                  id="agentResearch"
                  name="research"
                  value={agentStudent.research}
                  onChange={handleAgentStudentChange}
                  placeholder="输入研究方向"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentPublications">论文数量</Label>
                  <Input
                    id="agentPublications"
                    name="publications"
                    type="number"
                    value={agentStudent.publications}
                    onChange={handleAgentStudentChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentProjects">项目数量</Label>
                  <Input
                    id="agentProjects"
                    name="projects"
                    type="number"
                    value={agentStudent.projects}
                    onChange={handleAgentStudentChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddAgentStudent}
                disabled={isLoading || !agentStudent.name}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    创建智能体学生
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 录入论文 */}
        <TabsContent value="papers" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                录入论文
              </CardTitle>
              <CardDescription>
                添加实验室的论文成果
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paperTitle">论文标题</Label>
                <Input
                  id="paperTitle"
                  name="title"
                  value={paper.title}
                  onChange={handlePaperChange}
                  placeholder="输入论文标题"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paperAuthors">作者（逗号分隔）</Label>
                <Input
                  id="paperAuthors"
                  name="authors"
                  value={paper.authors}
                  onChange={handlePaperChange}
                  placeholder="输入作者姓名，用逗号分隔"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paperVenue">发表 venue</Label>
                  <Input
                    id="paperVenue"
                    name="venue"
                    value={paper.venue}
                    onChange={handlePaperChange}
                    placeholder="输入发表 venue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paperYear">发表年份</Label>
                  <Input
                    id="paperYear"
                    name="year"
                    type="number"
                    value={paper.year}
                    onChange={handlePaperChange}
                    placeholder="2026"
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paperCategory">论文分类</Label>
                <Input
                  id="paperCategory"
                  name="category"
                  value={paper.category}
                  onChange={handlePaperChange}
                  placeholder="输入论文分类"
                />
              </div>
              <Button
                onClick={handleAddPaper}
                disabled={isLoading || !paper.title || !paper.authors || !paper.venue}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    录入中...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    录入论文
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 录入项目 */}
        <TabsContent value="projects" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
                录入项目
              </CardTitle>
              <CardDescription>
                添加实验室的科研项目
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">项目名称</Label>
                <Input
                  id="projectName"
                  name="name"
                  value={project.name}
                  onChange={handleProjectChange}
                  placeholder="输入项目名称"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">项目描述</Label>
                <Textarea
                  id="projectDescription"
                  name="description"
                  value={project.description}
                  onChange={handleProjectChange}
                  placeholder="输入项目描述"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectStatus">项目状态</Label>
                  <Select
                    value={project.status}
                    onValueChange={(value) => setProject(prev => ({ ...prev, status: value as 'ongoing' | 'completed' }))}
                  >
                    <SelectTrigger id="projectStatus">
                      <SelectValue placeholder="选择项目状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectFunding"> funding</Label>
                  <Input
                    id="projectFunding"
                    name="funding"
                    value={project.funding}
                    onChange={handleProjectChange}
                    placeholder="输入项目 funding"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectStartDate">开始日期</Label>
                  <Input
                    id="projectStartDate"
                    name="startDate"
                    type="date"
                    value={project.startDate}
                    onChange={handleProjectChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectEndDate">结束日期</Label>
                  <Input
                    id="projectEndDate"
                    name="endDate"
                    type="date"
                    value={project.endDate}
                    onChange={handleProjectChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectMembers">项目成员（逗号分隔）</Label>
                <Input
                  id="projectMembers"
                  name="members"
                  value={project.members}
                  onChange={handleProjectChange}
                  placeholder="输入项目成员，用逗号分隔"
                />
              </div>
              <Button
                onClick={handleAddProject}
                disabled={isLoading || !project.name || !project.description || !project.startDate}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    录入中...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    录入项目
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安排组会 */}
        <TabsContent value="meetings" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-orange-600" />
                安排人机组会
              </CardTitle>
              <CardDescription>
                为实验室安排人机组会，促进团队交流
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meetingTitle">会议标题</Label>
                <Input
                  id="meetingTitle"
                  name="title"
                  value={meeting.title}
                  onChange={handleMeetingChange}
                  placeholder="输入会议标题"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meetingDate">会议日期</Label>
                  <Input
                    id="meetingDate"
                    name="date"
                    type="date"
                    value={meeting.date}
                    onChange={handleMeetingChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingTime">会议时间</Label>
                  <Input
                    id="meetingTime"
                    name="time"
                    type="time"
                    value={meeting.time}
                    onChange={handleMeetingChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingAgenda">会议议程</Label>
                <Textarea
                  id="meetingAgenda"
                  name="agenda"
                  value={meeting.agenda}
                  onChange={handleMeetingChange}
                  placeholder="输入会议议程"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingParticipants">参会人员（逗号分隔）</Label>
                <Input
                  id="meetingParticipants"
                  name="participants"
                  value={meeting.participants}
                  onChange={handleMeetingChange}
                  placeholder="输入参会人员，用逗号分隔"
                  required
                />
              </div>
              <Button
                onClick={handleScheduleMeeting}
                disabled={isLoading || !meeting.title || !meeting.date || !meeting.time || !meeting.agenda || !meeting.participants}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    安排中...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    安排组会
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 智能体说明 */}
      <Card className="bg-indigo-50 border-indigo-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-indigo-800 mb-2">OPL 智能体助手说明</h4>
              <p className="text-sm text-indigo-700 mb-2">
                OPL 智能体助手可以帮助你：
              </p>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• 创建虚拟智能体学生，协助你的科研工作</li>
                <li>• 录入实验室的论文成果，记录科研产出</li>
                <li>• 录入科研项目，跟踪项目进展</li>
                <li>• 安排人机组会，促进团队交流与协作</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OPLAgentPage;