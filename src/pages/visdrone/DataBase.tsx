import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database, ExternalLink, Download, Search, Filter, FileText, Image, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import visdroneService from '@/services/visdroneService';
import { getDatasetImage, getHeroImage } from '@/utils/aiImageGenerator';
import { localDatabase } from '@/lib/localDatabase';

// 共同标签定义 - 用于筛选
const COMMON_TAGS = [
  { id: 'detection', label: '目标检测', icon: '🎯' },
  { id: 'tracking', label: '目标跟踪', icon: '📍' },
  { id: 'counting', label: '目标计数', icon: '🔢' },
  { id: 'multi-drone', label: '多机协同', icon: '🚁' },
  { id: 'multimodal', label: '多模态', icon: '🔄' },
];

// 数据集个性标签定义
const DATASET_TAGS: Record<string, string[]> = {
  'VisDrone': ['航拍', '无人机', '大规模'],
  'DroneVehicle': ['RGB-红外', '车辆检测', '跨模态'],
  'DroneCrowd': ['密度估计', '人群计数', '航拍'],
  'MDMT': ['多机协同', '多目标', '跨视角'],
};

const DataBase: React.FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => { loadDatasets(); }, []);

  const clearCacheAndReload = async () => {
    await localDatabase.clear('datasets');
    await loadDatasets();
  };

  const loadDatasets = async () => {
    try {
      const data = await visdroneService.getDatasets();
      const sortedData = data.sort((a: any, b: any) => {
        const starsA = a.stars || a.github_info?.stars || 0;
        const starsB = b.stars || b.github_info?.stars || 0;
        return starsB - starsA;
      });
      const datasetsWithImages = sortedData.map((dataset: any) => ({
        ...dataset,
        stars: dataset.stars || dataset.github_info?.stars || 0,
        image: dataset.image || getDatasetImage(dataset.name),
        // 添加共同标签
        commonTags: COMMON_TAGS
          .filter(tag => {
            const nameLower = dataset.name.toLowerCase();
            const featuresLower = (dataset.features || []).map((f: string) => f.toLowerCase());
            switch (tag.id) {
              case 'detection': return nameLower.includes('visdrone') || featuresLower.some(f => f.includes('检测'));
              case 'tracking': return featuresLower.some(f => f.includes('跟踪'));
              case 'counting': return featuresLower.some(f => f.includes('计数'));
              case 'multi-drone': return featuresLower.some(f => f.includes('多机'));
              case 'multimodal': return nameLower.includes('vehicle') || featuresLower.some(f => f.includes('多模态') || f.includes('rgb'));
              default: return false;
            }
          })
          .map(tag => tag.id),
        // 添加个性标签
        uniqueTags: DATASET_TAGS[dataset.name] || [],
      }));
      setDatasets(datasetsWithImages);
    } catch (error) {
      console.error('Failed to load datasets:', error);
      setDatasets(getDefaultDatasets());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultDatasets = () => {
    const defaultData = [
      {
        id: '1',
        name: 'VisDrone',
        fullName: 'VisDrone Dataset',
        description: 'VisDrone是一个大规模无人机图像和视频目标检测、跟踪基准数据集，包含各种天气，光照和高度条件下采集的数据。',
        paper_title: 'The VisDrone Dataset: A Large-scale Benchmark for Object Detection in Drone Imagery',
        paper_venue: 'IEEE TPAMI',
        paper_year: '2021',
        features: ['目标检测', '目标跟踪', '视频分析'],
        stats: { images: '10,000+', videos: '200+', annotations: '200万+' },
        github: 'https://github.com/VisDrone/VisDrone-Dataset',
        category: 'detection',
        image: getDatasetImage('VisDrone'),
        stars: 2160
      },
      {
        id: '2',
        name: 'DroneVehicle',
        fullName: 'DroneVehicle Dataset',
        description: 'DroneVehicle是一个基于无人机的RGB-红外跨模态车辆检测数据集，支持可见光和热红外双模态目标检测研究。',
        paper_title: 'DroneVehicle: A Large-scale Benchmark for RGB-Infrared Vehicle Detection',
        paper_venue: 'ICCV',
        paper_year: '2021',
        features: ['RGB-红外', '车辆检测', '跨模态'],
        stats: { images: '28,000+', annotations: '400万+' },
        github: 'https://github.com/VisDrone/DroneVehicle',
        category: 'multimodal',
        image: getDatasetImage('DroneVehicle'),
        stars: 674
      },
      {
        id: '3',
        name: 'DroneCrowd',
        fullName: 'DroneCrowd Dataset',
        description: 'DroneCrowd是一个基于无人机的人群密度图估计、计数和跟踪的人群分析数据集，支持人群检测、计数和跟踪多任务学习。',
        paper_title: 'DroneCrowd: A Large-scale Benchmark for Crowd Detection, Counting and Tracking',
        paper_venue: 'ECCV',
        paper_year: '2020',
        features: ['人群计数', '密度估计', '人群跟踪'],
        stats: { images: '12,000+', annotations: '300万+' },
        github: 'https://github.com/VisDrone/DroneCrowd',
        category: 'crowd',
        image: getDatasetImage('DroneCrowd'),
        stars: 213
      },
      {
        id: '4',
        name: 'MDMT',
        fullName: 'Multi-Drone Multi-Target Tracking Dataset',
        description: 'MDMT是一个多无人机多目标跟踪数据集，包含88个视频序列、39,678帧图像，涵盖11,454个不同ID的人、自行车和汽车。',
        paper_title: 'MDMT: A Multi-Drone Multi-Target Tracking Dataset',
        paper_venue: 'CVPR',
        paper_year: '2022',
        features: ['多机协同', '多目标跟踪', '跨视角'],
        stats: { videos: '88', frames: '39,678', annotations: '54万+' },
        github: 'https://github.com/VisDrone',
        category: 'tracking',
        image: getDatasetImage('MDMT'),
        stars: 0
      },
    ];

    return defaultData.map(dataset => ({
      ...dataset,
      commonTags: COMMON_TAGS
        .filter(tag => {
          const nameLower = dataset.name.toLowerCase();
          const featuresLower = (dataset.features || []).map((f: string) => f.toLowerCase());
          switch (tag.id) {
            case 'detection': return nameLower.includes('visdrone') || featuresLower.some(f => f.includes('检测'));
            case 'tracking': return featuresLower.some(f => f.includes('跟踪'));
            case 'counting': return featuresLower.some(f => f.includes('计数'));
            case 'multi-drone': return featuresLower.some(f => f.includes('多机'));
            case 'multimodal': return nameLower.includes('vehicle') || featuresLower.some(f => f.includes('多模态') || f.includes('rgb'));
            default: return false;
          }
        })
        .map(tag => tag.id),
      uniqueTags: DATASET_TAGS[dataset.name] || [],
    }));
  };

  // 根据标签和搜索过滤数据集
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (dataset.features || []).some((f: string) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTag === '' || dataset.commonTags?.includes(selectedTag);
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tagId: string) => {
    setSelectedTag(prev => prev === tagId ? '' : tagId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${getHeroImage('database')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">数据基座</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              构建世界上规模最大的低空视觉数据平台，包含超过2000万图像/视频帧以及2000万目标标注
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${datasets.length}+`, label: '数据集', icon: <Database className="w-5 h-5" /> },
              { value: '2000万+', label: '图像/视频帧', icon: <Image className="w-5 h-5" /> },
              { value: '2000万+', label: '目标标注', icon: <FileText className="w-5 h-5" /> },
              { value: datasets.reduce((sum, d) => sum + (d.stars || d.github_info?.stars || 0), 0).toLocaleString(), label: 'GitHub Stars', icon: <Star className="w-5 h-5" /> },
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
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索数据集..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
              />
            </div>

            {/* Common Tags Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mr-1 sm:mr-2">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                筛选:
              </span>
              {COMMON_TAGS.map(tag => {
                const isActive = selectedTag === tag.id;
                const count = datasets.filter(d => d.commonTags?.includes(tag.id)).length;
                if (count === 0) return null;
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-all ${
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
                  className="px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  清除
                </button>
              )}
              <button
                onClick={clearCacheAndReload}
                className="px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium text-blue-500 hover:bg-blue-50 transition-all ml-auto"
                title="清除本地缓存并重新加载数据"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
                清除缓存
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Datasets Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredDatasets.length === 0 ? (
            <div className="text-center py-20">
              <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">未找到匹配的数据集</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredDatasets.map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border bg-card hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  {/* Dataset Image */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-muted flex-shrink-0">
                    <img
                      src={dataset.image}
                      alt={dataset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white">{dataset.name}</h3>
                    </div>
                    {dataset.github && (
                      <a
                        href={dataset.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                        title="访问GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {dataset.stars > 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>{dataset.stars.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-shrink-0">{dataset.description}</p>

                    {/* Common Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dataset.commonTags?.map((tagId: string) => {
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
                      {dataset.uniqueTags?.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    {dataset.stats && (
                      <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
                        {Object.entries(dataset.stats).map(([key, value]) => (
                          <span key={key} className="flex items-center gap-1">
                            <span className="font-medium text-foreground">{value as string}</span>
                            <span className="capitalize">{key}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Paper Info */}
                    <div className="mt-auto pt-3 border-t text-xs text-muted-foreground">
                      <p className="line-clamp-1">{dataset.paper_venue} {dataset.paper_year}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/visdrone/data-base/${dataset.id}`}
                        className="flex-1 px-3 py-2 text-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        查看详情
                      </Link>
                      {dataset.github && (
                        <a
                          href={dataset.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center"
                        >
                          <Download className="w-4 h-4" />
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

      {/* Citation */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold mb-4">引用我们的数据集</h2>
            <p className="text-muted-foreground mb-6">
              如果您在研究中使用了VisDrone数据集，请引用以下论文：
            </p>
            <div className="p-4 rounded-xl bg-card border text-left text-sm font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">
{`@article{zhu2021visdrone,
  title={The VisDrone Dataset: A Large-scale Benchmark for Object Detection in Drone Imagery},
  author={Zhu, Pengfei and Wen, Longyin and Du, Dawei and Bian, Xiao and Fan, Heng and Hu, Qinghua and Ling, Haibin},
  journal={IEEE Transactions on Pattern Analysis and Machine Intelligence},
  year={2021}
}`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DataBase;
