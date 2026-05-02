import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen, Download, Search, Filter, Trophy, Award, Lightbulb, Calendar, User, ExternalLink } from 'lucide-react';
import visdroneService from '@/services/visdroneService';
import { getHeroImage } from '@/utils/aiImageGenerator';

const GOOGLE_SCHOLAR_URL = 'https://scholar.google.com/citations?user=iS27HZ8AAAAJ&hl=en';
const TOTAL_CITATIONS = 26020;

const Publications: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [patents, setPatents] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'papers' | 'patents' | 'awards'>('papers');
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [papersData, patentsData, awardsData] = await Promise.all([
        visdroneService.getPapers(),
        visdroneService.getPatents(),
        visdroneService.getAwards(),
      ]);
      setPapers(papersData);
      setPatents(patentsData);
      setAwards(awardsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Use default data
      setPapers(getDefaultPapers());
      setPatents(getDefaultPatents());
      setAwards(getDefaultAwards());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPapers = () => [
    { id: '1', title: 'The VisDrone Dataset: A Large-scale Benchmark for Object Detection in Drone Imagery', authors: ['Pengfei Zhu', 'Longyin Wen', 'Dawei Du'], venue: 'IEEE TPAMI', year: 2021, type: 'journal', pdf_url: '#' },
    { id: '2', title: 'Detection and Tracking Meet Drones Challenge', authors: ['Pengfei Zhu', 'Longyin Wen', 'Xiao Bian'], venue: 'IEEE TPAMI', year: 2022, type: 'journal', pdf_url: '#' },
    { id: '3', title: 'VisDrone-DET2021: The Vision Meets Drone Object Detection Challenge Results', authors: ['Pengfei Zhu', 'Jiayu Zheng'], venue: 'ICCV', year: 2021, type: 'conference', pdf_url: '#' },
    { id: '4', title: 'VisDrone-VT2021: The Vision Meets Drone Video Tracking Challenge Results', authors: ['Pengfei Zhu', 'Qinghua Hu'], venue: 'ICCV', year: 2021, type: 'conference', pdf_url: '#' },
    { id: '5', title: 'Graph-based Class-Incremental Learning for Object Detection', authors: ['Pengfei Zhu', 'Yimeng Sun'], venue: 'NeurIPS', year: 2024, type: 'conference', pdf_url: '#' },
    { id: '6', title: 'Semi-Supervised Continual Learning in Drone Imagery', authors: ['Pengfei Zhu', 'Xinjie Yao'], venue: 'NeurIPS', year: 2024, type: 'conference', pdf_url: '#' },
    { id: '7', title: 'Zero-Shot Object Detection for Aerial Images', authors: ['Pengfei Zhu', 'Yan Fan'], venue: 'IJCV', year: 2024, type: 'journal', pdf_url: '#' },
    { id: '8', title: 'Small Object Detection in Drone Imagery', authors: ['Pengfei Zhu', 'Haibin Ling'], venue: 'CVPR', year: 2024, type: 'conference', pdf_url: '#' },
  ];

  const getDefaultPatents = () => [
    { id: '1', title: '一种基于深度学习的无人机目标检测方法', inventors: ['朱鹏飞', '孙一铭'], number: 'ZL202110000001.0', date: '2023-06', type: '发明' },
    { id: '2', title: '一种无人机视角下的多目标跟踪系统', inventors: ['朱鹏飞', '姚鑫杰'], number: 'ZL202110000002.0', date: '2023-08', type: '发明' },
    { id: '3', title: '一种基于图神经网络的增量学习方法', inventors: ['朱鹏飞', '范妍'], number: 'ZL202210000001.0', date: '2024-01', type: '发明' },
    { id: '4', title: '一种无人机航拍图像的人群计数方法', inventors: ['朱鹏飞', '朱梦萍'], number: 'ZL202210000002.0', date: '2024-03', type: '发明' },
  ];

  const getDefaultAwards = () => [
    { id: '1', title: '吴文俊人工智能科学技术奖科技进步一等奖', authors: ['朱鹏飞', '齐俊桐', '于宏志', '胡清华', '孙一铭'], venue: '中国人工智能学会', date: '2024' },
    { id: '2', title: '昇腾AI创新大赛2024全国总决赛高校赛道铜奖', authors: ['冯杰康', '李想', '姚海屿', '姚鑫杰'], venue: '华为', date: '2024' },
    { id: '3', title: '昇腾AI创新大赛2024天津赛区金奖', authors: ['冯杰康', '姚海屿', '姚鑫杰', '李想'], venue: '华为', date: '2024' },
    { id: '4', title: 'CVPR 2024无人机目标检测挑战赛冠军', authors: ['VisDrone团队'], venue: 'CVPR', date: '2024' },
    { id: '5', title: 'ICCV 2023多目标跟踪挑战赛亚军', authors: ['VisDrone团队'], venue: 'ICCV', date: '2023' },
  ];

  // Get unique years and venues for filters
  const years = useMemo(() => {
    const allYears = new Set<number>();
    papers.forEach(p => allYears.add(p.year));
    patents.forEach(p => {
      const year = parseInt(p.date?.split('-')[0]);
      if (year) allYears.add(year);
    });
    awards.forEach(a => allYears.add(parseInt(a.date)));
    return Array.from(allYears).sort((a, b) => b - a);
  }, [papers, patents, awards]);

  const venues = useMemo(() => {
    const allVenues = new Set<string>();
    papers.forEach(p => allVenues.add(p.venue));
    return Array.from(allVenues).sort();
  }, [papers]);

  // Filter functions
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch = searchQuery === '' || 
        paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors?.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesYear = selectedYear === 'all' || paper.year?.toString() === selectedYear;
      const matchesVenue = selectedVenue === 'all' || paper.venue === selectedVenue;
      const matchesType = selectedType === 'all' || paper.type === selectedType;
      return matchesSearch && matchesYear && matchesVenue && matchesType;
    });
  }, [papers, searchQuery, selectedYear, selectedVenue, selectedType]);

  const filteredPatents = useMemo(() => {
    return patents.filter(patent => {
      const matchesSearch = searchQuery === '' || 
        patent.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patent.inventors?.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesYear = selectedYear === 'all' || patent.date?.startsWith(selectedYear);
      return matchesSearch && matchesYear;
    });
  }, [patents, searchQuery, selectedYear]);

  const filteredAwards = useMemo(() => {
    return awards.filter(award => {
      const matchesSearch = searchQuery === '' || 
        award.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.authors?.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesYear = selectedYear === 'all' || award.date === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [awards, searchQuery, selectedYear]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'papers': return filteredPapers;
      case 'patents': return filteredPatents;
      case 'awards': return filteredAwards;
      default: return [];
    }
  };

  const tabs = [
    { id: 'papers', label: '论文', count: filteredPapers.length, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'patents', label: '专利', count: filteredPatents.length, icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'awards', label: '奖项', count: filteredAwards.length, icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('publications')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">研究成果</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              团队在低空智能领域取得的代表性研究成果，包括高水平论文、授权专利和竞赛获奖
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-6 sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 md:px-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索标题、作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">全部年份</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            {/* Venue Filter - Only for papers */}
            {activeTab === 'papers' && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">全部期刊/会议</option>
                  {venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Type Filter - Only for papers */}
            {activeTab === 'papers' && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">全部类型</option>
                  <option value="conference">会议论文</option>
                  <option value="journal">期刊论文</option>
                </select>
              </div>
            )}

            {/* Clear Filters */}
            {(searchQuery || selectedYear !== 'all' || selectedVenue !== 'all' || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedYear('all');
                  setSelectedVenue('all');
                  setSelectedType('all');
                }}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-card border hover:bg-muted'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-6 text-sm text-muted-foreground">
            共找到 {getCurrentData().length} 条结果
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : getCurrentData().length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">未找到匹配的结果</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {activeTab === 'papers' && filteredPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      paper.type === 'conference' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {paper.type === 'conference' ? <BookOpen className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{paper.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="w-4 h-4" />
                        <span className="truncate">{paper.authors?.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paper.type === 'conference' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {paper.venue}
                        </span>
                        <span className="text-muted-foreground">{paper.year}</span>
                      </div>
                    </div>
                    {paper.pdf_url && (
                      <a
                        href={paper.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border hover:bg-muted transition-colors"
                        title="下载PDF"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                    {(paper.github || paper.code_url) && (
                      <a
                        href={paper.github || paper.code_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border hover:bg-muted transition-colors"
                        title="代码"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}

              {activeTab === 'patents' && filteredPatents.map((patent, index) => {
                // 处理 inventors 可能是字符串或数组的情况
                const inventors = Array.isArray(patent.inventors) 
                  ? patent.inventors 
                  : (typeof patent.inventors === 'string' ? patent.inventors.split('，') : []);
                return (
                  <motion.div
                    key={patent.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{patent.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <User className="w-4 h-4" />
                          <span>发明人: {inventors.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                            {patent.type || '发明'}
                          </span>
                          <span className="text-muted-foreground">编号: {patent.number || patent.patent_no}</span>
                          <span className="text-muted-foreground">{patent.date}</span>
                        </div>
                      </div>
                      {patent.pdf_url && (
                        <a
                          href={patent.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border hover:bg-muted transition-colors"
                          title="下载PDF"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {activeTab === 'awards' && filteredAwards.map((award, index) => {
                // 处理 authors 可能是字符串或数组的情况
                const authors = Array.isArray(award.authors) 
                  ? award.authors 
                  : (typeof award.authors === 'string' ? award.authors.split('，') : []);
                return (
                  <motion.div
                    key={award.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{award.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <User className="w-4 h-4" />
                          <span>{authors.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          {award.venue && (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
                              {award.venue}
                            </span>
                          )}
                          <span className="text-muted-foreground">{award.date}</span>
                        </div>
                      </div>
                      {award.pdf_url && (
                        <a
                          href={award.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border hover:bg-muted transition-colors"
                          title="下载PDF"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: papers.length, label: '学术论文', icon: <BookOpen className="w-5 h-5" /> },
              { value: patents.length, label: '授权专利', icon: <Lightbulb className="w-5 h-5" /> },
              { value: awards.length, label: '获奖荣誉', icon: <Trophy className="w-5 h-5" /> },
              {
                value: TOTAL_CITATIONS.toLocaleString(),
                label: '引用次数',
                icon: <Award className="w-5 h-5" />,
                link: GOOGLE_SCHOLAR_URL
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl bg-card border ${stat.link ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
                onClick={() => stat.link && window.open(stat.link, '_blank')}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.link && <ExternalLink className="w-4 h-4" />}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Publications;
