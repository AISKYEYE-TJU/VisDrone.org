import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadAlgorithms } from '../lib/paperUtils';
import { Star, GitBranch, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ResearchAreaFilter from './ResearchAreaFilter';

const Algorithms = () => {
  const [searchParams] = useSearchParams();
  const [algorithms, setAlgorithms] = useState([]);
  const [filteredAlgorithms, setFilteredAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [researchAreaFilter, setResearchAreaFilter] = useState({
    researchArea: searchParams.get('area') || '',
    subArea: searchParams.get('sub') || ''
  });

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const loadedAlgorithms = await loadAlgorithms();
        setAlgorithms(loadedAlgorithms);
        setFilteredAlgorithms(loadedAlgorithms);
      } catch (error) {
        console.error('Error loading algorithms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, []);

  useEffect(() => {
    let result = [...algorithms];

    if (researchAreaFilter.researchArea) {
      result = result.filter(alg => alg.researchArea === researchAreaFilter.researchArea);
    }
    if (researchAreaFilter.subArea) {
      result = result.filter(alg => alg.subArea === researchAreaFilter.subArea);
    }

    setFilteredAlgorithms(result);
  }, [algorithms, researchAreaFilter]);

  const getResearchAreaName = (areaId) => {
    const areaMap = {
      'low-altitude-perception': '低空环境感知',
      'low-altitude-embodied-ai': '低空具身智能',
      'low-altitude-swarm-intelligence': '低空群体智能'
    };
    return areaMap[areaId] || '';
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
    return subMap[subId] || '';
  };

  if (loading) {
    return (
      <div className="algorithms min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">算法库</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-muted-foreground mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="algorithms min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="algo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" className="text-blue-300" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#algo-grid)" />
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
                算法库
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI4R 系统集成最新的 SOTA 算法，支持实验智能体自动生成代码并执行评测。
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <GitBranch className="w-6 h-6 text-blue-600" />
                    <span className="text-3xl font-bold text-foreground">{algorithms.length}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">算法总数</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-6 h-6 text-purple-600" />
                    <span className="text-3xl font-bold text-foreground">
                      {algorithms.reduce((sum, alg) => sum + (alg.github_info?.stars || 0), 0)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">总 Stars</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter and List Section */}
      <section className="container py-8">
        <ResearchAreaFilter 
          onFilterChange={setResearchAreaFilter}
          initialArea={researchAreaFilter.researchArea}
          initialSub={researchAreaFilter.subArea}
        />

        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
          <GitBranch className="w-6 h-6" />
          {researchAreaFilter.researchArea ? (
            <span>
              {getResearchAreaName(researchAreaFilter.researchArea)}
              {researchAreaFilter.subArea && ` - ${getSubAreaName(researchAreaFilter.subArea)}`}
              算法 ({filteredAlgorithms.length}个)
            </span>
          ) : (
            <span>所有算法 ({filteredAlgorithms.length}个)</span>
          )}
        </h2>
        
        {/* 算法列表表格 */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-700">
              <tr>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-16">序号</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-32">方法名</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200">论文题目</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-32">GitHub</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200">算法简介</th>
                {!researchAreaFilter.researchArea && (
                  <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-48">研究方向</th>
                )}
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-24">Stars</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlgorithms.map((algorithm, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-colors">
                  <td className="border-b p-4 text-gray-500">{index + 1}</td>
                  <td className="border-b p-4">
                    <span className="font-bold text-gray-900">{algorithm.name}</span>
                  </td>
                  <td className="border-b p-4">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {algorithm.paper}
                    </p>
                  </td>
                  <td className="border-b p-4">
                    <a 
                      href={algorithm.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <GitBranch className="w-4 h-4" />
                      链接
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="border-b p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {algorithm.description}
                    </p>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex flex-col gap-1">
                      {algorithm.researchArea && (
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {getResearchAreaName(algorithm.researchArea)}
                        </span>
                      )}
                      {algorithm.subArea && (
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                          {getSubAreaName(algorithm.subArea)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border-b p-4">
                    {algorithm.github_info && algorithm.github_info.stars > 0 ? (
                      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold text-sm">{algorithm.github_info.stars}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">没有找到匹配的算法</p>
            <p className="text-sm mt-2">请尝试调整筛选条件</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Algorithms;
