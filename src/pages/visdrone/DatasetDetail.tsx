import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  BookOpen, 
  Calendar,
  Tag,
  Download,
  Database,
  Image,
  FileText,
  Layers,
  BarChart3,
  Star
} from 'lucide-react';
import visdroneService from '@/services/visdroneService';
import { getDatasetImage } from '@/utils/aiImageGenerator';



// 获取数据集类别
const getCategoryLabel = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'detection': '目标检测',
    'tracking': '目标跟踪',
    'crowd': '人群分析',
    'multimodal': '多模态',
    'fusion': '图像融合',
  };
  return categoryMap[category] || '计算机视觉';
};

const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDatasetDetail();
  }, [id]);

  const loadDatasetDetail = async () => {
    try {
      const datasets = await visdroneService.getDatasets();
      const foundDataset = datasets.find((d: any) => d.id === id);
      if (foundDataset) {
        setDataset({
          ...foundDataset,
          image: getDatasetImage(foundDataset.name),
          categoryLabel: getCategoryLabel(foundDataset.category)
        });
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
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

  if (!dataset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">数据集未找到</h1>
        <Link to="/visdrone/data-base" className="text-primary hover:underline">
          返回数据集列表
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
            src={dataset.image}
            alt={dataset.name}
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
              to="/visdrone/data-base"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回数据集列表
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{dataset.name}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {dataset.categoryLabel}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm">
                {dataset.paper_venue} {dataset.paper_year}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
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
                  数据集介绍
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {dataset.description}
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  数据统计
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dataset.stats && Object.entries(dataset.stats).map(([key, value], index) => (
                    <div key={index} className="text-center p-4 rounded-xl bg-muted/50">
                      <div className="text-2xl font-bold text-primary">{value as string}</div>
                      <div className="text-xs text-muted-foreground capitalize mt-1">{key}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  支持任务
                </h2>
                <div className="flex flex-wrap gap-2">
                  {dataset.features?.map((feature: string, index: number) => (
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
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  相关论文
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{dataset.paper_title}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="text-primary">{dataset.paper_venue}</span>
                      <span>{dataset.paper_year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Citation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  引用格式
                </h2>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{`@article{${dataset.name.toLowerCase()}${dataset.paper_year},
  title={${dataset.paper_title}},
  author={${(dataset.authors || ['Zhu, Pengfei']).join(', ')}},
  journal={${dataset.paper_venue}},
  year={${dataset.paper_year}}
}`}</code>
                  </pre>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border p-6"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  数据集信息
                </h3>
                <div className="space-y-4">
                  {dataset.stars > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        <span>GitHub Stars</span>
                      </div>
                      <span className="font-semibold">{dataset.stars.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>发布年份</span>
                    </div>
                    <span className="font-semibold">{dataset.paper_year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span>许可证</span>
                    </div>
                    <span className="font-semibold">MIT</span>
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
                {dataset.github && (
                  <a
                    href={dataset.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    访问 GitHub
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  <Download className="w-5 h-5" />
                  下载数据集
                </button>
              </motion.div>

              {/* Related Datasets */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/50 rounded-2xl p-6"
              >
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  相关数据集
                </h3>
                <p className="text-xs text-muted-foreground">
                  查看同类型的其他数据集
                </p>
                <Link 
                  to={`/visdrone/data-base?category=${dataset.category}`}
                  className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                >
                  浏览更多
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DatasetDetail;
