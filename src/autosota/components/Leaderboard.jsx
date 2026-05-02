import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Award, TrendingUp, Target, Database, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import ResearchAreaFilter from './ResearchAreaFilter';

const Leaderboard = () => {
  const [searchParams] = useSearchParams();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [researchAreaFilter, setResearchAreaFilter] = useState({
    researchArea: searchParams.get('area') || 'low-altitude-perception',
    subArea: searchParams.get('sub') || 'multi-modal-fusion'
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/knowledge_base/leaderboard.json');
        const data = await response.json();
        setLeaderboardData(data);

        // 加载研究方向配置
        const areasResponse = await fetch('/knowledge_base/research_areas.json');
        const areasData = await areasResponse.json();
        setResearchAreas(areasData.areas);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // 按数据集分组数据
  const getDatasetGroups = () => {
    let filtered = [...leaderboardData];

    if (researchAreaFilter.researchArea) {
      filtered = filtered.filter(item => item.researchArea === researchAreaFilter.researchArea);
    }
    if (researchAreaFilter.subArea) {
      filtered = filtered.filter(item => item.subArea === researchAreaFilter.subArea);
    }

    // 按数据集分组
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.dataset]) {
        groups[item.dataset] = [];
      }
      groups[item.dataset].push(item);
    });

    return groups;
  };

  // 获取当前细分方向的名称
  const getCurrentSubAreaName = () => {
    if (!researchAreaFilter.subArea) return '';
    
    const subMap = {
      'multi-modal-fusion': '多模态融合',
      'object-detection': '低空目标检测',
      'anti-uav': '反无人机',
      'object-tracking': '低空目标跟踪',
      'world-model': '世界模型',
      'vla': 'VLA',
      'vln': 'VLN',
      'end-to-end-uav': '端到端飞行器',
      'air-ground-coordination': '空地协同',
      'multi-uav-coordination': '多机协同',
      'swarm-embodied': '群体具身',
      'social-learning': '社会化学习'
    };
    return subMap[researchAreaFilter.subArea] || researchAreaFilter.subArea;
  };

  // 获取当前数据集中的评估指标
  const getMetricsForDataset = (datasetItems) => {
    if (datasetItems.length === 0) return [];
    return Object.keys(datasetItems[0].metrics);
  };

  const getSubAreaName = (subId) => {
    const subMap = {
      'multi-modal-fusion': '多模态融合',
      'object-detection': '低空目标检测',
      'anti-uav': '反无人机',
      'object-tracking': '低空目标跟踪',
      'world-model': '世界模型',
      'vla': 'VLA',
      'vln': 'VLN',
      'end-to-end-uav': '端到端飞行器',
      'air-ground-coordination': '空地协同',
      'multi-uav-coordination': '多机协同',
      'swarm-embodied': '群体具身',
      'social-learning': '社会化学习'
    };
    return subMap[subId] || subId;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center font-bold text-gray-500">{rank}</span>;
  };

  if (loading) {
    return (
      <div className="leaderboard min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">Leaderboard</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-muted-foreground mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  const datasetGroups = getDatasetGroups();
  const datasetNames = Object.keys(datasetGroups);
  const currentSubAreaName = getCurrentSubAreaName();

  return (
    <div className="leaderboard min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="leaderboard-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" className="text-blue-300" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#leaderboard-grid)" />
          </svg>
        </div>

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
        />

        <div className="container relative z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6 text-foreground">
                Leaderboard
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                展示 {currentSubAreaName} 方向各算法的性能表现，为算法选择和优化提供参考。
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-6 h-6 text-blue-600" />
                    <span className="text-3xl font-bold text-foreground">{datasetNames.length}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">数据集</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-purple-600" />
                    <span className="text-3xl font-bold text-foreground">
                      {Object.values(datasetGroups).reduce((sum, items) => sum + items.filter(item => item.rank === 1).length, 0)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">最优算法</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-green-100 dark:border-green-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <span className="text-3xl font-bold text-foreground">{Object.values(datasetGroups).reduce((sum, items) => sum + items.length, 0)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">总记录</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container py-8">
        <ResearchAreaFilter 
          onFilterChange={setResearchAreaFilter}
          initialArea={researchAreaFilter.researchArea}
          initialSub={researchAreaFilter.subArea}
        />
      </section>

      {/* Dataset Leaderboards */}
      <section className="container py-8">
        {datasetNames.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">没有找到匹配的排名数据</p>
            <p className="text-sm mt-2">请尝试调整筛选条件</p>
          </div>
        ) : (
          <div className="space-y-12">
            {datasetNames.map((datasetName) => {
              const items = datasetGroups[datasetName];
              const metrics = getMetricsForDataset(items);
              
              return (
                <motion.div
                  key={datasetName}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  {/* Dataset Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {datasetName}
                        </h2>
                        <div className="flex items-center gap-4 text-blue-100 text-sm">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            {items.length} 条记录
                          </span>
                        </div>
                      </div>
                      <Trophy className="w-12 h-12 text-white/50" />
                    </div>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-20">排名</th>
                          <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-32">算法</th>
                          {metrics.map((metric) => (
                            <th key={metric} className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                              {metric}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                            <td className="border-b p-4">
                              <div className="flex items-center gap-2">
                                {getRankIcon(item.rank)}
                                <span className={`font-bold ${item.rank <= 3 ? 'text-foreground' : 'text-gray-500'}`}>
                                  {item.rank}
                                </span>
                              </div>
                            </td>
                            <td className="border-b p-4">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">{item.algorithm}</span>
                            </td>
                            {metrics.map((metric) => (
                              <td key={metric} className="border-b p-4">
                                <span className={`font-medium ${item.rank === 1 ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {item.metrics[metric]}
                                </span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Metrics Explanation */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
          <Target className="w-6 h-6" />
          评估指标说明
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border"
          >
            <h3 className="font-bold text-lg mb-2 text-foreground">PSNR (峰值信噪比)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              PSNR 是一种评价图像质量的客观标准，值越高表示图像质量越好。单位为 dB，通常值越大表示融合效果越好。
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border"
          >
            <h3 className="font-bold text-lg mb-2 text-foreground">SSIM (结构相似性)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SSIM 是一种衡量两幅图像相似性的指标，值越接近 1 表示图像越相似。用于评价融合图像与源图像的结构保持程度。
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border"
          >
            <h3 className="font-bold text-lg mb-2 text-foreground">MAE (平均绝对误差)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              MAE 是预测值与真实值之间绝对误差的平均值，值越低表示性能越好。用于评价融合图像的误差程度。
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
