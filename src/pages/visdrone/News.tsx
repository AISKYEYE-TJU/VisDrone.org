import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Search, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import visdroneService from '@/services/visdroneService';
import { getHeroImage, getNewsImage } from '@/utils/aiImageGenerator';

const News: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    try {
      const data = await visdroneService.getNews();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    news.forEach(n => cats.add(n.category));
    return Array.from(cats);
  }, [news]);

  // Filter news
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [news, searchQuery, selectedCategory]);

  // Featured news (first item)
  const featuredNews = filteredNews[0];
  const regularNews = filteredNews.slice(1);

  // Category colors
  const categoryColors: Record<string, string> = {
    '获奖荣誉': 'bg-yellow-100 text-yellow-700',
    '竞赛获奖': 'bg-purple-100 text-purple-700',
    '学术成果': 'bg-blue-100 text-blue-700',
    '学术交流': 'bg-green-100 text-green-700',
    '平台建设': 'bg-orange-100 text-orange-700',
    '科研项目': 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('news')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">新闻动态</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              了解VisDrone团队的最新进展、学术成果和获奖荣誉
            </p>
          </motion.div>
        </div>
      </section>

      {/* WeChat Official Account Banner */}
      <section className="py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/qrcode_for_gh_d80f2d26792c_258.jpg" 
                alt="VisDrone公众号" 
                className="w-12 h-12 rounded-lg border bg-white object-cover"
                onError={(e) => {
                  console.error('二维码加载失败');
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                  VisDrone团队公众号
                </h3>
                <p className="text-sm text-muted-foreground">扫码关注，获取最新动态</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">微信公众号</p>
              <p className="text-sm font-medium text-green-700">VisDrone团队</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-6 sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索新闻..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                全部
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">暂无新闻</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured News */}
              {featuredNews && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Link to={`/visdrone/news/${featuredNews.id}`} className="block">
                    <div className="relative rounded-2xl overflow-hidden bg-card border hover:shadow-xl transition-all">
                      <div className="grid md:grid-cols-2">
                        {/* Image */}
                        <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                          <img
                            src={featuredNews.image || getNewsImage(featuredNews.category, featuredNews.title)}
                            alt={featuredNews.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        {/* Content */}
                        <div className="p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[featuredNews.category] || 'bg-muted'}`}>
                              {featuredNews.category}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {featuredNews.date}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                            {featuredNews.title}
                          </h2>
                          <p className="text-muted-foreground text-lg mb-6">
                            {featuredNews.excerpt}
                          </p>
                          <div className="flex items-center gap-1 text-primary">
                            <span>阅读更多</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Regular News Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/visdrone/news/${item.id}`}
                      className="group block h-full"
                    >
                      <div className="h-full rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all">
                        {/* Image */}
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={item.image || getNewsImage(item.category, item.title)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[item.category] || 'bg-muted'}`}>
                              {item.category}
                            </span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
