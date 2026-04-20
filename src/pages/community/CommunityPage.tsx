import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, FlaskConical, FolderOpen, FileText, Database,
  Code, Calendar, MessageSquare, TrendingUp, Star,
  ArrowRight, Plus, Zap, Globe, Award, BookOpen,
  Brain, Cloud, Lightbulb, Activity, Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { labService } from '@/services/labService';

const communityStats = [
  { label: '活跃实验室', value: '4' },
  { label: '科研项目', value: '32' },
  { label: '发表论文', value: '64' },
  { label: '社区成员', value: '49' }
];

// 学科分类的实验室数据（使用真实数据）
const disciplines = [
  {
    id: 'ai',
    name: '人工智能',
    icon: <Brain className="w-5 h-5" />,
    labs: []
  },
  {
    id: 'bio',
    name: '生物医学',
    icon: <Heart className="w-5 h-5" />,
    labs: []
  },
  {
    id: 'physics',
    name: '物理学',
    icon: <Activity className="w-5 h-5" />,
    labs: []
  },
  {
    id: 'engineering',
    name: '工程学',
    icon: <Zap className="w-5 h-5" />,
    labs: []
  },
  {
    id: 'other',
    name: '其他',
    icon: <BookOpen className="w-5 h-5" />,
    labs: []
  }
];

// 社区资源数据
const communityResources = [
  {
    id: 'data',
    name: '数据资源',
    icon: <Database className="w-5 h-5" />,
    description: '共享和管理科研数据集',
    count: '1,500+',
    examples: ['医学影像数据集', '自然语言处理语料库', '计算机视觉数据集']
  },
  {
    id: 'models',
    name: '模型资源',
    icon: <Brain className="w-5 h-5" />,
    description: '预训练模型和模型权重',
    count: '800+',
    examples: ['LLM模型', '计算机视觉模型', '语音识别模型']
  },
  {
    id: 'agents',
    name: '智能体资源',
    icon: <Zap className="w-5 h-5" />,
    description: '科研智能体和自动化工具',
    count: '300+',
    examples: ['文献综述智能体', '数据处理智能体', '实验设计智能体']
  },
  {
    id: 'skills',
    name: 'Skills资源',
    icon: <Lightbulb className="w-5 h-5" />,
    description: '科研技能和工具集',
    count: '450+',
    examples: ['NSFC标书撰写', '论文写作', '数据可视化']
  },
  {
    id: 'ai4r',
    name: 'AI4R资源',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'AI for Research相关资源',
    count: '600+',
    examples: ['科研方法指南', 'AI工具教程', '研究伦理规范']
  },
  {
    id: 'opl',
    name: 'OPL构建心得',
    icon: <FlaskConical className="w-5 h-5" />,
    description: '实验室建设和管理经验',
    count: '200+',
    examples: ['实验室搭建指南', '团队管理经验', '资源共享最佳实践']
  }
];

// 实验室产出动态数据
const labActivities = [
  {
    id: 1,
    type: 'paper',
    title: '基于深度学习的医学影像分割',
    lab: '医学影像分析组',
    author: '李博士',
    date: '2026-03-01',
    description: '提出了一种新的深度学习方法，用于医学影像的自动分割'
  },
  {
    id: 2,
    type: 'project',
    title: '智能机器人辅助手术系统',
    lab: '机器人实验室',
    author: '王教授',
    date: '2026-02-28',
    description: '开发了一套用于微创手术的智能机器人辅助系统'
  },
  {
    id: 3,
    type: 'agent',
    title: '文献综述智能体',
    lab: '自然语言处理组',
    author: '张同学',
    date: '2026-02-25',
    description: '设计并实现了一个自动进行文献综述的智能体系统'
  },
  {
    id: 4,
    type: 'system',
    title: '自动化药物筛选系统',
    lab: '药物设计实验室',
    author: '陈研究员',
    date: '2026-02-20',
    description: '构建了一个基于AI的自动化药物筛选和评估系统'
  },
  {
    id: 5,
    type: 'paper',
    title: '量子计算在材料科学中的应用',
    lab: '量子计算实验室',
    author: '刘教授',
    date: '2026-02-18',
    description: '探索了量子计算在新型材料设计中的应用潜力'
  },
  {
    id: 6,
    type: 'project',
    title: '环境监测与预测系统',
    lab: '环境工程实验室',
    author: '赵博士',
    date: '2026-02-15',
    description: '开发了一套基于IoT和AI的环境监测与预测系统'
  }
];

const recentActivities = [
  { user: '张教授', action: '创建了新项目', target: 'AI辅助药物设计', time: '2小时前' },
  { user: '李博士', action: '完成了文献综述', target: '大语言模型综述', time: '3小时前' },
  { user: '王同学', action: '提交了论文', target: 'CVPR 2024', time: '5小时前' },
  { user: '陈研究员', action: '分享了数据集', target: '医学影像数据集', time: '昨天' }
];

