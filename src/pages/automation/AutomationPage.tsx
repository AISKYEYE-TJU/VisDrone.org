import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket, Brain, Cpu, Palette, FileText, TrendingUp, FileCode,
  ChevronRight, Zap, Beaker, Clock, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const automationSystems = [
  {
    id: 'ai4research',
    title: 'AI4Research',
    description: '全流程自动化科研系统，从想法发现到论文完成',
    icon: <Brain className="w-6 h-6" />,
    href: '/oplclaw/automation/ai4research',
    badge: '核心',
    features: ['想法发现', '文献调研', '实验设计', '论文撰写', '同行评审'],
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'ai-scientist',
    title: 'AI Scientist v2',
    description: '端到端代理系统：假设→实验→分析→论文，首个AI撰写被接收论文',
    icon: <Cpu className="w-6 h-6" />,
    href: '/oplclaw/automation/ai-scientist',
    badge: '热门',
    features: ['假设生成', '实验设计', '数据分析', '论文撰写', '自动投稿'],
    color: 'from-purple-500 to-pink-600'
  },

  {
    id: 'ai4design',
    title: 'AI4DesignResearch',
    description: '设计研究专用系统，8阶段设计研究工作流',
    icon: <Palette className="w-6 h-6" />,
    href: '/oplclaw/automation/ai4design',
    features: ['问题定义', '文献综述', '方法设计', '原型开发', '用户研究'],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'proposal',
    title: '项目申请书生成',
    description: '自动撰写项目申请书，支持多种基金格式',
    icon: <FileText className="w-6 h-6" />,
    href: '/oplclaw/automation/proposal',
    features: ['研究背景', '研究目标', '技术路线', '预期成果', '经费预算'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'progress',
    title: '进展报告生成',
    description: '项目进展报告自动生成，追踪研究进度',
    icon: <TrendingUp className="w-6 h-6" />,
    href: '/oplclaw/automation/progress',
    features: ['进度追踪', '成果汇总', '问题分析', '下一步计划'],
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'conclusion',
    title: '结题报告生成',
    description: '项目结题报告自动生成，总结研究成果',
    icon: <FileCode className="w-6 h-6" />,
    href: '/oplclaw/automation/conclusion',
    features: ['研究总结', '成果展示', '经费决算', '后续展望'],
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 'nsfc-proposal',
    title: '自然基金项目申请',
    description: '基于 ChineseResearchLaTeX 模板，智能生成自然基金申请书',
    icon: <FileText className="w-6 h-6" />,
    href: '/oplclaw/automation/nsfc-proposal',
    badge: '新功能',
    features: ['模板支持', '智能分析', '质量检查', '格式规范', '代码推荐'],
    color: 'from-green-500 to-emerald-600'
  }
];

const AutomationPage: React.FC = () => {
  const location = useLocation();
  const isIndex = location.pathname === '/oplclaw/automation';

  if (!isIndex) {
    return <Outlet />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <Rocket className="w-3 h-3 mr-1" />
            自动化科研系统
          </Badge>
          <h1 className="text-3xl font-bold mb-3">端到端科研工作流</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            从科研想法到论文、项目申请书、进展报告、结题报告的全流程自动化
          </p>
        </motion.div>
        <div className="mt-6">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=automated%20scientific%20research%20workflow%2C%20AI%20assisted%20research%20laboratory%2C%20futuristic%20design%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20quality&image_size=landscape_16_9" 
            alt="自动化科研工作流" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '可用系统', value: '6+' },
          { label: '支持输出', value: '10+' },
          { label: '工作流阶段', value: '50+' },
          { label: '用户满意度', value: '95%' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automationSystems.map((system, i) => (
          <motion.div
            key={system.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={system.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${system.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {system.icon}
                    </div>
                    {system.badge && (
                      <Badge variant="secondary">{system.badge}</Badge>
                    )}
                  </div>
                  <CardTitle>{system.title}</CardTitle>
                  <CardDescription>{system.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {system.features.map((feature, j) => (
                      <Badge key={j} variant="outline" className="text-xs">
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

      {/* Workflow Description */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">自动化科研工作流</h3>
              <p className="text-muted-foreground mb-4">
                我们的自动化科研系统覆盖科研全生命周期，从想法发现到成果输出，每个环节都有智能辅助
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-indigo-600" />
                  <span>想法发现</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>文献调研</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>实验设计</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>论文撰写</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>同行评审</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPage;
