import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Users, Shield, BarChart3, Database,
  Server, Wrench, FileText, Globe, Eye,
  Code, Cpu, Cloud, Store, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService, type User } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

// 系统状态数据
const systemStatus = {
  apiService: '正常',
  agentSystem: '运行中',
  database: '已连接',
  storage: '正常'
};

const resourceUsage = {
  apiQuota: '85% 可用',
  storage: '2.3GB / 10GB',
  activeAgents: '3 / 5',
  skills: '12 / 50'
};

const recentActivities = [
  { type: 'success', message: '技能更新完成', time: '5 分钟前' },
  { type: 'info', message: '智能体测试通过', time: '10 分钟前' },
  { type: 'info', message: '性能报告生成', time: '15 分钟前' },
  { type: 'success', message: '用户注册成功', time: '20 分钟前' }
];

const OplClawAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // 管理功能模块
  const adminModules = [
    // 核心管理功能
    {
      id: 'users',
      title: '用户管理',
      description: '管理平台用户、角色和权限',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'skills',
      title: '技能管理',
      description: '管理科研技能、分类和更新',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'agents',
      title: '智能体管理',
      description: '管理AI智能体、API配置和性能',
      icon: Cpu,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'autodl',
      title: 'AutoDL服务',
      description: '管理大模型API服务和使用情况',
      icon: Cloud,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'market',
      title: '智能体广场',
      description: '管理智能体广场和上架审核',
      icon: Store,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'system',
      title: '系统设置',
      description: '配置平台参数和系统设置',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // 处理登出
  const handleLogout = async () => {
    await authService.logout();
    navigate('/oplclaw');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-emerald-600" />
              <div>
                <h1 className="text-lg font-bold">OplClaw 后台管理</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                导出数据
              </Button>
              <Button size="sm" onClick={handleLogout}>
                <Wrench className="w-4 h-4 mr-2" />
                退出登录
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
          <h2 className="text-3xl font-bold mb-2">OplClaw 管理控制台</h2>
          <p className="text-muted-foreground">
            管理开放平台的用户、技能、智能体和系统设置
          </p>
        </motion.div>

        {/* 系统状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">系统状态</div>
                  <div className="text-lg font-semibold text-green-600">正常运行</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">活跃用户</div>
                  <div className="text-lg font-semibold">42</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">技能数量</div>
                  <div className="text-lg font-semibold">12</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">智能体数量</div>
                  <div className="text-lg font-semibold">8</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => setActiveTab(module.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${module.bgColor}`}>
                      <module.icon className={`w-6 h-6 ${module.color}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    进入管理
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 功能标签页 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">管理功能</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="overview">
                <Eye className="w-4 h-4 mr-2" />
                概览
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                用户管理
              </TabsTrigger>
              <TabsTrigger value="skills">
                <BookOpen className="w-4 h-4 mr-2" />
                技能管理
              </TabsTrigger>
              <TabsTrigger value="agents">
                <Cpu className="w-4 h-4 mr-2" />
                智能体管理
              </TabsTrigger>
              <TabsTrigger value="autodl">
                <Cloud className="w-4 h-4 mr-2" />
                AutoDL服务
              </TabsTrigger>
              <TabsTrigger value="system">
                <Settings className="w-4 h-4 mr-2" />
                系统设置
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 系统状态 */}
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
                            {systemStatus.apiService}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">智能体系统</span>
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {systemStatus.agentSystem}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">数据库</span>
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {systemStatus.database}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">存储服务</span>
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {systemStatus.storage}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 资源使用 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">资源使用</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">API 配额</span>
                          <span className="text-sm font-medium">{resourceUsage.apiQuota}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">存储空间</span>
                          <span className="text-sm font-medium">{resourceUsage.storage}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">活跃智能体</span>
                          <span className="text-sm font-medium">{resourceUsage.activeAgents}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">技能数量</span>
                          <span className="text-sm font-medium">{resourceUsage.skills}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 最近活动 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">最近活动</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-${activity.type === 'success' ? 'green' : 'blue'}-600`}>
                              {activity.type === 'success' ? '✓' : '●'}
                            </span>
                            <span className="text-muted-foreground">{activity.message}</span>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="users">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>用户管理</CardTitle>
                    <CardDescription>管理平台用户、角色和权限</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">用户管理功能</h3>
                      <p className="text-muted-foreground mb-4">管理平台用户、角色和权限</p>
                      <Button>查看用户列表</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="skills">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>技能管理</CardTitle>
                    <CardDescription>管理科研技能、分类和更新</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">技能管理功能</h3>
                      <p className="text-muted-foreground mb-4">管理科研技能、分类和更新</p>
                      <Button>查看技能列表</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="agents">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>智能体管理</CardTitle>
                    <CardDescription>管理AI智能体、API配置和性能</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Cpu className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">智能体管理功能</h3>
                      <p className="text-muted-foreground mb-4">管理AI智能体、API配置和性能</p>
                      <Button>查看智能体列表</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="autodl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>AutoDL服务</CardTitle>
                    <CardDescription>管理大模型API服务和使用情况</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Cloud className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">AutoDL服务管理</h3>
                      <p className="text-muted-foreground mb-4">管理大模型API服务和使用情况</p>
                      <Button>查看服务状态</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="system">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>系统设置</CardTitle>
                    <CardDescription>配置平台参数和系统设置</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">系统设置功能</h3>
                      <p className="text-muted-foreground mb-4">配置平台参数和系统设置</p>
                      <Button>进入系统设置</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 快速操作面板 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              快速操作
            </CardTitle>
            <CardDescription>
              常用的后台管理操作快捷入口
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('users')}>
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">用户管理</div>
                  <div className="text-xs text-muted-foreground">角色和权限</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('skills')}>
                <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">技能管理</div>
                  <div className="text-xs text-muted-foreground">分类和更新</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('agents')}>
                <Cpu className="w-4 h-4 mr-2 text-purple-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">智能体配置</div>
                  <div className="text-xs text-muted-foreground">API和模型</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-3" onClick={() => setActiveTab('system')}>
                <Settings className="w-4 h-4 mr-2 text-gray-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">系统设置</div>
                  <div className="text-xs text-muted-foreground">平台配置</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OplClawAdminDashboard;