const featuredLabs = [
  { name: 'AI视觉实验室', members: 12, projects: 8, papers: 15, avatar: 'AI' },
  { name: '自然语言处理组', members: 8, projects: 5, papers: 12, avatar: 'NL' },
  { name: '计算生物学实验室', members: 15, projects: 10, papers: 20, avatar: 'CB' }
];

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('labs');
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // 检查是否为实验室详情页面或创建实验室页面
  const isLabDetailPage = location.pathname.includes('/community/lab/');
  const isCreateLabPage = location.pathname.includes('/community/create');

  // 如果是实验室详情页面或创建实验室页面，只渲染Outlet
  if (isLabDetailPage || isCreateLabPage) {
    return <Outlet />;
  }

  // 从数据库获取所有实验室
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setIsLoading(true);
        const allLabs = await labService.getAllLabs();
        setLabs(allLabs);
      } catch (error) {
        console.error('获取实验室列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabs();
  }, []);

  // 获取所有实验室
  const getAllLabs = () => {
    return labs;
  };

  // 获取按学科分类的实验室
  const getLabsByDiscipline = () => {
    const allLabs = getAllLabs();
    return {
      '人工智能': allLabs.filter(lab => lab.discipline === '人工智能'),
      '生物医学': allLabs.filter(lab => lab.discipline === '生物医学'),
      '物理学': allLabs.filter(lab => lab.discipline === '物理学'),
      '工程学': allLabs.filter(lab => lab.discipline === '工程学'),
      '其他': allLabs.filter(lab => lab.discipline === '其他')
    };
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <Users className="w-3 h-3 mr-1" />
            OPL 社区
          </Badge>
          <h1 className="text-3xl font-bold mb-3">开放实验室社区</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            搭建你的专属实验室，管理智能体、项目、论文、数据、代码和科研活动
          </p>
        </motion.div>
        <div className="mt-6">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=research%20community%20collaboration%2C%20scientists%20working%20together%2C%20modern%20laboratory%20environment%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20setting&image_size=landscape_16_9" 
            alt="OPL 社区" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {communityStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-3xl mx-auto">
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            学科实验室
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            社区资源
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            实验室动态
          </TabsTrigger>
        </TabsList>

        {/* 学科实验室 Tab */}
        <TabsContent value="labs" className="mt-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">OPL 实验室</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="bg-orange-50 text-orange-600">
                全部
              </Button>
              <Button variant="ghost" size="sm">
                人工智能
              </Button>
              <Button variant="ghost" size="sm">
                生物医学
              </Button>
              <Button variant="ghost" size="sm">
                工程学
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mb-4"></div>
                <p className="text-muted-foreground">加载实验室列表中...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAllLabs().map((lab) => (
                <Card key={lab.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={lab.coverImage}
                      alt={lab.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-white">
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold">
                          {lab.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white">
                        <h4 className="font-semibold text-sm">{lab.name}</h4>
                        <p className="text-xs text-white/80">
                          {lab.members} 成员 · {lab.projects || lab.projectCount} 项目
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-100 text-orange-600">
                        {lab.discipline}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {lab.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {lab.paperCount} 论文
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/oplclaw/community/lab/${lab.id}`}>
                          访问实验室
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 社区资源 Tab */}
        <TabsContent value="resources" className="mt-6 space-y-6">
          <h2 className="text-2xl font-bold">社区资源</h2>
          <p className="text-muted-foreground">
            探索和共享科研资源，包括数据、模型、智能体、技能和AI4R相关资源
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-all hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      {resource.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-xs text-muted-foreground">{resource.count} 资源</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <div className="space-y-1 mb-3">
                    {resource.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    浏览资源
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 实验室动态 Tab */}
        <TabsContent value="activities" className="mt-6 space-y-6">
          <h2 className="text-2xl font-bold">实验室产出动态</h2>
          <p className="text-muted-foreground">
            查看社区实验室的最新产出，包括论文、项目、智能体和自动化系统
          </p>
          <div className="space-y-4">
            {labActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      {activity.type === 'paper' && (
                        <FileText className="w-5 h-5 text-blue-600" />
                      )}
                      {activity.type === 'project' && (
                        <FolderOpen className="w-5 h-5 text-green-600" />
                      )}
                      {activity.type === 'agent' && (
                        <Zap className="w-5 h-5 text-purple-600" />
                      )}
                      {activity.type === 'system' && (
                        <Code className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {activity.type === 'paper' && '论文'}
                          {activity.type === 'project' && '项目'}
                          {activity.type === 'agent' && '智能体'}
                          {activity.type === 'system' && '系统'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>实验室: {activity.lab}</span>
                        <span>作者: {activity.author}</span>
                        <span>日期: {activity.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Lab CTA */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white mt-12">
        <CardContent className="py-8 text-center">
          <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="font-bold text-xl mb-3">创建你的OPL实验室</h3>
          <p className="text-sm text-white/80 mb-6 max-w-2xl mx-auto">
            搭建专属科研空间，邀请团队成员协作，管理科研项目和资源
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              window.location.href = '/oplclaw/community/create';
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            创建实验室
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityPage;
