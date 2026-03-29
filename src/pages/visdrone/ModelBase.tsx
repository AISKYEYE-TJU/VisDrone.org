import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, ExternalLink, Star, Code, GitFork, Search, Filter, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import visdroneService from '@/services/visdroneService';
import { getModelImage, getHeroImage } from '@/utils/aiImageGenerator';

// 共同标签定义 - 用于筛选
const COMMON_TAGS = [
  { id: 'detection', label: '目标检测', icon: '🎯' },
  { id: 'tracking', label: '目标跟踪', icon: '📍' },
  { id: 'counting', label: '目标计数', icon: '🔢' },
  { id: 'low-level', label: '底层视觉', icon: '✨' },
  { id: 'graph', label: '图学习', icon: '🔗' },
  { id: 'multi-view', label: '多视角学习', icon: '👁️' },
  { id: 'multimodal', label: '多模态学习', icon: '🔄' },
  { id: 'multi-drone', label: '多机协同', icon: '🚁' },
  { id: 'continual', label: '持续学习', icon: '🔁' },
  { id: 'semi-supervised', label: '半监督学习', icon: '🎓' },
  { id: 'architecture', label: '模型架构', icon: '🏗️' },
];

const ModelBase: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'stars' | 'newest'>('stars');

  useEffect(() => { loadModels(); }, []);

  const loadModels = async () => {
    try {
      const data = await visdroneService.getModels();
      const modelsWithImages = data.map((model: any) => ({
        ...model,
        image: model.image || getModelImage(model.name, model.task),
        commonTags: COMMON_TAGS
          .filter(tag => {
            const taskLower = (model.task || '').toLowerCase();
            const featuresLower = (model.features || []).map((f: string) => f.toLowerCase());
            const nameLower = (model.name || '').toLowerCase();
            switch (tag.id) {
              case 'detection': return taskLower.includes('检测') || featuresLower.some(f => f.includes('检测'));
              case 'tracking': return taskLower.includes('跟踪') || featuresLower.some(f => f.includes('跟踪')) || nameLower.includes('transmdot');
              case 'counting': return taskLower.includes('计数') || featuresLower.some(f => f.includes('计数'));
              case 'low-level': return featuresLower.some(f => f.includes('去雨') || f.includes('去噪') || f.includes('去模糊') || f.includes('增强') || f.includes('超分辨率') || f.includes('去雾'));
              case 'graph': return featuresLower.some(f => f.includes('图学习') || f.includes('graph'));
              case 'multi-view': return featuresLower.some(f => f.includes('多视角') || f.includes('multi-view') || f.includes('跨视角'));
              case 'multimodal': return featuresLower.some(f => f.includes('多模态') || f.includes('rgb-红外') || f.includes('跨模态'));
              case 'continual': return featuresLower.some(f => f.includes('持续学习') || f.includes('增量学习') || f.includes(' continual'));
              case 'semi-supervised': return featuresLower.some(f => f.includes('半监督'));
              case 'multi-drone': return featuresLower.some(f => f.includes('多机协同') || f.includes('多无人机')) || nameLower.includes('transmdot');
              case 'architecture': return featuresLower.some(f => f.includes('网络') || f.includes('架构') || f.includes(' backbone') || f.includes('transformer'));
              default: return false;
            }
          })
          .map(tag => tag.id),
        uniqueTags: (model.features || []).slice(0, 3),
      }));
      const sortedData = modelsWithImages.sort((a: any, b: any) => (b.stars || 0) - (a.stars || 0));
      setModels(sortedData);
    } catch (error) {
      console.error('Failed to load models:', error);
      setModels(getDefaultModels());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultModels = () => {
    const defaultData = [
      {
        id: '1',
        name: '图类增量学习',
        description: '基于图的类增量学习方法，支持持续学习场景下的新类别识别',
        task: '目标检测',
        paper_title: 'Graph-based Class-Incremental Learning',
        paper_venue: 'NeurIPS',
        paper_year: '2024',
        stars: 128,
        forks: 32,
        github: 'https://github.com/VisDrone',
        features: ['增量学习', '图神经网络', '持续学习'],
        image: getModelImage('图类增量学习', '目标检测')
      },
      {
        id: '2',
        name: '半监督持续学习',
        description: '半监督场景下的持续学习框架，利用未标注数据提升模型性能',
        task: '目标检测',
        paper_title: 'Semi-Supervised Continual Learning',
        paper_venue: 'NeurIPS',
        paper_year: '2024',
        stars: 96,
        forks: 24,
        github: 'https://github.com/VisDrone',
        features: ['半监督', '持续学习', '自训练'],
        image: getModelImage('半监督持续学习', '目标检测')
      },
      {
        id: '3',
        name: '小目标检测',
        description: '专门针对无人机视角下小目标检测的深度学习模型',
        task: '目标检测',
        paper_title: 'Small Object Detection in Drone Imagery',
        paper_venue: 'CVPR',
        paper_year: '2024',
        stars: 256,
        forks: 64,
        github: 'https://github.com/VisDrone',
        features: ['小目标', '多尺度', '特征融合'],
        image: getModelImage('小目标检测', '目标检测')
      },
      {
        id: '4',
        name: '零样本目标检测',
        description: '零样本场景下的目标检测方法，支持未见类别的检测',
        task: '目标检测',
        paper_title: 'Zero-Shot Object Detection',
        paper_venue: 'IJCV',
        paper_year: '2024',
        stars: 312,
        forks: 78,
        github: 'https://github.com/VisDrone',
        features: ['零样本', '语义嵌入', '视觉-语言'],
        image: getModelImage('零样本目标检测', '目标检测')
      },
      {
        id: '5',
        name: '多目标跟踪',
        description: '基于深度学习的多目标跟踪算法，支持复杂场景下的目标关联',
        task: '目标跟踪',
        paper_title: 'Deep Multi-Object Tracking',
        paper_venue: 'CVPR',
        paper_year: '2023',
        stars: 189,
        forks: 45,
        github: 'https://github.com/VisDrone',
        features: ['多目标跟踪', '数据关联', '在线学习'],
        image: getModelImage('多目标跟踪', '目标跟踪')
      },
      {
        id: '6',
        name: '人群计数网络',
        description: '针对高密度人群场景的计数网络，支持无人机视角下的人群密度估计',
        task: '目标计数',
        paper_title: 'Crowd Counting in Drone Imagery',
        paper_venue: 'ECCV',
        paper_year: '2023',
        stars: 145,
        forks: 36,
        github: 'https://github.com/VisDrone',
        features: ['密度估计', '注意力机制', '多尺度'],
        image: getModelImage('人群计数网络', '目标计数')
      },
    ];

    return defaultData.map(model => ({
      ...model,
      commonTags: COMMON_TAGS
        .filter(tag => {
          const taskLower = (model.task || '').toLowerCase();
          const featuresLower = (model.features || []).map((f: string) => f.toLowerCase());
          const nameLower = (model.name || '').toLowerCase();
          switch (tag.id) {
            case 'detection': return taskLower.includes('检测') || featuresLower.some(f => f.includes('检测'));
            case 'tracking': return taskLower.includes('跟踪') || featuresLower.some(f => f.includes('跟踪')) || nameLower.includes('transmdot');
            case 'counting': return taskLower.includes('计数') || featuresLower.some(f => f.includes('计数'));
            case 'low-level': return featuresLower.some(f => f.includes('去雨') || f.includes('去噪') || f.includes('去模糊') || f.includes('增强') || f.includes('超分辨率') || f.includes('去雾'));
            case 'graph': return featuresLower.some(f => f.includes('图学习') || f.includes('graph'));
            case 'multi-view': return featuresLower.some(f => f.includes('多视角') || f.includes('multi-view') || f.includes('跨视角'));
            case 'multimodal': return featuresLower.some(f => f.includes('多模态') || f.includes('rgb-红外') || f.includes('跨模态'));
            case 'continual': return featuresLower.some(f => f.includes('持续学习') || f.includes('增量学习') || f.includes(' continual'));
            case 'semi-supervised': return featuresLower.some(f => f.includes('半监督'));
            case 'multi-drone': return featuresLower.some(f => f.includes('多机协同') || f.includes('多无人机')) || nameLower.includes('transmdot');
            case 'architecture': return featuresLower.some(f => f.includes('网络') || f.includes('架构') || f.includes(' backbone') || f.includes('transformer'));
            default: return false;
          }
        })
        .map(tag => tag.id),
      uniqueTags: (model.features || []).slice(0, 3),
    }));
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTag === '' || model.commonTags?.includes(selectedTag);
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tagId: string) => {
    setSelectedTag(prev => prev === tagId ? '' : tagId);
  };

  // 排序
  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'stars') {
      return (b.stars || 0) - (a.stars || 0);
    }
    return (b.paper_year || 0) - (a.paper_year || 0);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${getHeroImage('model')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">模型基座</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              围绕智能无人系统环境感知，团队开发了面向深度网络结构、目标检测、目标分割、目标追踪和目标计数等领域的模型和算法
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${models.length}+`, label: '开源模型', icon: <Brain className="w-5 h-5" /> },
              { value: models.reduce((sum, m) => sum + (m.stars || 0), 0).toLocaleString(), label: 'GitHub Stars', icon: <Star className="w-5 h-5" /> },
              { value: '5', label: '任务类型', icon: <Filter className="w-5 h-5" /> },
              { value: '100%', label: '开源', icon: <Code className="w-5 h-5" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-4 sm:py-6 sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索模型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              {/* Common Tags Filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mr-1 sm:mr-2 flex-shrink-0">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  筛选:
                </span>
                {COMMON_TAGS.map(tag => {
                  const isActive = selectedTag === tag.id;
                  const count = models.filter(m => m.commonTags?.includes(tag.id)).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                    >
                      {tag.icon} {tag.label}
                      <span className="hidden sm:inline"> ({count})</span>
                    </button>
                  );
                })}
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag('')}
                    className="px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 transition-all whitespace-nowrap"
                  >
                    清除
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'stars' | 'newest')}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="stars">按 Stars 排序</option>
                  <option value="newest">最新发布</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : sortedModels.length === 0 ? (
            <div className="text-center py-20">
              <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">未找到匹配的模型</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border bg-card hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Model Image */}
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{model.name}</h3>
                      <span className="text-sm text-white/80">{model.task}</span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{model.stars || 0}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{model.description}</p>

                    {/* Common Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {model.commonTags?.map((tagId: string) => {
                        const tag = COMMON_TAGS.find(t => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <span
                            key={tagId}
                            onClick={() => toggleTag(tagId)}
                            className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
                          >
                            {tag.icon} {tag.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Unique Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {model.uniqueTags?.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Paper Info */}
                    <div className="pt-4 border-t text-sm mb-4">
                      <p className="text-muted-foreground line-clamp-1">{model.paper_title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary font-medium">{model.paper_venue}</span>
                        <span className="text-muted-foreground">{model.paper_year}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/visdrone/model-base/${model.id}`}
                        className="flex-1 px-4 py-2 text-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        查看详情
                      </Link>
                      {model.github && (
                        <a
                          href={model.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Code className="w-4 h-4" />
                          代码
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold mb-4">贡献您的模型</h2>
            <p className="text-muted-foreground mb-6">
              欢迎将您的模型贡献到VisDrone模型基座，与社区分享您的研究成果
            </p>
            <a
              href="mailto:zhupengfei@tju.edu.cn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              联系我们
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModelBase;
