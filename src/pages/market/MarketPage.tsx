import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store, Search, Filter, Star, Download, Clock,
  Brain, BookOpen, Zap, Globe, Beaker, Atom, FlaskConical,
  FileText, Code, FileSearch, Cpu, ChevronRight, Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const agentCategories = [
  { id: 'all', label: '全部', icon: <Store className="w-4 h-4" /> },
  { id: 'literature', label: '文献研究', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'writing', label: '论文写作', icon: <FileText className="w-4 h-4" /> },
  { id: 'analysis', label: '数据分析', icon: <Code className="w-4 h-4" /> },
  { id: 'domain', label: '领域专用', icon: <FlaskConical className="w-4 h-4" /> }
];

const agents = [
  {
    id: 'literature-review',
    title: '文献综述智能体',
    description: '深度文献分析与综述生成，集成 Semantic Scholar 和 arXiv 数据库',
    icon: <BookOpen className="w-6 h-6" />,
    href: '/oplclaw/market/literature-review',
    category: 'literature',
    rating: 4.8,
    downloads: '2.3k',
    tags: ['文献分析', '综述生成'],
    source: 'CHILAB'
  },
  {
    id: 'storm',
    title: 'STORM',
    description: '斯坦福知识策展系统，多角度提问生成维基百科式深度文章',
    icon: <Zap className="w-6 h-6" />,
    href: '/oplclaw/market/storm',
    category: 'writing',
    rating: 4.9,
    downloads: '5.1k',
    tags: ['知识策展', '文章生成'],
    source: 'Stanford'
  },
  {
    id: 'gpt-researcher',
    title: 'GPT Researcher',
    description: '自主深度研究代理，支持网络/本地研究，生成引用报告，24k+ stars',
    icon: <Globe className="w-6 h-6" />,
    href: '/oplclaw/market/gpt-researcher',
    category: 'literature',
    rating: 4.9,
    downloads: '24k+',
    tags: ['信息采集', '报告生成', '自主研究'],
    source: 'Open Source'
  },
  {
    id: 'openscholar',
    title: 'OpenScholar',
    description: 'Allen AI 学术检索增强系统，RAG 技术精准检索',
    icon: <Search className="w-6 h-6" />,
    href: '/oplclaw/market/openscholar',
    category: 'literature',
    rating: 4.6,
    downloads: '3.4k',
    tags: ['学术检索', 'RAG'],
    source: 'Allen AI'
  },
  {
    id: 'surveyx',
    title: 'SurveyX',
    description: '学术综述论文生成系统，双层语义过滤',
    icon: <FileText className="w-6 h-6" />,
    href: '/oplclaw/market/surveyx',
    category: 'writing',
    rating: 4.5,
    downloads: '1.8k',
    tags: ['综述论文', 'LaTeX'],
    source: 'Academic'
  },
  {
    id: 'asreview',
    title: 'ASReview',
    description: '主动学习系统性文献综述，高效筛选大量文献',
    icon: <FileSearch className="w-6 h-6" />,
    href: '/oplclaw/market/asreview',
    category: 'literature',
    rating: 4.8,
    downloads: '4.2k',
    tags: ['文献筛选', '主动学习'],
    source: 'Utrecht'
  },
  {
    id: 'autora',
    title: 'AutoRA',
    description: '自动化科学研究代理，理论生成与实验验证闭环',
    icon: <FlaskConical className="w-6 h-6" />,
    href: '/oplclaw/market/autora',
    category: 'domain',
    rating: 4.4,
    downloads: '1.5k',
    tags: ['理论生成', '实验设计'],
    source: 'AutoResearch'
  },
  {
    id: 'chemcrow',
    title: 'ChemCrow',
    description: '化学任务推理工具，分子分析、反应预测',
    icon: <Atom className="w-6 h-6" />,
    href: '/oplclaw/market/chemcrow',
    category: 'domain',
    rating: 4.3,
    downloads: '0.9k',
    tags: ['化学推理', '分子分析'],
    source: 'Rochester'
  },
  {
    id: 'paperclaw',
    title: 'PaperClaw',
    description: '文献分析与可视化系统，从检索到可视化的端到端分析',
    icon: <Code className="w-6 h-6" />,
    href: '/oplclaw/market/paperclaw',
    category: 'literature',
    rating: 4.7,
    downloads: '1.2k',
    tags: ['文献分析', '数据可视化', '端到端分析'],
    source: 'Open Source'
  }

];


const MarketPage: React.FC = () => {
  const location = useLocation();
  const isIndex = location.pathname === '/oplclaw/market';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isIndex) {
    return <Outlet />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <Store className="w-3 h-3 mr-1" />
            科研智能体广场
          </Badge>
          <h1 className="text-3xl font-bold mb-3">发现强大的科研智能体</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            文献综述、科学假设生成、编程实现、论文写作等单任务智能体
          </p>
        </motion.div>
        <div className="mt-6">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=many%20virtual%20robots%20in%20marketplace%2C%20cute%20AI%20robots%20collection%2C%20colorful%20digital%20assistants%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20design&image_size=landscape_16_9" 
            alt="科研智能体广场" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索智能体..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {agentCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0"
            >
              {cat.icon}
              <span className="ml-1">{cat.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '智能体数量', value: '20+' },
          { label: '总下载量', value: '50k+' },
          { label: '平均评分', value: '4.6' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAgents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={agent.href}>
              <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      {agent.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">{agent.source}</Badge>
                  </div>
                  <h3 className="font-medium mb-1">{agent.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{agent.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{agent.downloads}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="py-6 text-center">
          <h3 className="font-bold text-lg mb-2">找不到你需要的智能体？</h3>
          <p className="text-muted-foreground mb-4">联系我们，帮你定制专属科研智能体</p>
          <Button>联系客服</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPage;
