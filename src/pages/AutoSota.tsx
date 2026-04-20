import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Brain, BookOpen, Sparkles, Code2, FlaskConical, FileText, Users, Layers, Target, TrendingUp, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const AutoSota: React.FC = () => {

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "规划智能体",
      description: "系统核心协调者，制定研究方案，分配任务给各专业智能体。",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "文献调研智能体",
      description: "检索相关论文，提取关键方法，构建竞争算法对比表。",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "假设生成智能体",
      description: "基于知识图谱提出创新性研究假设，评估技术可行性。",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "实验智能体",
      description: "生成高质量实验代码，执行训练任务，监控实验进度。",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: <FlaskConical className="w-6 h-6" />,
      title: "评测智能体",
      description: "自动化性能评测，多维度算法对比，生成评测报告。",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "论文写作智能体",
      description: "智能生成学术论文，支持LaTeX排版与图表生成。",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "同行评审智能体",
      description: "模拟同行评审流程，提供结构化评审报告与修改建议。",
      gradient: "from-slate-500 to-gray-600"
    }
  ];

  const highlights = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "自主研究能力",
      description: "从文献调研到论文生成的完整研究流程自动化"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Benchmark导向",
      description: "以标准数据集和公认指标为锚点，确保可验证性"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "知识积累闭环",
      description: "研究成果形成结构化知识库，支持增量学习"
    }
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20research%20automation%20system%2C%20machine%20learning%20models%20visualization%2C%20futuristic%20data%20dashboard%2C%20blue%20and%20purple%20gradient%2C%20no%20text%2C%20clean%20professional%20design&image_size=landscape_16_9" 
            alt="AutoSota Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Layers className="w-4 h-4" />
              <span>AI for Research · 第五范式</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              AutoSota
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              AI4R 系统专注于人工智能领域自身的研究自动化，集成七类核心智能体，实现从文献调研、假设生成、实验设计到论文生成的完整研究闭环。
            </p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-12 max-w-2xl"
            >
              {
                [
                  { value: "207", label: "论文" },
                  { value: "35", label: "算法" },
                  { value: "16", label: "数据集" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))
              }
            </motion.div>
            
            <div className="flex flex-wrap gap-4 mt-12">
              <Link to="/autosota">
                <Button size="lg" className="rounded-full">
                  访问 AutoSota 系统 <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur">
                了解更多 <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-background rounded-xl p-6 shadow-md border border-border"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            七类核心智能体
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            每类智能体具有明确的职责边界、专用工具集和输入输出规范
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-xl bg-background border border-border p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">开启第五范式科研新时代</h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              AI4R 系统将研究员从繁复的工程实现中解放出来，专注于高层创意与跨学科洞察，AI 系统则负责大规模、系统性的假设验证与方案探索。
            </p>
            <Link to="/autosota">
              <Button size="lg" className="rounded-full">
                访问 AutoSota 系统 <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AutoSota;