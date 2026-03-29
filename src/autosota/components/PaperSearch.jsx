import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ExternalLink, Loader, BookOpen, Calendar, Users, FileText } from 'lucide-react';

const PaperSearch = () => {
  const [query, setQuery] = useState('artificial intelligence');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(10);

  const searchPapers = async () => {
    if (!query.trim()) {
      setError('请输入搜索关键词');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 使用本地代理访问 arXiv API
      const url = `/api/arxiv/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${limit}&start=0`;
      console.log('开始检索，URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml'
        }
      });
      console.log('API 响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      console.log('API 响应内容:', text.substring(0, 500) + '...');
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');
      
      // 检查 XML 解析错误
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('XML 解析错误: ' + parserError.textContent);
      }
      
      const entries = xmlDoc.getElementsByTagName('entry');
      console.log('找到论文数量:', entries.length);

      const papers = Array.from(entries).map(entry => {
        const title = entry.querySelector('title')?.textContent?.trim() || '';
        const authors = Array.from(entry.querySelectorAll('author name')).map(a => a.textContent?.trim() || '');
        const published = entry.querySelector('published')?.textContent?.trim() || '';
        const summary = entry.querySelector('summary')?.textContent?.trim() || '';
        const id = entry.querySelector('id')?.textContent?.trim() || '';
        const arxivId = id.split('/').pop() || '';
        const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || id;
        const pdfLink = entry.querySelector('link[title="pdf"]')?.getAttribute('href') || '';

        return {
          id: arxivId,
          title,
          authors,
          published,
          summary,
          url: link,
          pdfLink: pdfLink || `https://arxiv.org/pdf/${arxivId}`,
          venue: 'arXiv'
        };
      });

      console.log('解析完成，论文数量:', papers.length);
      setResults(papers);
    } catch (err) {
      setError('检索失败，请稍后重试');
      console.error('检索错误:', err);
      console.error('错误详情:', err.message, err.stack);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 初始加载时执行一次搜索
    searchPapers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPapers();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="paper-search min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-6">论文检索系统</h1>
            <p className="text-xl text-slate-300 mb-8">
              从 arXiv 自动检索最新相关论文，支持关键词搜索和批量下载
            </p>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入关键词，例如：artificial intelligence"
                className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <div className="flex gap-2">
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value={5}>5篇</option>
                  <option value={10}>10篇</option>
                  <option value={20}>20篇</option>
                  <option value={50}>50篇</option>
                </select>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
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
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8">
              搜索结果 ({results.length} 篇)
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-violet-600" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">未找到相关论文</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          {paper.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Users className="w-4 h-4" />
                          <span>{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' 等' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(paper.published)}</span>
                          <span className="mx-2">•</span>
                          <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-xs">
                            {paper.venue}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {paper.summary}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          查看详情
                        </a>
                        <a
                          href={paper.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          下载PDF
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">系统功能</h2>
            <p className="text-muted-foreground text-lg">
              基于 arXiv API 的论文检索系统，提供快速、准确的学术论文查找服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "关键词搜索",
                description: "支持多关键词组合，快速定位相关研究论文"
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: "批量下载",
                description: "一键下载PDF论文，方便离线阅读和分析"
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "详细信息",
                description: "查看论文标题、作者、摘要等完整信息"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
              >
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaperSearch;