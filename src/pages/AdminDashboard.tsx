import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, TestTube, BarChart3, Brain, 
  Bot, Users, RefreshCw, Download, Upload,
  Database, Activity, Server, Wrench,
  FileText, BookOpen, Globe, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AcademicSkillsUpdaterAgent from '@/components/AcademicSkillsUpdaterAgent';
import ContentManager from '@/pages/admin/ContentManager';
import AgentManagement from '@/pages/AgentManagement';
import SiteConfig from '@/pages/admin/SiteConfig';
import SystemMonitor from '@/pages/admin/SystemMonitor';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // 管理功能模块
  const adminModules = [
    // 核心管理功能
    {
      id: 'content',
      title: '内容管理',
      description: '管理研究项目、出版物和团队成员',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      component: ContentManager
    },
    {
      id: 'agents',
      title: '智能体管理',
      description: '管理 AI 智能体、API 配置、测试和性能分析',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      component: AgentManagement
    },
    {
      id: 'site',
      title: '网站配置',
      description: '配置实验室信息和网站设置',
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      component: SiteConfig
    },
    {
      id: 'monitor',
      title: '系统监控',
      description: '监控系统性能和运行状态',
      icon: Eye,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      component: SystemMonitor
    },
    // 调试和测试工具
    {
      id: 'skills',
      title: '学术技能管理',
      description: '更新和管理 OpenClaw 学术技能',
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      component: AcademicSkillsUpdaterAgent
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold">后台管理系统</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出配置
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                导入配置
              </Button>
              <Button size="sm">
                <Wrench className="w-4 h-4 mr-2" />
                系统设置
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-6">
        {/* 页面标题 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold mb-2">管理控制台</h2>
          <p className="text-muted-foreground">
            集成学术技能更新、智能体测试、性能分析等后台管理功能
          </p>
        </motion.div>

        {/* 功能模块网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {adminModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  module.comingSoon ? 'opacity-60' : ''
                }`}
                onClick={() => !module.comingSoon && setActiveTab(module.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${module.bgColor}`}>
                      <module.icon className={`w-6 h-6 ${module.color}`} />
                    </div>
                    {module.comingSoon && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        开发中
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={module.comingSoon}
                  >
                    {module.comingSoon ? '即将推出' : '进入管理'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 功能标签页 - 核心管理功能 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">核心管理功能</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="content">
                <FileText className="w-4 h-4 mr-2" />
                内容管理
              </TabsTrigger>
              <TabsTrigger value="agents">
                <Brain className="w-4 h-4 mr-2" />
                智能体与 API
              </TabsTrigger>
              <TabsTrigger value="site">
                <Globe className="w-4 h-4 mr-2" />
                网站配置
              </TabsTrigger>
              <TabsTrigger value="monitor">
                <Eye className="w-4 h-4 mr-2" />
                系统监控
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ContentManager />
              </motion.div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <AgentManagement />
              </motion.div>
            </TabsContent>

            <TabsContent value="site" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <SiteConfig />
              </motion.div>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <SystemMonitor />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 功能标签页 - 调试工具 */}
        <div>
          <h3 className="text-lg font-bold mb-4">调试与测试工具</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 lg:w-[200px]">
              <TabsTrigger value="skills">学术技能</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <AcademicSkillsUpdaterAgent />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 快速操作面板 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              快速操作
            </CardTitle>
            <CardDescription>
              常用的后台管理操作快捷入口
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('content')}>
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">管理内容</div>
                  <div className="text-xs text-muted-foreground">项目和出版物</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('agents')}>
                <Brain className="w-4 h-4 mr-2 text-green-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">智能体配置</div>
                  <div className="text-xs text-muted-foreground">API 和模型设置</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('monitor')}>
                <Activity className="w-4 h-4 mr-2 text-red-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">系统监控</div>
                  <div className="text-xs text-muted-foreground">性能和健康状态</div>
                </div>
              </Button>


            </div>
          </CardContent>
        </Card>

        {/* 系统状态 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">系统状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API 服务</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    正常
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">智能体系统</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    运行中
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">知识库</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    已连接
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">资源使用</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API 配额</span>
                  <span className="text-sm font-medium">85% 可用</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">存储空间</span>
                  <span className="text-sm font-medium">2.3GB / 10GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">活跃智能体</span>
                  <span className="text-sm font-medium">3 / 5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-muted-foreground">技能更新完成</span>
                  <span className="text-xs text-muted-foreground">5 分钟前</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">●</span>
                  <span className="text-muted-foreground">智能体测试通过</span>
                  <span className="text-xs text-muted-foreground">10 分钟前</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">●</span>
                  <span className="text-muted-foreground">性能报告生成</span>
                  <span className="text-xs text-muted-foreground">15 分钟前</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
