import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Search, Star, Database,
  Code, BookOpen, FlaskConical, Brain, Globe,
  ChevronRight, ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { skillList as skills } from '@/data/skills';

const skillCategories = [
  { id: 'all', label: '全部', icon: <Cpu className="w-4 h-4" /> },
  { id: 'literature', label: '文献工具', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'data', label: '数据处理', icon: <Database className="w-4 h-4" /> },
  { id: 'coding', label: '编程工具', icon: <Code className="w-4 h-4" /> },
  { id: 'science', label: '科学计算', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'research', label: '研究管理', icon: <Brain className="w-4 h-4" /> }
];

const SkillsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();

  // 检查是否为技能详情页面
  const isSkillDetailPage = location.pathname.includes('/skills/') && !location.pathname.includes('/skills/claude-scientific');
  const isClaudeScientificPage = location.pathname.includes('/skills/claude-scientific');

  // 如果是技能详情页面或Claude Scientific页面，只渲染Outlet
  if (isSkillDetailPage || isClaudeScientificPage) {
    return <Outlet />;
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <Cpu className="w-3 h-3 mr-1" />
            科研技能市场
          </Badge>
          <h1 className="text-3xl font-bold mb-3">探索强大的科研技能</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            从NSFC标书撰写到技术路线图生成，提升科研效率和质量
          </p>
        </motion.div>
        <div className="mt-6">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20digital%20skills%20marketplace%2C%20high-tech%20scientific%20tools%2C%20sleek%20modern%20design%2C%20vibrant%20neon%20accents%2C%20abstract%20technology%20visualization%2C%203D%20elements%2C%20professional%20sci-fi%20aesthetic%2C%20no%20text%2C%20no%20words%2C%20no%20letters&image_size=landscape_16_9" 
            alt="科研技能市场" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索技能..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {skillCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
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
        {
          [
            { label: '技能数量', value: skills.length },
            { label: '分类数量', value: skillCategories.length - 1 },
            { label: '平均评分', value: '4.7' }
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSkills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/oplclaw/skills/${skill.id}`}>
              <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      {skill.category === 'literature' && <BookOpen className="w-5 h-5" />}
                      {skill.category === 'data' && <Database className="w-5 h-5" />}
                      {skill.category === 'coding' && <Code className="w-5 h-5" />}
                      {skill.category === 'science' && <FlaskConical className="w-5 h-5" />}
                      {skill.category === 'research' && <Brain className="w-5 h-5" />}
                    </div>
                    <Badge variant="outline" className="text-xs">{skill.type}</Badge>
                  </div>
                  <h3 className="font-medium mb-1">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{skill.stars}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skill.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-3">
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/oplclaw/skills/${skill.id}`}>
                        查看详情
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={skill.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">未找到匹配的技能</h3>
          <p className="text-muted-foreground">尝试调整搜索关键词或选择不同的分类</p>
        </div>
      )}

      {/* CTA */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="py-6 text-center">
          <h3 className="font-bold text-lg mb-2">找不到你需要的技能？</h3>
          <p className="text-muted-foreground mb-4">联系我们，帮你定制专属科研技能</p>
          <Button>联系客服</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsPage;