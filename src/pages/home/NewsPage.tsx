import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Award, BookOpen, Users, FileText, 
  ChevronRight, Search, Filter, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { newsService, News } from '@/services/newsService';
import { LAB_INFO } from '@/lib/index';

const newsTypeConfig = {
  paper: { label: '论文', color: 'bg-blue-100 text-blue-700', icon: BookOpen },
  award: { label: '获奖', color: 'bg-yellow-100 text-yellow-700', icon: Award },
  event: { label: '活动', color: 'bg-purple-100 text-purple-700', icon: Users },
  recruitment: { label: '招生', color: 'bg-green-100 text-green-700', icon: FileText },
  general: { label: '动态', color: 'bg-gray-100 text-gray-700', icon: Bell }
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      const data = await newsService.getAllNews();
      setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const featuredNews = news.filter(n => n.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">新闻动态</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              了解{ LAB_INFO.name }的最新动态，包括学术成果、获奖信息、招生资讯等
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              精选动态
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredNews.map((item) => {
                const config = newsTypeConfig[item.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-all">
                      {item.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <Badge className={`${config.color} mb-2`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.created_at}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* All News */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">全部动态</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索新闻..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="paper">论文</TabsTrigger>
              <TabsTrigger value="award">获奖</TabsTrigger>
              <TabsTrigger value="event">活动</TabsTrigger>
              <TabsTrigger value="recruitment">招生</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter} className="mt-0">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">加载中...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">暂无新闻</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNews.map((item) => {
                    const config = newsTypeConfig[item.type];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {item.image_url && (
                                <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.image_url} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${config.color}`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    {config.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {item.created_at}
                                  </span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.summary}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default NewsPage;
