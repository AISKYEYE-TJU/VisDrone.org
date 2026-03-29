import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Code2, Users, Sparkles, Zap, Globe, BookOpen, Brain, FlaskConical, Target, TrendingUp, Layers } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "规划智能体",
      description: "系统核心协调者，制定研究方案，分配任务给各专业智能体。",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "文献调研智能体",
      description: "检索相关论文，提取关键方法，构建竞争算法对比表。",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "假设生成智能体",
      description: "基于知识图谱提出创新性研究假设，评估技术可行性。",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "实验智能体",
      description: "生成高质量实验代码，执行训练任务，监控实验进度。",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: <FlaskConical className="w-8 h-8" />,
      title: "评测智能体",
      description: "自动化性能评测，多维度算法对比，生成评测报告。",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "论文写作智能体",
      description: "智能生成学术论文，支持LaTeX排版与图表生成。",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "同行评审智能体",
      description: "模拟同行评审流程，提供结构化评审报告与修改建议。",
      gradient: "from-slate-500 to-gray-600"
    }
  ];

  const news = [
    {
      date: "2026.2.14",
      title: "AI4R系统正式上线",
      content: "面向人工智能领域研究的第五范式多智能体系统，支持全自动与人机协作双模式。",
      icon: <Layers className="w-5 h-5" />
    },
    {
      date: "2026.2.12",
      title: "多模态融合算法库上线",
      content: "集成 35 个最新 SOTA 算法，覆盖红外与可见光图像融合领域。",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      date: "2026.2.10",
      title: "低空环境感知数据集发布",
      content: "发布 16 个多模态融合数据集，支持算法训练和评测。",
      icon: <Globe className="w-5 h-5" />
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
    <div className="home min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
                </linearGradient>
              </defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="url(#grid-gradient)" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          {/* Floating Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-violet-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
        </div>

        <div className="container relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-violet-200 text-sm mb-8"
            >
              <Layers className="w-4 h-4" />
              <span>AI for Research · 第五范式</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              AutoSota
              <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                AI4R 自动科学研究系统
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              AI4R 系统专注于人工智能领域自身的研究自动化，集成七类核心智能体，
              实现从文献调研、假设生成、实验设计到论文生成的完整研究闭环。
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            >
              {[
                { value: "207", label: "论文" },
                { value: "35", label: "算法" },
                { value: "16", label: "数据集" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-violet-300/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">七类核心智能体</h2>
          <p className="text-muted-foreground text-lg">每类智能体具有明确的职责边界、专用工具集和输入输出规范</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* News Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">最新动态</h2>
            <p className="text-muted-foreground text-lg">持续关注我们的最新进展</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {news.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-violet-600 dark:text-violet-400">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 p-12 md:p-16 text-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="cta-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" />
              </pattern>
              <rect width="100" height="100" fill="url(#cta-grid)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              开启第五范式科研新时代
            </h2>
            <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
              AI4R 系统将研究员从繁复的工程实现中解放出来，专注于高层创意与跨学科洞察，
              AI 系统则负责大规模、系统性的假设验证与方案探索。
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              开始使用 AI4R
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
