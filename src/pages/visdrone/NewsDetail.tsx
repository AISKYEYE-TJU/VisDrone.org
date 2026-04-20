import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Tag, Share2, ExternalLink, 
  Newspaper, ChevronLeft, ChevronRight, Clock, User 
} from 'lucide-react';
import visdroneService, { NewsItem } from '@/services/visdroneService';
import { getHeroImage, getNewsImage } from '@/utils/aiImageGenerator';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNewsDetail(id);
    }
  }, [id]);

  const loadNewsDetail = async (newsId: string) => {
    setIsLoading(true);
    try {
      const data = await visdroneService.getNewsById(newsId);
      setNews(data);
      
      // 加载相关新闻
      const allNews = await visdroneService.getNews();
      const related = allNews
        .filter(n => n.id !== newsId && n.category === data?.category)
        .slice(0, 3);
      setRelatedNews(related);
    } catch (error) {
      console.error('Failed to load news detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 分类颜色
  const categoryColors: Record<string, string> = {
    '获奖荣誉': 'bg-yellow-100 text-yellow-700',
    '竞赛获奖': 'bg-purple-100 text-purple-700',
    '学术成果': 'bg-blue-100 text-blue-700',
    '学术交流': 'bg-green-100 text-green-700',
    '平台建设': 'bg-orange-100 text-orange-700',
    '科研项目': 'bg-red-100 text-red-700',
  };

  // 生成新闻内容（如果没有 content，则基于 excerpt 生成）
  const generateContent = (item: NewsItem): string => {
    if (item.content) return item.content;
    
    return `${item.excerpt}

## 背景介绍

${item.title}是VisDrone团队在低空智能领域的重要进展。该成果体现了团队在人工智能、计算机视觉和无人机技术方面的深厚积累。

## 主要成果

• 技术创新：在相关技术领域取得重要突破
• 应用价值：为低空经济发展提供技术支撑
• 团队贡献：展现VisDrone团队的科研实力

## 未来展望

VisDrone团队将继续深耕低空智能领域，推动技术创新和产业发展，为国家低空经济战略做出更大贡献。

---

**关于VisDrone团队**

VisDrone团队面向低空经济国家战略需求，构建低空数据基座和知识基座，攻关低空环境感知、低空具身智能和低空群体智能技术难题，研发低空智巡平台和空中具身机器人，并在雄安新区等地开展应用示范。

团队长期招收博士后、博士生、硕士生和本科生，欢迎对低空智能、计算机视觉、机器学习感兴趣的同学加入！`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-bold mb-2">新闻未找到</h2>
          <p className="text-muted-foreground mb-4">该新闻可能已被删除或不存在</p>
          <Link 
            to="/visdrone/news" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回新闻列表
          </Link>
        </div>
      </div>
    );
  }

  const content = generateContent(news);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${news ? getNewsImage(news.category, news.title) : getHeroImage('news')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Link 
              to="/visdrone/news"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              返回新闻列表
            </Link>

            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${categoryColors[news.category] || 'bg-white/10 text-white'}`}>
                {news.category}
              </span>
              <span className="text-white/60 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {news.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl">
              {news.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-white/70 max-w-3xl">
              {news.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Featured Image */}
                {news.image && (
                  <div className="rounded-2xl overflow-hidden mb-8">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <div className="bg-card rounded-2xl p-8 border">
                    {content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith('• ')) {
                        return (
                          <li key={index} className="ml-6 mb-2 text-muted-foreground">
                            {paragraph.replace('• ', '')}
                          </li>
                        );
                      }
                      if (paragraph.startsWith('---')) {
                        return <hr key={index} className="my-8 border-border" />;
                      }
                      if (paragraph.trim() === '') {
                        return null;
                      }
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <p key={index} className="font-bold text-lg mt-6 mb-4">
                            {paragraph.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      return (
                        <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </article>

                {/* Share Section */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">分享这篇新闻：</span>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: news.title,
                            text: news.excerpt,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('链接已复制到剪贴板');
                        }
                      }}
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {news.url && news.url !== '#' && (
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      查看原文
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* News Info Card */}
                <div className="bg-card rounded-2xl p-6 border">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    新闻信息
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>发布日期：{news.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>分类：{news.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>来源：VisDrone团队</span>
                    </div>
                  </div>
                </div>

                {/* Related News */}
                {relatedNews.length > 0 && (
                  <div className="bg-card rounded-2xl p-6 border">
                    <h3 className="font-bold mb-4">相关新闻</h3>
                    <div className="space-y-4">
                      {relatedNews.map((item, index) => (
                        <Link
                          key={item.id}
                          to={`/visdrone/news/${item.id}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Newspaper className="w-6 h-6 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Links */}
                <div className="bg-card rounded-2xl p-6 border">
                  <h3 className="font-bold mb-4">快速导航</h3>
                  <div className="space-y-2">
                    <Link
                      to="/visdrone/news"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      返回新闻列表
                    </Link>
                    <Link
                      to="/visdrone/publications"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      查看论文发表
                    </Link>
                    <Link
                      to="/visdrone/team"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      了解团队成员
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link
              to="/visdrone/news"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回新闻列表
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              回到顶部
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetail;
