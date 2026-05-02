import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Database, FlaskConical, Dna, Atom,
  FileText, Code, ExternalLink, Github,
  CheckCircle, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ClaudeScientificSkillsPage: React.FC = () => {
  const skills = [
    { name: 'PubMed', description: '生物医学文献数据库', icon: <Database className="w-5 h-5" /> },
    { name: 'RDKit', description: '化学信息学工具包', icon: <Atom className="w-5 h-5" /> },
    { name: 'BioPython', description: '生物计算工具库', icon: <Dna className="w-5 h-5" /> },
    { name: 'arXiv', description: '预印本论文数据库', icon: <FileText className="w-5 h-5" /> },
    { name: 'Semantic Scholar', description: '学术搜索引擎', icon: <Database className="w-5 h-5" /> },
    { name: 'PyPI', description: 'Python 包索引', icon: <Code className="w-5 h-5" /> }
  ];

  const features = [
    '148+ 科学和研究技能',
    '250+ 科学和金融数据库集成',
    '55+ 优化的 Python 包技能',
    '15+ 科学集成技能',
    '支持生物医学、化学、物理等多领域',
    '自动化文献检索与分析',
    '分子结构与反应分析',
    '实验数据处理与可视化',
    '与 Claude AI 深度集成'
  ];

  const installationSteps = [
    '从 GitHub 克隆仓库: git clone https://github.com/K-Dense-AI/claude-scientific-skills',
    '安装必要的依赖: pip install -r requirements.txt',
    '按照 README 文件中的说明配置环境',
    '将技能导入到支持 Agent Skills 标准的 AI 代理中'
  ];

  const usageSteps = [
    '在 AI 代理中启用 Claude Scientific Skills',
    '选择所需的科学数据库或工具',
    '输入查询参数或数据',
    '运行分析工具获取结果',
    '根据需要调整参数并重新运行'
  ];

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
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <Badge className="mb-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                    技能
                  </Badge>
                  <h2 className="text-2xl font-bold">Claude Scientific Skills</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">分类：</span>
                      <span>科学计算</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                148+ 科学数据库集成技能，支持 PubMed、RDKit、BioPython 等，为科研工作提供强大的数据访问能力
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">科学数据库</Badge>
                <Badge variant="secondary">多集成</Badge>
                <Badge variant="secondary">PubMed</Badge>
                <Badge variant="secondary">RDKit</Badge>
                <Badge variant="secondary">BioPython</Badge>
              </div>
              
              <div className="flex gap-3">
                <Button asChild>
                  <a href="https://github.com/K-Dense-AI/claude-scientific-skills" target="_blank" rel="noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub 仓库
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
                      <span>技能</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">分类：</span>
                      <span>科学计算</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">集成数据库：</span>
                      <span>250+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">支持领域：</span>
                      <span>10+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GitHub Stars：</span>
                      <span>2k+</span>
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
          <CardDescription>为科研工作提供全面的数据访问能力</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported Databases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">支持的数据库与工具</CardTitle>
          <CardDescription>覆盖多个科研领域的专业工具</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  {skill.icon}
                </div>
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-muted-foreground">{skill.description}</div>
                </div>
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
              <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
                {installationSteps.map((step, i) => (
                  <div key={i}>{i + 1}. {step}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">使用方法</h4>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
                {usageSteps.map((step, i) => (
                  <div key={i}>{i + 1}. {step}</div>
                ))}
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
              5. 参考 GitHub 仓库中的文档获取详细使用指南
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Reference */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">参考来源</h3>
              <p className="text-muted-foreground mb-4">
                Claude Scientific Skills 是 K-Dense AI 开发的科学数据库集成技能包，支持 250+ 科学数据库和工具的访问，为科研工作提供强大的数据处理能力。
              </p>
              <Button asChild variant="outline" size="sm">
                <a href="https://github.com/K-Dense-AI/claude-scientific-skills" target="_blank" rel="noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  访问 GitHub 仓库
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaudeScientificSkillsPage;
