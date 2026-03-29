import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Palette, FlaskConical, MessageSquare, 
  PenTool, BookOpen, Users, Sparkles, 
  Play, Settings, Plus, Star, Zap,
  ChevronRight, Search, Send, Loader2, Copy, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API_CONFIG, callLLM } from '@/config/api';
import APISettings from '@/components/APISettings';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: 'design' | 'research' | 'utility';
  icon: React.ReactNode;
  capabilities: string[];
  usageCount: number;
  rating: number;
  status: 'active' | 'inactive';
  systemPrompt: string;
  placeholder: string;
}

const agents: Agent[] = [
  {
    id: 'design-critic',
    name: '设计评论智能体',
    description: '对设计方案进行专业评估和改进建议',
    category: 'design',
    icon: <Palette className="w-6 h-6" />,
    capabilities: ['设计评估', '风格分析', '改进建议', '趋势洞察'],
    usageCount: 234,
    rating: 4.8,
    status: 'active',
    systemPrompt: `你是一位资深设计评论专家，专注于设计评估和改进建议。你的职责是：

1. **设计评估**：从美学、功能性、用户体验等多维度评估设计方案
2. **风格分析**：分析设计风格特点、趋势符合度、品牌一致性
3. **改进建议**：提供具体、可操作的设计优化建议
4. **趋势洞察**：结合当前设计趋势，提供前瞻性建议

评估框架：
- 视觉美学（配色、排版、图形）
- 功能性（易用性、可访问性）
- 用户体验（交互流畅度、情感体验）
- 创新性（原创性、差异化）

请用专业但易懂的语言进行评估，给出具体的改进建议。`,
    placeholder: '请输入你想要评估的设计方案描述，例如：一个面向年轻人的社交APP界面设计，采用极简风格...'
  },
  {
    id: 'ux-analyst',
    name: '用户体验分析师',
    description: '分析用户行为数据，提供体验优化建议',
    category: 'design',
    icon: <Users className="w-6 h-6" />,
    capabilities: ['用户画像', '行为分析', '痛点识别', '体验优化'],
    usageCount: 189,
    rating: 4.6,
    status: 'active',
    systemPrompt: `你是一位用户体验研究专家，专注于用户行为分析和体验优化。你的职责是：

1. **用户画像构建**：基于数据构建详细的用户画像
2. **行为分析**：分析用户行为模式、使用路径、转化漏斗
3. **痛点识别**：发现用户体验中的问题和障碍
4. **优化建议**：提供数据驱动的体验优化方案

分析方法：
- 用户旅程地图分析
- 任务完成率评估
- 用户满意度分析
- A/B测试建议

请基于用户研究方法论，提供专业的分析和建议。`,
    placeholder: '请描述你的用户研究问题，例如：电商APP的用户流失率较高，主要集中在结算环节...'
  },
  {
    id: 'creative-generator',
    name: '创意生成器',
    description: '基于设计需求生成创新设计概念',
    category: 'design',
    icon: <Sparkles className="w-6 h-6" />,
    capabilities: ['概念生成', '风格融合', '创新组合', '趋势预测'],
    usageCount: 312,
    rating: 4.9,
    status: 'active',
    systemPrompt: `你是一位创意设计专家，擅长生成创新的设计概念和方案。你的职责是：

1. **概念生成**：基于需求生成多个创新设计概念
2. **风格融合**：将不同风格元素创造性地结合
3. **创新组合**：跨领域借鉴，产生新颖的设计思路
4. **趋势预测**：结合未来趋势，提供前瞻性设计方案

创意方法：
- 类比思维法
- 组合创新法
- 逆向思维法
- 情感设计法

请提供3-5个不同的创意方案，每个方案包含：概念名称、核心理念、视觉描述、差异化特点。`,
    placeholder: '请描述你的设计需求，例如：设计一款面向老年人的智能健康监测设备界面...'
  },
  {
    id: 'literature-reviewer',
    name: '文献综述智能体',
    description: '自动检索和综述相关领域文献',
    category: 'research',
    icon: <BookOpen className="w-6 h-6" />,
    capabilities: ['文献检索', '摘要生成', '趋势分析', '引用整理'],
    usageCount: 456,
    rating: 4.7,
    status: 'active',
    systemPrompt: `你是一位学术文献综述专家，专注于研究文献的检索和分析。你的职责是：

1. **文献检索策略**：提供关键词建议和检索策略
2. **摘要生成**：总结文献的核心观点和贡献
3. **趋势分析**：分析研究领域的演进和热点
4. **引用整理**：按学术规范整理参考文献

综述框架：
- 研究背景与意义
- 主要研究方法
- 核心研究发现
- 研究空白与未来方向

请提供结构化的文献综述，符合学术写作规范。`,
    placeholder: '请输入你想要综述的研究主题，例如：人机交互中的情感设计研究...'
  },
  {
    id: 'hypothesis-generator',
    name: '假设生成智能体',
    description: '基于研究问题生成科学假设',
    category: 'research',
    icon: <FlaskConical className="w-6 h-6" />,
    capabilities: ['假设生成', '变量识别', '实验设计', '可行性评估'],
    usageCount: 278,
    rating: 4.5,
    status: 'active',
    systemPrompt: `你是一位研究方法论专家，专注于科学假设的生成和验证设计。你的职责是：

1. **假设生成**：基于研究问题提出可验证的研究假设
2. **变量识别**：识别自变量、因变量、控制变量
3. **实验设计**：设计验证假设的实验方案
4. **可行性评估**：评估研究实施的可行性

假设框架：
- 研究问题明确化
- 理论依据阐述
- 假设陈述（H1, H2...）
- 操作化定义
- 验证方法建议

请提供科学严谨的研究假设和验证方案。`,
    placeholder: '请描述你的研究问题，例如：AI辅助设计工具如何影响设计师的创意过程...'
  },
  {
    id: 'paper-writer',
    name: '论文撰写助手',
    description: '辅助学术论文的结构化撰写',
    category: 'research',
    icon: <PenTool className="w-6 h-6" />,
    capabilities: ['结构规划', '段落生成', '引用格式', '语言润色'],
    usageCount: 523,
    rating: 4.8,
    status: 'active',
    systemPrompt: `你是一位学术论文写作专家，专注于学术写作指导和论文润色。你的职责是：

1. **结构规划**：帮助规划论文的整体结构
2. **段落生成**：生成符合学术规范的段落内容
3. **引用格式**：确保引用符合期刊要求（APA/MLA/Chicago等）
4. **语言润色**：提升论文的学术表达质量

写作框架：
- 摘要（背景、方法、结果、结论）
- 引言（问题陈述、研究意义、论文结构）
- 文献综述（理论基础、研究现状）
- 方法（研究设计、数据收集、分析方法）
- 结果与讨论
- 结论与展望

请提供高质量的学术写作支持。`,
    placeholder: '请描述你的论文写作需求，例如：我需要撰写一篇关于生成式AI在设计教育中应用的论文摘要...'
  },
  {
    id: 'data-analyst',
    name: '数据分析智能体',
    description: '实验数据的统计分析和可视化',
    category: 'research',
    icon: <Brain className="w-6 h-6" />,
    capabilities: ['统计分析', '可视化', '结果解读', '报告生成'],
    usageCount: 167,
    rating: 4.4,
    status: 'active',
    systemPrompt: `你是一位数据分析专家，专注于研究数据的统计分析和解读。你的职责是：

1. **统计分析**：选择和应用适当的统计方法
2. **可视化建议**：提供数据可视化的最佳方案
3. **结果解读**：解释统计结果的实际意义
4. **报告生成**：撰写数据分析报告

分析方法：
- 描述性统计（均值、标准差、分布）
- 推断性统计（t检验、方差分析、回归分析）
- 多变量分析（因子分析、聚类分析）
- 效应量计算

请提供专业的数据分析建议和结果解读。`,
    placeholder: '请描述你的数据分析需求，例如：我有两组用户满意度数据（实验组n=50，对照组n=48），想比较两组是否有显著差异...'
  },
  {
    id: 'chat-assistant',
    name: '研究对话助手',
    description: '研究相关的智能问答和讨论',
    category: 'utility',
    icon: <MessageSquare className="w-6 h-6" />,
    capabilities: ['智能问答', '研究讨论', '知识检索', '建议生成'],
    usageCount: 891,
    rating: 4.9,
    status: 'active',
    systemPrompt: `你是一位研究助手，专注于帮助研究人员解决各种研究相关问题。你的职责是：

1. **智能问答**：回答研究方法、理论、工具相关问题
2. **研究讨论**：参与研究思路的讨论和完善
3. **知识检索**：提供相关领域的知识和资源
4. **建议生成**：给出研究改进建议

专业领域：
- 设计学研究方法
- 人机交互研究
- 用户体验研究
- 学术写作与发表

请以友好、专业的方式回答问题，提供有价值的建议。`,
    placeholder: '请输入你的问题，例如：如何设计一个有效的用户实验来评估新的交互界面？'
  },
];

const AgentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'design': return 'from-purple-500 to-pink-500';
      case 'research': return 'from-blue-500 to-cyan-500';
      default: return 'from-amber-500 to-orange-500';
    }
  };

  const callAPI = async (prompt: string, systemPrompt: string): Promise<string> => {
    return await callLLM(prompt, systemPrompt);
  };

  const handleRunAgent = async () => {
    if (!inputText.trim() || !selectedAgent) return;

    setIsLoading(true);
    setOutputText('');

    try {
      const result = await callAPI(inputText, selectedAgent.systemPrompt);
      setOutputText(result);
    } catch (err: any) {
      setOutputText(`错误: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openAgentDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">智能体工作台</h1>
          <p className="text-muted-foreground">设计智能体与科研智能体集合 - 点击使用即可调用</p>
        </div>
      </div>

      <APISettings />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索智能体..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="design">设计智能体</TabsTrigger>
            <TabsTrigger value="research">科研智能体</TabsTrigger>
            <TabsTrigger value="utility">工具智能体</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => openAgentDialog(agent)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(agent.category)} flex items-center justify-center text-white`}>
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{agent.rating}</span>
                  </div>
                </div>
                <CardTitle className="mt-3 group-hover:text-primary transition-colors">
                  {agent.name}
                </CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {agent.capabilities.slice(0, 3).map((cap) => (
                    <Badge key={cap} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    {agent.usageCount} 次调用
                  </div>
                  <Button size="sm" className="group-hover:bg-primary group-hover:text-white">
                    <Play className="w-4 h-4 mr-1" />
                    使用
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedAgent?.category || 'utility')} flex items-center justify-center text-white`}>
                {selectedAgent?.icon}
              </div>
              <div>
                <DialogTitle>{selectedAgent?.name}</DialogTitle>
                <DialogDescription>{selectedAgent?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">输入</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent?.capabilities.map((cap) => (
                    <Badge key={cap} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder={selectedAgent?.placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleRunAgent} 
                disabled={!inputText.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    运行智能体
                  </>
                )}
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">输出结果</h4>
                {outputText && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-green-500" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        复制
                      </>
                    )}
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] rounded-md border bg-slate-50">
                <div ref={outputRef} className="p-4">
                  {outputText ? (
                    <pre className="whitespace-pre-wrap text-sm font-sans">{outputText}</pre>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {isLoading ? '正在生成...' : '运行智能体后，结果将显示在这里'}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsPage;
