import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Code, FlaskConical, FileText, BookOpen, Users, Database,
  Zap, Network, Target, TrendingUp, ChevronRight, ArrowRight, 
  Cpu, GitBranch, BarChart3, Layers, Settings, Sparkles,
  Play, Pause, RefreshCw
} from 'lucide-react';

const HumanMachineResearch = () => {
  const agents = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "规划智能体",
      nameEn: "Planning Agent",
      description: "系统核心协调者，制定研究方案，分配任务给各专业智能体",
      capabilities: [
        "研究问题解析与意图理解",
        "研究方案制定与任务分解",
        "智能体协调与资源调度",
        "进度监控与异常处理"
      ],
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50 dark:bg-violet-900/20"
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "文献调研智能体",
      nameEn: "Literature Survey Agent",
      description: "检索相关论文，提取关键方法，构建竞争算法对比表",
      capabilities: [
        "多源文献检索与去重",
        "关键方法自动提取",
        "研究空白识别",
        "技术演化树构建"
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: "假设生成智能体",
      nameEn: "Hypothesis Generation Agent",
      description: "基于知识图谱提出创新性研究假设，评估技术可行性",
      capabilities: [
        "跨领域知识关联与合成",
        "创新点自动挖掘",
        "可行性评估与优先级排序",
        "备选假设生成"
      ],
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      icon: <Code className="w-10 h-10" />,
      title: "实验智能体",
      nameEn: "Experiment Agent",
      description: "生成高质量实验代码，执行训练任务，监控实验进度",
      capabilities: [
        "代码模板化生成",
        "静态分析与Bug预警",
        "GPU任务调度与监控",
        "异常自动处理与重试"
      ],
      gradient: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      icon: <FlaskConical className="w-10 h-10" />,
      title: "评测智能体",
      nameEn: "Evaluation Agent",
      description: "自动化性能评测，多维度算法对比，生成评测报告",
      capabilities: [
        "标准Benchmark评测",
        "统计显著性检验",
        "消融分析与误差分析",
        "SOTA对比与排名"
      ],
      gradient: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20"
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "论文写作智能体",
      nameEn: "Paper Writing Agent",
      description: "智能生成学术论文，支持LaTeX排版与图表生成",
      capabilities: [
        "论文结构自动组织",
        "图表数据可视化",
        "引用格式化",
        "多语言论文生成"
      ],
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "同行评审智能体",
      nameEn: "Peer Review Agent",
      description: "模拟同行评审流程，提供结构化评审报告与修改建议",
      capabilities: [
        "创新性评估",
        "实验严谨性检查",
        "写作质量评价",
        "修改建议生成"
      ],
      gradient: "from-slate-500 to-gray-600",
      bgColor: "bg-slate-50 dark:bg-slate-900/20"
    }
  ];

  const pipelineStages = [
    {
      step: "01",
      title: "问题定义",
      agent: "规划智能体",
      description: "解析研究问题意图，确定目标Benchmark与评测指标",
      output: "研究目标与评测方案"
    },
    {
      step: "02",
      title: "文献调研",
      agent: "文献调研智能体",
      description: "检索相关论文，提取关键方法，识别研究空白",
      output: "文献综述与对比表"
    },
    {
      step: "03",
      title: "假设生成",
      agent: "假设生成智能体",
      description: "基于文献分析提出改进假设，评估技术可行性",
      output: "结构化假设列表"
    },
    {
      step: "04",
      title: "实验设计",
      agent: "实验智能体",
      description: "设计实验对照组，生成基线代码，配置数据集管道",
      output: "实验代码与配置"
    },
    {
      step: "05",
      title: "实验执行",
      agent: "实验智能体",
      description: "提交GPU任务，监控训练进度，处理异常与失败",
      output: "原始实验结果"
    },
    {
      step: "06",
      title: "结果分析",
      agent: "评测智能体",
      description: "统计显著性检验，消融分析，与SOTA对比",
      output: "评测报告与可视化"
    },
    {
      step: "07",
      title: "论文生成",
      agent: "论文写作智能体",
      description: "组织论文结构，撰写各章节，生成图表",
      output: "论文草稿"
    },
    {
      step: "08",
      title: "评审迭代",
      agent: "同行评审智能体",
      description: "模拟同行评审，根据反馈修改，输出最终版本",
      output: "最终论文"
    }
  ];

  const coreModules = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Benchmark管理模块",
      description: "集成主流数据集，实时追踪SOTA，自动评测与排名",
      features: ["多源数据融合", "SOTA变更检测", "趋势分析预测", "方法溯源"]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "实验执行引擎",
      description: "代码生成验证，计算资源调度，实验全程追踪",
      features: ["模板化代码生成", "GPU集群调度", "MLflow集成", "完全可复现"]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "知识管理系统",
      description: "研究知识图谱，实验记忆库，支持知识复用与迁移",
      features: ["论文-算法-数据集关联", "血缘追踪", "空白识别", "迁移推荐"]
    }
  ];

  const designGoals = [
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
      icon: <GitBranch className="w-6 h-6" />,
      title: "SOTA追踪与超越",
      description: "持续追踪最优算法，以超越SOTA为核心目标"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "人机协作弹性",
      description: "支持全自动与人机协作模式的灵活切换"
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "知识积累闭环",
      description: "研究成果形成结构化知识库，支持增量学习"
    }
  ];

  return (
    <div className="human-machine-research min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-20">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                <circle cx="7.5" cy="7.5" r="0.8" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hero-grid)" />
          </svg>
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-80 h-80 bg-violet-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-violet-200 text-sm mb-6"
            >
              <Layers className="w-4 h-4" />
              <span>AI for Research · 第五范式</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              AI4R 系统
            </h1>
            <p className="text-2xl md:text-3xl text-violet-200 mb-6">
              面向人工智能领域研究的第五范式多智能体系统
            </p>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
              AI4R 系统专注于人工智能领域自身的研究自动化，实现从文献调研、假设生成、实验设计到论文生成的完整研究闭环。
              系统采用分层架构设计，包含七类核心智能体，支持全自动与人机协作双模式运行。
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <Play className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">全自动模式</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">人机协作模式</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Goals Section */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">核心设计目标</h2>
          <p className="text-muted-foreground">AI4R 系统的五大设计维度</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {designGoals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-200 dark:border-slate-700 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white mb-4">
                {goal.icon}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{goal.title}</h3>
              <p className="text-muted-foreground text-sm">{goal.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dual Mode Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">双模式运行机制</h2>
            <p className="text-muted-foreground">灵活适应不同研究场景</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <Play className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">全自动模式</h3>
                  <p className="text-sm text-muted-foreground">Auto Mode</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                从研究问题输入开始，由规划智能体制定研究方案，各专业智能体协同执行，无需人工干预，最终输出实验报告与论文草稿。
              </p>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground mb-2">适用场景：</p>
                {[
                  "标准Benchmark的自动探索与算法优化",
                  "大规模消融实验的批量执行",
                  "已有算法的自动复现与基线建立",
                  "系统性超参数搜索"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">人机协作模式</h3>
                  <p className="text-sm text-muted-foreground">HMAAI Mode</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                引入人类研究员作为高层决策节点，在关键决策点介入并指导智能体行为，实现人机深度协作。
              </p>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground mb-2">协作接口：</p>
                {[
                  "研究方向确认与优先级设定",
                  "实验设计的专家评审与修正",
                  "异常实验结果的人工解释",
                  "论文核心贡献的人工提炼与润色"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seven Agents Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">七类核心智能体</h2>
          <p className="text-muted-foreground">每类智能体具有明确的职责边界、专用工具集和输入输出规范</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-xl ${agent.bgColor} p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${agent.gradient} text-white mb-4 shadow-lg`}>
                  {agent.icon}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1">
                  {agent.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {agent.nameEn}
                </p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {agent.description}
                </p>

                <div className="space-y-2">
                  {agent.capabilities.slice(0, 3).map((capability, capIndex) => (
                    <div key={capIndex} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-violet-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Research Pipeline Section */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-20 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">标准研究流程</h2>
            <p className="text-violet-200">以 DAG 形式组织的完整研究闭环</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineStages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold mb-4">
                  {stage.step}
                </div>

                <h3 className="text-lg font-bold mb-1">{stage.title}</h3>
                <p className="text-xs text-violet-300 mb-3">{stage.agent}</p>
                <p className="text-violet-100/80 text-sm mb-4 leading-relaxed">
                  {stage.description}
                </p>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <ArrowRight className="w-3 h-3 text-violet-300" />
                    <span className="text-violet-200">输出：</span>
                    <span className="text-white font-medium">{stage.output}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">核心功能模块</h2>
          <p className="text-muted-foreground">支撑智能体协同工作的基础设施</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {coreModules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white mb-6 shadow-lg">
                {module.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{module.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{module.description}</p>

              <div className="space-y-3">
                {module.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">分层系统架构</h2>
            <p className="text-muted-foreground">自顶向下，职责清晰，接口标准化</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {[
                { layer: "交互层", desc: "Web管理界面、API接口、人机协作工作台", icon: <Settings className="w-5 h-5" /> },
                { layer: "编排层", desc: "工作流引擎、任务调度、状态管理", icon: <Network className="w-5 h-5" /> },
                { layer: "智能体层", desc: "七类核心智能体、通信协议、协作机制", icon: <Brain className="w-5 h-5" /> },
                { layer: "执行层", desc: "代码执行引擎、GPU调度、实验追踪", icon: <Cpu className="w-5 h-5" /> },
                { layer: "知识层", desc: "知识图谱、向量存储、实验记忆库", icon: <Database className="w-5 h-5" /> }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-foreground">{item.layer}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <div className="text-2xl font-bold text-slate-200 dark:text-slate-700">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Loop Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">自适应工作流机制</h2>
          <p className="text-muted-foreground">应对研究过程中的预期之外情况</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { icon: <RefreshCw className="w-6 h-6" />, title: "失败重试策略", desc: "实验失败后自动分析原因并调整参数，支持多轮重试" },
            { icon: <GitBranch className="w-6 h-6" />, title: "假设剪枝", desc: "依据初步实验结果动态评估并放弃低潜力假设" },
            { icon: <ArrowRight className="w-6 h-6" />, title: "方向转向", desc: "当主要假设被证伪时，自动从备选假设中选取新方向" },
            { icon: <Users className="w-6 h-6" />, title: "人工干预触发", desc: "当置信度低于阈值时，自动请求人类专家介入" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="cta-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" />
              </pattern>
              <rect width="100" height="100" fill="url(#cta-pattern)" />
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
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                开始使用 AI4R
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                查看技术文档
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HumanMachineResearch;
