import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Brain, Palette, FlaskConical, Users, FileText, 
  Settings, LogOut, Menu, X, ChevronRight,
  Sparkles, Target, BookOpen, PenTool, Layout,
  Lightbulb, TrendingUp, Zap, Layers, Database, FileCode,
  Search, Cpu, FileSearch, Atom
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigationItems = [
  {
    title: '研究工作台',
    icon: <Layout className="w-5 h-5" />,
    href: '/internal',
    description: '研究工作台首页'
  },
  {
    title: 'AI4Research',
    icon: <FlaskConical className="w-5 h-5" />,
    href: '/internal/ai4research',
    description: '自动化科研系统',
    badge: '核心'
  },
  {
    title: 'AI4DesignResearch',
    icon: <Palette className="w-5 h-5" />,
    href: '/internal/ai4design-research',
    description: '设计研究自动化系统',
    badge: '新'
  },
  {
    title: '文献综述智能体',
    icon: <BookOpen className="w-5 h-5" />,
    href: '/internal/literature-review',
    description: '深度文献综述系统'
  },
  {
    title: 'STORM 智能体',
    icon: <Sparkles className="w-5 h-5" />,
    href: '/internal/storm',
    description: '斯坦福知识策展系统',
    badge: '专业'
  },
  {
    title: 'OpenScholar 智能体',
    icon: <Database className="w-5 h-5" />,
    href: '/internal/openscholar',
    description: 'Allen AI 学术检索增强'
  },
  {
    title: 'SurveyX 智能体',
    icon: <FileCode className="w-5 h-5" />,
    href: '/internal/surveyx',
    description: '学术综述论文生成'
  },
  {
    title: 'AI Scientist',
    icon: <Cpu className="w-5 h-5" />,
    href: '/internal/ai-scientist',
    description: 'SakanaAI 自动化科研',
    badge: '新'
  },
  {
    title: 'GPT Researcher',
    icon: <Search className="w-5 h-5" />,
    href: '/internal/gpt-researcher',
    description: '多源信息采集研究',
    badge: '新'
  },
  {
    title: 'AutoRA',
    icon: <FlaskConical className="w-5 h-5" />,
    href: '/internal/autora',
    description: '理论生成与实验验证',
    badge: '新'
  },
  {
    title: 'ASReview',
    icon: <FileSearch className="w-5 h-5" />,
    href: '/internal/asreview',
    description: '主动学习文献筛选',
    badge: '新'
  },
  {
    title: 'ChemCrow',
    icon: <Atom className="w-5 h-5" />,
    href: '/internal/chemcrow',
    description: '化学任务推理工具',
    badge: '新'
  },
  {
    title: '智能体中心',
    icon: <Brain className="w-5 h-5" />,
    href: '/internal/agents',
    description: '设计智能体与科研智能体'
  },
  {
    title: '研究资源',
    icon: <Layers className="w-5 h-5" />,
    href: '/internal/resources',
    description: '文献、数据与工具'
  },
  {
    title: '团队协作',
    icon: <Users className="w-5 h-5" />,
    href: '/internal/collaboration',
    description: '团队项目与任务'
  },
];

const InternalLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <Link to="/internal" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CHILAB 内部研究平台
                </h1>
                <p className="text-xs text-muted-foreground">人机协同设计实验室</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-600">研究模式</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      研究员
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">研究员</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      researcher@chilab.edu
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="px-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <h4 className="font-medium text-sm text-slate-700 mb-2">快速开始</h4>
            <p className="text-xs text-slate-500 mb-3">
              选择一个研究工具开始你的工作
            </p>
            <div className="space-y-2">
              <Link to="/internal/ai4research">
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <FlaskConical className="w-4 h-4 mr-2" />
                  科研自动化
                </Button>
              </Link>
              <Link to="/internal/ai4design-research">
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Palette className="w-4 h-4 mr-2" />
                  设计研究
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default InternalLayout;
