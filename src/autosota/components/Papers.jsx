import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadAllPapers } from '../lib/paperUtils';
import { Search, FileText, Calendar, Users, BookOpen, ExternalLink, Filter, Zap, Layers, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import ResearchAreaFilter from './ResearchAreaFilter';

const Papers = () => {
  const [searchParams] = useSearchParams();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [researchAreaFilter, setResearchAreaFilter] = useState({
    researchArea: searchParams.get('area') || '',
    subArea: searchParams.get('sub') || ''
  });

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const loadedPapers = await loadAllPapers();
        setPapers(loadedPapers);
        setFilteredPapers(loadedPapers);
      } catch (error) {
        console.error('Error loading papers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  useEffect(() => {
    let result = [...papers];

    // 研究方向筛选
    if (researchAreaFilter.researchArea) {
      result = result.filter(paper => paper.researchArea === researchAreaFilter.researchArea);
    }
    if (researchAreaFilter.subArea) {
      result = result.filter(paper => paper.subArea === researchAreaFilter.subArea);
    }

    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(paper => 
        paper.title?.toLowerCase().includes(term) ||
        paper.authors?.toLowerCase().includes(term) ||
        paper.journal?.toLowerCase().includes(term)
      );
    }

    // 年份筛选
    if (yearFilter) {
      result = result.filter(paper => paper.year === yearFilter);
    }

    // 排序
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'year') {
        comparison = (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
      } else if (sortBy === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'journal') {
        comparison = (a.journal || '').localeCompare(b.journal || '');
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredPapers(result);
  }, [papers, researchAreaFilter, searchTerm, yearFilter, sortBy, sortOrder]);

  // 获取所有可用的年份
  const availableYears = [...new Set(papers.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);

  // 统计数据
  const stats = {
    total: papers.length,
    filtered: filteredPapers.length,
    withDOI: papers.filter(p => p.doi).length,
    withAuthors: papers.filter(p => p.authors && p.authors !== '未知').length,
    yearRange: papers.length > 0 ? {
      min: Math.min(...papers.map(p => parseInt(p.year) || 9999).filter(y => y !== 9999)),
      max: Math.max(...papers.map(p => parseInt(p.year) || 0))
    } : { min: 0, max: 0 }
  };

  // 获取研究方向名称
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
      <div className="papers min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">论文库</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-muted-foreground mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="papers min-h-screen">
      {/* Hero Section with Tech Illustration */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="paper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" className="text-blue-300" />
              </pattern>
              <linearGradient id="paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#paper-gradient)" />
            <rect width="100" height="100" fill="url(#paper-grid)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
        />

        <div className="container relative z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6 text-foreground">
                论文库
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI4R 系统提供丰富的论文资源，支持文献调研智能体自动检索、提取关键方法并构建对比表。
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="text-3xl font-bold text-foreground">{stats.total}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">论文总数</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <span className="text-3xl font-bold text-foreground">{stats.withDOI}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">有 DOI</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Abstract Tech Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square relative">
                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center">
                    <Network className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                {/* Orbiting Nodes */}
                {[0, 1, 2, 3].map((i) => {
                  const angle = (i * 90) * (Math.PI / 180);
                  const radius = 180;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20 + i * 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute top-1/2 left-1/2 w-16 h-16 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center border-2 border-blue-200 dark:border-blue-800"
                      style={{
                        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
                      }}
                    >
                      {(() => {
                        const Icons = [BookOpen, Users, Calendar, ExternalLink];
                        const IconComponent = Icons[i];
                        return <IconComponent className="w-8 h-8 text-blue-600" />;
                      })()}
                    </motion.div>
                  );
                })}
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  {[0, 1, 2, 3].map((i) => {
                    const angle = (i * 90) * (Math.PI / 180);
                    const radius = 180;
                    const x = 200 + Math.cos(angle) * radius;
                    const y = 200 + Math.sin(angle) * radius;
                    return (
                      <line
                        key={i}
                        x1="200"
                        y1="200"
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        className="text-blue-300 dark:text-blue-700"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    );
                  })}
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container py-8">
        <ResearchAreaFilter 
          onFilterChange={setResearchAreaFilter}
          initialArea={researchAreaFilter.researchArea}
          initialSub={researchAreaFilter.subArea}
        />

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索论文标题、作者或期刊..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 年份筛选 */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">所有年份</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* 排序 */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="year">按年份</option>
                <option value="title">按标题</option>
                <option value="journal">按期刊</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* 结果统计 */}
          <div className="mt-4 text-sm text-gray-600">
            显示 {filteredPapers.length} 篇论文
            {searchTerm && ` (搜索："${searchTerm}")`}
            {yearFilter && ` (年份：${yearFilter})`}
          </div>
        </div>

        {/* 论文列表 */}
        <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          {researchAreaFilter.researchArea ? (
            <span>
              {getResearchAreaName(researchAreaFilter.researchArea)}
              {researchAreaFilter.subArea && ` - ${getSubAreaName(researchAreaFilter.subArea)}`}
              论文 ({filteredPapers.length}篇)
            </span>
          ) : (
            <span>所有论文 ({filteredPapers.length}篇)</span>
          )}
        </h2>

        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-700">
              <tr>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-16">序号</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200">论文名称</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-48">作者</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-40">发表刊物</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-24">时间</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-40">研究方向</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.map((paper, index) => (
                <tr key={paper.id} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="border-b p-4 text-gray-500">{index + 1}</td>
                  <td className="border-b p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                      {paper.title}
                    </div>
                    {paper.doi && (
                      <div className="mt-1 text-xs">
                        <span className="text-gray-500">DOI: </span>
                        <a 
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {paper.doi}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="border-b p-4">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {paper.authors || '未知'}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {paper.journal || '未知'}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {paper.year || '未知'}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex flex-col gap-1">
                      {paper.researchArea && (
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {getResearchAreaName(paper.researchArea)}
                        </span>
                      )}
                      {paper.subArea && (
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                          {getSubAreaName(paper.subArea)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex flex-col gap-2">
                      <a 
                        href={paper.pdfUrl} 
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4" />
                        查看 PDF
                      </a>
                      {paper.doi && (
                        <a 
                          href={`https://doi.org/${paper.doi}`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          DOI 链接
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">没有找到匹配的论文</p>
            <p className="text-sm mt-2">请尝试调整搜索条件</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Papers;
