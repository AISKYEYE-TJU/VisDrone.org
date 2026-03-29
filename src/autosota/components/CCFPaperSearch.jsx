import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Calendar, Users, BookOpen, ExternalLink, Filter, Zap, Layers, Network, Download, Loader, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { searchSemanticScholar, searchArxiv } from '@/config/api';
import { getCVFPapersStats } from '@/api/cvf-papers';
import { loadAllCVFPapers, loadCVFPapersByFilter } from '../lib/paperUtils';

const CCFPaperSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allPapers, setAllPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedConference, setSelectedConference] = useState('CVPR');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [papersPerPage] = useState(20);

  // CCF A类AI相关会议列表
  const ccfConferences = [
    { value: 'all', label: '所有会议' },
    { value: 'AAAI', label: 'AAAI (人工智能)' },
    { value: 'IJCAI', label: 'IJCAI (人工智能)' },
    { value: 'KDD', label: 'KDD (数据挖掘)' },
    { value: 'ICDM', label: 'ICDM (数据挖掘)' },
    { value: 'CVPR', label: 'CVPR (计算机视觉)' },
    { value: 'ICCV', label: 'ICCV (计算机视觉)' },
    { value: 'ECCV', label: 'ECCV (计算机视觉)' },
    { value: 'NeurIPS', label: 'NeurIPS (机器学习)' },
    { value: 'ICML', label: 'ICML (机器学习)' },
    { value: 'ACL', label: 'ACL (自然语言处理)' },
    { value: 'EMNLP', label: 'EMNLP (自然语言处理)' },
    { value: 'CHI', label: 'CHI (人机交互)' },
    { value: 'UIST', label: 'UIST (人机交互)' }
  ];

  // 年份列表（1987-2026年）
  const years = [
    { value: 'all', label: '所有年份' },
    ...Array.from({ length: 40 }, (_, i) => {
      const year = 2026 - i;
      return { value: year.toString(), label: year.toString() };
    })
  ];

  const [stats, setStats] = useState({ totalPapers: 0, conferences: {} });

  // 加载统计信息
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 加载所有论文以计算统计信息
        const papers = await loadAllCVFPapers();
        
        // 计算统计信息
        const statsData = {
          totalPapers: papers.length,
          conferences: {
            CVPR: {
              totalPapers: papers.filter(p => p.conference === 'CVPR').length,
              years: [...new Set(papers.filter(p => p.conference === 'CVPR').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            ICCV: {
              totalPapers: papers.filter(p => p.conference === 'ICCV').length,
              years: [...new Set(papers.filter(p => p.conference === 'ICCV').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            NeurIPS: {
              totalPapers: papers.filter(p => p.conference === 'NeurIPS').length,
              years: [...new Set(papers.filter(p => p.conference === 'NeurIPS').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            ICML: {
              totalPapers: papers.filter(p => p.conference === 'ICML').length,
              years: [...new Set(papers.filter(p => p.conference === 'ICML').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            AAAI: {
              totalPapers: papers.filter(p => p.conference === 'AAAI').length,
              years: [...new Set(papers.filter(p => p.conference === 'AAAI').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            IJCAI: {
              totalPapers: papers.filter(p => p.conference === 'IJCAI').length,
              years: [...new Set(papers.filter(p => p.conference === 'IJCAI').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            KDD: {
              totalPapers: papers.filter(p => p.conference === 'KDD').length,
              years: [...new Set(papers.filter(p => p.conference === 'KDD').map(p => p.year)).values()].sort((a, b) => b - a)
            },
            ECCV: {
              totalPapers: papers.filter(p => p.conference === 'ECCV').length,
              years: [...new Set(papers.filter(p => p.conference === 'ECCV').map(p => p.year)).values()].sort((a, b) => b - a)
            }
          }
        };
        setStats(statsData);
      } catch (error) {
        console.error('加载统计信息失败:', error);
      }
    };
    fetchStats();
  }, []);

  // 搜索论文
  const searchPapers = async () => {
    setIsLoading(true);
    try {
      let papers;
      
      // 如果有关键词搜索，加载所有数据后筛选
      if (query.trim()) {
        papers = await loadAllCVFPapers({
          conference: selectedConference,
          year: selectedYear,
          query: query
        });
      } else {
        // 否则按会议和年份按需加载
        papers = await loadCVFPapersByFilter(selectedConference, selectedYear);
      }
      
      // 排序
      papers.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'year') {
          comparison = (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
        } else if (sortBy === 'title') {
          comparison = (a.title || '').localeCompare(b.title || '');
        } else if (sortBy === 'conference') {
          comparison = (a.conference || '').localeCompare(b.conference || '');
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      
      // 重置页码
      setCurrentPage(1);
      setResults(papers);
    } catch (error) {
      console.error('加载论文数据失败:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载CVPR 2025的论文
  useEffect(() => {
    const fetchInitialPapers = async () => {
      setIsLoading(true);
      try {
        // 默认只显示CVPR 2025的论文
        const papers = await loadCVFPapersByFilter('CVPR', '2025');
        setResults(papers);
      } catch (error) {
        console.error('加载初始论文数据失败:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialPapers();
  }, []);

  // 计算当前页的论文
  const indexOfLastPaper = currentPage * papersPerPage;
  const indexOfFirstPaper = indexOfLastPaper - papersPerPage;
  const currentPapers = results.slice(indexOfFirstPaper, indexOfLastPaper);

  // 页码变化处理
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPapers();
  };

  if (isLoading) {
    return (
      <div className="ccf-paper-search min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">CCF A类会议论文检索</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-muted-foreground mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ccf-paper-search min-h-screen">
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
                CCF A类会议论文检索
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                检索和下载AI领域CCF A类会议的论文，支持按会议名称、时间、主题等筛选
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
                    <span className="text-3xl font-bold text-foreground">{stats.totalPapers}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">论文数量</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-purple-900"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <span className="text-3xl font-bold text-foreground">{Object.keys(stats.conferences || {}).length}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">会议数量</div>
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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索论文标题、作者或关键词..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchPapers();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 会议筛选 */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedConference}
                onChange={(e) => setSelectedConference(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {ccfConferences.map(conf => (
                  <option key={conf.value} value={conf.value}>{conf.label}</option>
                ))}
              </select>
            </div>

            {/* 年份筛选 */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {years.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
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
                <option value="conference">按会议</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>

            {/* 搜索按钮 */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  检索中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  搜索
                </>
              )}
            </button>
          </div>



          {/* 结果统计 */}
          <div className="mt-4 text-sm text-gray-600">
            显示 {results.length} 篇论文
            {query && ` (搜索："${query}")`}
            {selectedConference !== 'all' && ` (会议：${ccfConferences.find(c => c.value === selectedConference)?.label})`}
            {selectedYear !== 'all' && ` (年份：${selectedYear})`}
          </div>
        </div>

        {/* 论文列表 */}
        <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          {selectedConference === 'all' ? '所有CCF A类会议论文' : ccfConferences.find(c => c.value === selectedConference)?.label}
          {selectedYear !== 'all' && ` (${selectedYear})`} ({results.length}篇)
        </h2>

        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-700">
              <tr>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-16">序号</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200">论文名称</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-48">作者</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-40">会议名称</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-24">时间</th>
                <th className="border-b p-4 text-left font-semibold text-gray-700 dark:text-gray-200 w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {currentPapers.map((paper, index) => (
                <tr key={paper.id} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="border-b p-4 text-gray-500">{indexOfFirstPaper + index + 1}</td>
                  <td className="border-b p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                      {paper.title}
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {Array.isArray(paper.authors) ? paper.authors.slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' 等' : '') : paper.authors || '未知'}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {paper.conference}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {paper.year}
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    <div className="flex flex-col gap-2">
                      <a 
                        href={paper.pdfLink ? (paper.pdfLink.startsWith('http') ? paper.pdfLink : `https://openaccess.thecvf.com${paper.pdfLink}`) : '#'} 
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4" />
                        查看 PDF
                      </a>
                      {paper.url && (
                        <a 
                          href={paper.url.startsWith('http') ? paper.url : `https://openaccess.thecvf.com${paper.url}`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          查看详情
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">没有找到匹配的论文</p>
            <p className="text-sm mt-2">请尝试调整搜索条件</p>
          </div>
        )}

        {/* 分页控件 */}
        {results.length > papersPerPage && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {Array.from({ length: Math.ceil(results.length / papersPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  // 只显示当前页附近的页码
                  return page === 1 || page === Math.ceil(results.length / papersPerPage) || 
                         (page >= currentPage - 2 && page <= currentPage + 2);
                })
                .map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(results.length / papersPerPage)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </nav>
          </div>
        )}
      </section>
    </div>
  );
};

export default CCFPaperSearch;