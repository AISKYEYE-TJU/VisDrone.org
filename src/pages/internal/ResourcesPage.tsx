import React from 'react';
import { BookOpen, Database, FileCode, LayoutTemplate, Link2, FolderOpen, Github, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const resources = [
  {
    title: '文献数据库',
    description: '访问学术文献数据库，检索相关研究论文',
    icon: <BookOpen className="w-6 h-6" />,
    count: 12547,
    category: '文献'
  },
  {
    title: '数据集',
    description: '设计研究相关数据集，用户行为数据等',
    icon: <Database className="w-6 h-6" />,
    count: 89,
    category: '数据'
  },
  {
    title: '代码模板',
    description: '实验代码模板、分析脚本等',
    icon: <FileCode className="w-6 h-6" />,
    count: 156,
    category: '代码'
  },
  {
    title: '研究模板',
    description: '实验设计模板、问卷模板等',
    icon: <LayoutTemplate className="w-6 h-6" />,
    count: 45,
    category: '模板'
  },
  {
    title: '外部资源链接',
    description: '常用研究工具和资源链接',
    icon: <Link2 className="w-6 h-6" />,
    count: 234,
    category: '链接'
  },
  {
    title: '项目文档',
    description: '实验室项目相关文档和资料',
    icon: <FolderOpen className="w-6 h-6" />,
    count: 78,
    category: '文档'
  }
];

const githubResources = [
  {
    title: 'awesome-ai-for-science',
    description: '物理/化学/生物领域的AI加速发现工具、论文和数据集（AlphaFold, ChemCrow等）',
    stars: 'Curated list',
    category: '资源集合'
  },
  {
    title: 'Awesome-LLM-Scientific-Discovery',
    description: '科学发现相关的LLM论文和工具集合',
    stars: 'LLM-focused',
    category: '资源集合'
  },
  {
    title: 'Awesome-AI4Research-Scientific-Discovery',
    description: '推进科学发现的AI驱动工具和论文集合',
    stars: 'Niche collection',
    category: '资源集合'
  },
  {
    title: 'AI-4-Research',
    description: '文献综合、想法挖掘、调查研究中的LLM代理论文和工具',
    stars: 'Community hub',
    category: '资源集合'
  },
  {
    title: 'awesome-ai4code',
    description: '代码/软件研究中的AI论文和工具（扩展到研究自动化）',
    stars: 'AI4SE subset',
    category: '资源集合'
  }
];

const ResourcesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">研究资源库</h1>
        <p className="text-muted-foreground">文献、数据、工具和模板资源</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {resource.icon}
                </div>
                <Badge variant="secondary">{resource.category}</Badge>
              </div>
              <CardTitle className="mt-3">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{resource.count}</span>
                <Button variant="ghost" size="sm">
                  浏览
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub 资源集合
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {githubResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                    <Github className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary">{resource.category}</Badge>
                </div>
                <CardTitle className="mt-3">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{resource.stars}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    访问
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;