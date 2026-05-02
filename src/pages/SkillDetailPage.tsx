import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Database, Code, BookOpen, FlaskConical, Brain,
  Star, Download, ExternalLink, ArrowLeft, Github,
  CheckCircle, Info, Clipboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { skillList as skills } from '@/data/skills';

const SkillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const skill = skills.find(s => s.id === id);

  if (!skill) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center">
          <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <Cpu className="w-3 h-3 mr-1" />
            科研技能市场
          </Badge>
          <h1 className="text-3xl font-bold mb-3">技能未找到</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            抱歉，您请求的技能不存在。
          </p>
          <Button asChild>
            <Link to="/oplclaw/skills">返回技能市场</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/oplclaw/skills">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回技能市场
          </Link>
        </Button>
      </div>

      {/* Skill Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  {skill.category === 'literature' && <BookOpen className="w-6 h-6" />}
                  {skill.category === 'data' && <Database className="w-6 h-6" />}
                  {skill.category === 'coding' && <Code className="w-6 h-6" />}
                  {skill.category === 'science' && <FlaskConical className="w-6 h-6" />}
                  {skill.category === 'research' && <Brain className="w-6 h-6" />}
                </div>
                <div>
                  <Badge className="mb-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                    {skill.type}
                  </Badge>
                  <h2 className="text-2xl font-bold">{skill.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{skill.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">分类：</span>
                      <span>
                        {skill.category === 'literature' && '文献工具'}
                        {skill.category === 'data' && '数据处理'}
                        {skill.category === 'coding' && '编程工具'}
                        {skill.category === 'science' && '科学计算'}
                        {skill.category === 'research' && '研究管理'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{skill.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {skill.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button asChild>
                  <a href={skill.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    访问技能详情
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-80">
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-3">技能信息</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">类型：</span>
                      <span>{skill.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">分类：</span>
                      <span>
                        {skill.category === 'literature' && '文献工具'}
                        {skill.category === 'data' && '数据处理'}
                        {skill.category === 'coding' && '编程工具'}
                        {skill.category === 'science' && '科学计算'}
                        {skill.category === 'research' && '研究管理'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">评分：</span>
                      <span>{skill.stars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">标签：</span>
                      <span>{skill.tags.length} 个</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">核心功能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skill.features?.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">安装与使用</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">安装说明</h4>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                {skill.installation}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">使用方法</h4>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                {skill.usage}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">使用提示</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-emerald-50 border-emerald-200">
            <Info className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">使用建议</AlertTitle>
            <AlertDescription className="text-emerald-700">
              1. 确保您的环境中安装了必要的依赖
              2. 按照 README 文件中的说明进行配置
              3. 对于 MCP 模块，需要在 MCP 服务器中启用
              4. 定期更新技能以获取最新功能
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Related Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">相关技能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills
              .filter(s => s.category === skill.category && s.id !== skill.id)
              .slice(0, 3)
              .map((relatedSkill) => (
                <Link to={`/oplclaw/skills/${relatedSkill.id}`} key={relatedSkill.id}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                        {relatedSkill.category === 'literature' && <BookOpen className="w-4 h-4" />}
                        {relatedSkill.category === 'data' && <Database className="w-4 h-4" />}
                        {relatedSkill.category === 'coding' && <Code className="w-4 h-4" />}
                        {relatedSkill.category === 'science' && <FlaskConical className="w-4 h-4" />}
                        {relatedSkill.category === 'research' && <Brain className="w-4 h-4" />}
                      </div>
                      <h4 className="font-medium mb-1">{relatedSkill.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedSkill.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{relatedSkill.stars}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="py-6 text-center">
          <h3 className="font-bold text-lg mb-2">需要更多帮助？</h3>
          <p className="text-muted-foreground mb-4">联系我们的客服团队获取支持</p>
          <Button>联系客服</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillDetailPage;