import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, Palette, FlaskConical, Users, FileText, 
  Sparkles, Target, BookOpen, PenTool, Layout,
  Lightbulb, TrendingUp, Zap, Layers, ArrowRight,
  GitBranch, Star, Clock, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const InternalHome: React.FC = () => {
  const researchTools = [
    {
      title: 'AI4Research',
      description: '自动化科研系统 - 从假设生成到论文撰写的全流程自动化',
      icon: <FlaskConical className="w-8 h-8" />,
      href: '/internal/ai4research',
      color: 'from-blue-500 to-cyan-500',
      features: ['假设生成', '批判评估', '文献调研', '方法开发', '论文撰写'],
      status: '运行中',
      users: 12
    },
    {
      title: 'AI4DesignResearch',
      description: '设计研究自动化系统 - 设计学+AI交叉学科专属研究工具',
      icon: <Palette className="w-8 h-8" />,
      href: '/internal/ai4design-research',
      color: 'from-purple-500 to-pink-500',
      features: ['问题界定', '用户研究', '创意生成', '原型设计', '体验评估'],
      status: '新上线',
      users: 8
    },
    {
      title: '智能体工作台',
      description: '设计智能体与科研智能体集合，支持自定义智能体创建',
      icon: <Brain className="w-8 h-8" />,
      href: '/internal/agents',
      color: 'from-amber-500 to-orange-500',
      features: ['设计智能体', '科研智能体', '自定义智能体', '智能体协作'],
      status: '开发中',
      users: 5
    },
    {
      title: '研究资源库',
      description: '文献管理、数据集、研究工具和模板资源',
      icon: <BookOpen className="w-8 h-8" />,
      href: '/internal/resources',
      color: 'from-green-500 to-emerald-500',
      features: ['文献管理', '数据集', '研究工具', '模板库'],
      status: '规划中',
      users: 0
    },
  ];

  const recentActivities = [
    { type: 'research', title: 'AI辅助设计创意生成研究', time: '2小时前', status: '进行中' },
    { type: 'design', title: '用户体验评估实验', time: '5小时前', status: '已完成' },
    { type: 'paper', title: 'CHI 2025 论文撰写', time: '昨天', status: '进行中' },
    { type: 'agent', title: '设计评论智能体训练', time: '2天前', status: '已完成' },
  ];

  const stats = [
    { label: '活跃研究项目', value: 8, icon: <Target className="w-5 h-5" />, change: '+2' },
    { label: '智能体调用次数', value: 1247, icon: <Zap className="w-5 h-5" />, change: '+156' },
    { label: '生成论文草稿', value: 23, icon: <FileText className="w-5 h-5" />, change: '+5' },
    { label: '团队成员', value: 15, icon: <Users className="w-5 h-5" />, change: '+1' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-white/80">欢迎回来</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">CHILAB 内部研究平台</h1>
          <p className="text-white/80 mb-6 max-w-2xl">
            人机协同设计实验室专属研究工具平台，集成设计智能体、科研智能体和自动化研究系统，
            助力设计学+人工智能交叉学科研究创新。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/internal/ai4research">
              <Button className="bg-white text-purple-600 hover:bg-white/90">
                <FlaskConical className="w-4 h-4 mr-2" />
                开始科研
              </Button>
            </Link>
            <Link to="/internal/ai4design-research">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Palette className="w-4 h-4 mr-2" />
                设计研究
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Brain className="w-48 h-48" />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change} 本周
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Research Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">研究工具</h2>
          <Button variant="ghost" size="sm">
            查看全部
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchTools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={tool.href}>
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white`}>
                        {tool.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={tool.status === '运行中' ? 'default' : tool.status === '新上线' ? 'secondary' : 'outline'}>
                          {tool.status}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" />
                          {tool.users}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              最近活动
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'research' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'design' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'paper' ? 'bg-green-100 text-green-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {activity.type === 'research' ? <FlaskConical className="w-5 h-5" /> :
                     activity.type === 'design' ? <Palette className="w-5 h-5" /> :
                     activity.type === 'paper' ? <FileText className="w-5 h-5" /> :
                     <Brain className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === '进行中' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              快速操作
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/internal/ai4research">
              <Button className="w-full justify-start" variant="outline">
                <FlaskConical className="w-4 h-4 mr-2" />
                新建科研项目
              </Button>
            </Link>
            <Link to="/internal/ai4design-research">
              <Button className="w-full justify-start" variant="outline">
                <Palette className="w-4 h-4 mr-2" />
                新建设计研究
              </Button>
            </Link>
            <Link to="/internal/agents">
              <Button className="w-full justify-start" variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                调用智能体
              </Button>
            </Link>
            <Link to="/internal/resources">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                浏览资源库
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            平台特性
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">多智能体协同</h4>
                <p className="text-sm text-muted-foreground">
                  支持多个智能体协同工作，实现复杂研究任务的自动化
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">跨学科融合</h4>
                <p className="text-sm text-muted-foreground">
                  专为设计学+AI交叉学科定制，融合设计思维与AI技术
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">智能创新</h4>
                <p className="text-sm text-muted-foreground">
                  AI驱动的创意生成与研究创新，提升研究效率和质量
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternalHome;
