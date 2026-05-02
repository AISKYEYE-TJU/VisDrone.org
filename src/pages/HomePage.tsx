import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Rocket, Store, Cloud, Users, ArrowRight,
  Zap, Beaker, FileText, Code, Database, Globe,
  Sparkles, TrendingUp, Shield, Clock, Star, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: '自动化科研系统',
      description: '从科研想法到论文、项目申请书、进展报告、结题报告的全流程自动化',
      href: '/oplclaw/automation',
      color: 'from-indigo-500 to-purple-600',
      stats: '6+ 系统',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20scientific%20laboratory%20with%20AI%20technology%2C%20research%20workflow%2C%20futuristic%20design%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20quality&image_size=landscape_16_9'
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: '科研智能体广场',
      description: '文献综述、科学假设生成、编程实现、论文写作等单任务智能体',
      href: '/oplclaw/market',
      color: 'from-emerald-500 to-teal-600',
      stats: '20+ 智能体',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=many%20virtual%20robots%20in%20marketplace%2C%20cute%20AI%20robots%20collection%2C%20colorful%20digital%20assistants%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20design&image_size=landscape_16_9'
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'AutoDL 服务',
      description: '主流大模型 API 服务，支撑自动化科研系统和科研智能体运行',
      href: '/oplclaw/autodl',
      color: 'from-blue-500 to-cyan-600',
      stats: '50+ 模型',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cloud%20computing%20service%2C%20AI%20models%20in%20cloud%2C%20technology%20infrastructure%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20modern%20design&image_size=landscape_16_9'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'OPL 社区',
      description: '搭建你的专属实验室，管理智能体、项目、论文、数据、代码和科研活动',
      href: '/oplclaw/community',
      color: 'from-orange-500 to-red-600',
      stats: '开放平台',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=research%20community%20collaboration%2C%20scientists%20working%20together%2C%20modern%20laboratory%20environment%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20setting&image_size=landscape_16_9'
    }
  ];

  const automationSystems = [
    { title: 'AI4Research', description: '全流程自动化科研系统', href: '/oplclaw/automation/ai4research', badge: '核心' },
    { title: 'AI Scientist', description: '论文自动生成系统', href: '/oplclaw/automation/ai-scientist', badge: '热门' },
    { title: 'AI4DesignResearch', description: '设计研究专用系统', href: '/oplclaw/automation/ai4design' },
    { title: '项目申请书生成', description: '自动撰写项目申请书', href: '/oplclaw/automation/proposal' },
    { title: '进展报告生成', description: '项目进展报告自动生成', href: '/oplclaw/automation/progress' },
    { title: '结题报告生成', description: '项目结题报告自动生成', href: '/oplclaw/automation/conclusion' }
  ];

  const popularAgents = [
    { title: '文献综述智能体', description: '深度文献分析与综述', icon: <FileText className="w-5 h-5" />, href: '/oplclaw/market/literature-review' },
    { title: 'STORM', description: '斯坦福知识策展系统', icon: <Zap className="w-5 h-5" />, href: '/oplclaw/market/storm' },
    { title: 'GPT Researcher', description: '多源信息采集研究', icon: <Globe className="w-5 h-5" />, href: '/oplclaw/market/gpt-researcher' },
    { title: 'ASReview', description: '主动学习文献筛选', icon: <Beaker className="w-5 h-5" />, href: '/oplclaw/market/asreview' }
  ];

  const stats = [
    { value: '10,000+', label: '科研用户' },
    { value: '50+', label: '可用模型' },
    { value: '20+', label: '科研智能体' },
    { value: '100 万+', label: '处理任务' }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=multi-agent%20autonomous%20research%20system%2C%20AI%20agents%20collaborating%20on%20scientific%20research%2C%20futuristic%20laboratory%20with%20digital%20holograms%2C%20blue%20and%20purple%20gradient%2C%20abstract%20scientific%20visualization%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20design%2C%20ultra%20wide%20background&image_size=landscape_16_9" 
            alt="Multi-Agent Research" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>AI4R开放创新平台</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              OplClaw
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              OplClaw 是面向全球科研工作者的 AI4R 开放平台，通过先进的自动化科研系统和科研智能体，将科研人员从繁琐的重复劳动中解放出来，让科学家和研究人员能够聚焦于更具科学价值的研究问题，以更高效率和质量推动人类科技进步。
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/oplclaw/automation">
                  开始自动化科研 <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur">
                <Link to="/oplclaw/market">
                  浏览智能体广场
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Main Modules */}
      <section className="bg-secondary/50 py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">四大核心模块</h2>
              <p className="text-muted-foreground">
                全方位支撑科研工作，从自动化科研系统到智能体广场，从大模型服务到开放社区。
              </p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link to="/oplclaw" className="flex items-center">
                探索平台 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
              >
                <Link to={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="pt-4">
                      <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={feature.image} 
                          alt={feature.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{feature.stats}</Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Automation Systems */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">自动化科研系统</h2>
              <p className="text-muted-foreground">端到端科研工作流，从想法到成果</p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link to="/oplclaw/automation">
                查看全部 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationSystems.map((system, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={system.href}>
                  <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{system.title}</h3>
                            {system.badge && (
                              <Badge variant="secondary" className="text-xs">{system.badge}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{system.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Agents */}
      <section className="bg-secondary/50 py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">热门科研智能体</h2>
              <p className="text-muted-foreground">单任务科研智能体，精准高效</p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link to="/oplclaw/market">
                浏览广场 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularAgents.map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={agent.href}>
                  <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          {agent.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{agent.title}</h3>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <Brain className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl font-bold mb-6">开启你的智能科研之旅</h2>
              <p className="text-primary-foreground/80 text-lg mb-10">
                加入 OplClaw，体验 AI 驱动的科研新方式，让科研工作更高效、更智能、更开放。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="secondary" size="lg" className="rounded-full">
                  <Link to="/oplclaw/automation">
                    免费开始
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-primary-foreground/20 hover:bg-white/10">
                  <Link to="/oplclaw/community">
                    了解更多
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;