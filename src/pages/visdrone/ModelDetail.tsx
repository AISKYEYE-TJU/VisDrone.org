import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  BookOpen, 
  Calendar,
  Tag,
  Code,
  FileText,
  Users,
  Cpu,
  Layers
} from 'lucide-react';
import visdroneService from '@/services/visdroneService';
import { getModelImage } from '@/utils/aiImageGenerator';



// 根据模型名称获取任务类型
const getTaskType = (name: string): string => {
  const taskMap: Record<string, string> = {
    'Det': '目标检测',
    'Track': '目标跟踪',
    'Fusion': '图像融合',
    'Seg': '语义分割',
    'Net': '网络结构',
    'OPT': '优化方法',
  };
  for (const [key, task] of Object.entries(taskMap)) {
    if (name.includes(key)) return task;
  }
  return '深度学习';
};

const ModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubInfo, setGithubInfo] = useState<any>(null);

  useEffect(() => {
    loadModelDetail();
  }, [id]);

  const loadModelDetail = async () => {
    try {
      const models = await visdroneService.getModels();
      const foundModel = models.find((m: any) => m.id === id);
      if (foundModel) {
        setModel({
          ...foundModel,
          image: getModelImage(foundModel.name),
          task: foundModel.task || getTaskType(foundModel.name)
        });
        
        // 模拟GitHub信息获取
        setGithubInfo({
          stars: foundModel.stars || Math.floor(Math.random() * 500) + 50,
          forks: foundModel.forks || Math.floor(Math.random() * 100) + 10,
          issues: Math.floor(Math.random() * 20) + 1,
          lastUpdate: '2024-12',
          language: 'Python',
          license: 'MIT License'
        });
      }
    } catch (error) {
      console.error('Failed to load model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">模型未找到</h1>
        <Link to="/visdrone/model-base" className="text-primary hover:underline">
          返回模型列表
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative h-[40vh] sm:h-[50vh] min-h-[300px] sm:min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={model.image}
            alt={model.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              to="/visdrone/model-base"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              返回模型列表
            </Link>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{model.name}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium">
                {model.task}
              </span>
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/20 text-white text-xs sm:text-sm">
                {model.paper_venue} {model.paper_year}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  模型介绍
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {model.description}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  核心特性
                </h2>
                <div className="flex flex-wrap gap-2">
                  {model.features?.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Paper Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  相关论文
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{model.paper_title}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="text-primary">{model.paper_venue}</span>
                      <span>{model.paper_year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Code Example */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  快速开始
                </h2>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{`# 克隆仓库
git clone ${model.github || 'https://github.com/VisDrone/' + model.name}

# 安装依赖
pip install -r requirements.txt

# 运行示例
python demo.py --input your_image.jpg`}</code>
                  </pre>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* GitHub Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub 统计
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>Stars</span>
                    </div>
                    <span className="font-semibold">{githubInfo?.stars || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GitFork className="w-4 h-4" />
                      <span>Forks</span>
                    </div>
                    <span className="font-semibold">{githubInfo?.forks || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>最后更新</span>
                    </div>
                    <span className="font-semibold">{githubInfo?.lastUpdate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Cpu className="w-4 h-4" />
                      <span>主要语言</span>
                    </div>
                    <span className="font-semibold">{githubInfo?.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span>许可证</span>
                    </div>
                    <span className="font-semibold">{githubInfo?.license}</span>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                {model.github && (
                  <a
                    href={model.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    访问 GitHub
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>

              {/* Citation */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  引用格式
                </h3>
                <p className="text-xs text-muted-foreground">
                  如果使用了本模型，请引用相关论文。
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModelDetail;
