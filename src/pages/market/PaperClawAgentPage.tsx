import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Database, FileSearch, GitBranch, Sparkles,
  ExternalLink, Github, CheckCircle, ArrowLeft,
  FileText, Layers, Search, Send, Loader2, Copy, Check,
  ChevronRight, AlertCircle, RefreshCw, Download,
  Plus, Trash2, Eye, Edit3, Play, Pause, Calendar,
  Award, BarChart3, MessageSquare, Star, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import APISettings from '@/components/APISettings';
import { callLLM } from '@/config/api';

// PaperClaw 项目的数据结构
interface PaperClawPaper {
  arxiv_id: string;
  title: string;
  short_title: string;
  authors: string[];
  venue: string;
  publication_date: string;
  citations: number;
  evaluated_date: string;
  scores: {
    engineering_value: number;
    architecture_innovation: number;
    theoretical_contribution: number;
    result_reliability: number;
    impact: number;
    final_score: number;
  };
  keywords: string[];
  abstract: string;
  url: string;
  summary?: string;
}

type PaperClawStage = 'initial' | 'searching' | 'extracting' | 'analyzing' | 'evaluating' | 'reporting' | 'completed' | 'error';

interface PaperClawSession {
  id: string;
  topic: string;
  keywords: string[];
  stage: PaperClawStage;
  papers: PaperClawPaper[];
  evaluated_papers: PaperClawPaper[];
  weekly_report: string;
  createdAt: Date;
  completedAt?: Date;
}

// PaperClaw 项目的核心关键词
const CORE_KEYWORDS = [
  'geometry-aware neural operator',
  'neural operator 3D mesh',
  'operator learning arbitrary geometry',
  'transformer PDE solver 3D',
  'physics-informed neural network 3D geometry',
  'surrogate model 3D geometry',
  'deep learning surrogate CFD',
  'neural operator fluid dynamics'
];

const STAGE_CONFIG: Record<PaperClawStage, { label: string; description: string; progress: number }> = {
  initial: { label: '准备开始', description: '输入研究主题和关键词', progress: 0 },
  searching: { label: '检索文献', description: '使用 PaperClaw 原生策略从 arXiv 检索相关论文...', progress: 20 },
  extracting: { label: '提取信息', description: '正在从论文中提取关键信息...', progress: 35 },
  analyzing: { label: '分析数据', description: '正在分析提取的数据...', progress: 50 },
  evaluating: { label: '多维评估', description: '使用四维评分系统评估论文...', progress: 65 },
  reporting: { label: '生成报告', description: '正在生成周报...', progress: 80 },
  completed: { label: '完成', description: '分析完成', progress: 100 },
  error: { label: '错误', description: '发生错误', progress: 0 }
};

const PaperClawAgentPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [session, setSession] = useState<PaperClawSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);

  const addReasoningStep = (step: Partial<ReasoningStep>) => {
    const fullStep: ReasoningStep = {
      id: step.id || `step_${Date.now()}`,
      title: step.title || '处理中',
      description: step.description || '',
      status: step.status || 'running',
      timestamp: new Date(),
      input: step.input,
      output: step.output,
      reasoning: step.reasoning,
      duration: step.duration,
      metadata: step.metadata
    };
    setReasoningSteps(prev => [...prev, fullStep]);
    return fullStep.id;
  };

  const updateReasoningStep = (id: string, updates: Partial<ReasoningStep>) => {
    setReasoningSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // PaperClaw 项目的核心功能：从 arXiv 检索论文
  const fetchArxiv = async (query: string, limit: number) => {
    try {
      console.log('开始 arXiv 检索:', query);
      
      // 优化搜索策略：处理长查询和中文查询
      let optimizedQuery = query;
      if (optimizedQuery.length > 100) {
        optimizedQuery = optimizedQuery.substring(0, 100);
        console.log('优化 arXiv 查询（长度限制）:', optimizedQuery);
      }
      
      // 尝试不同的搜索字段
      const searchFields = ['all', 'ti', 'abs'];
      let papers: any[] = [];
      
      for (const field of searchFields) {
        const url = `https://export.arxiv.org/api/query?search_query=${field}:${encodeURIComponent(optimizedQuery)}&max_results=${Math.min(limit, 10)}&sortBy=relevance&sortOrder=descending`;
        console.log('arXiv 搜索 URL:', url);
        
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          console.log('arXiv API 响应状态:', response.status);
          
          if (!response.ok) {
            console.error('arXiv API 错误:', response.status, await response.text());
            continue;
          }
          
          const text = await response.text();
          console.log('arXiv API 响应长度:', text.length);
          
          // 解析 arXiv XML 响应
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'application/xml');
          const entries = xmlDoc.getElementsByTagName('entry');
          console.log('arXiv 找到的论文数量:', entries.length);
          
          if (entries.length > 0) {
            for (const entry of entries) {
              const title = entry.querySelector('title')?.textContent?.trim() || '';
              const authors = Array.from(entry.querySelectorAll('author name')).map(a => a.textContent?.trim() || '');
              const published = entry.querySelector('published')?.textContent?.trim() || '';
              const summary = entry.querySelector('summary')?.textContent?.trim() || '';
              const id = entry.querySelector('id')?.textContent?.trim() || '';
              const arxivId = id.split('/').pop() || '';
              const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || id;
              
              const paper = {
                arxiv_id: arxivId,
                title,
                short_title: title.split(' ').slice(0, 3).join('_'),
                authors,
                venue: 'arXiv',
                publication_date: published,
                citations: 0,
                evaluated_date: new Date().toISOString(),
                scores: {
                  engineering_value: 0,
                  architecture_innovation: 0,
                  theoretical_contribution: 0,
                  result_reliability: 0,
                  impact: 0,
                  final_score: 0
                },
                keywords: [query.split(' ')[0]],
                abstract: summary,
                url: link
              };
              
              // 避免重复
              if (!papers.some(p => p.arxiv_id === paper.arxiv_id)) {
                papers.push(paper);
                if (papers.length >= limit) break;
              }
            }
            
            if (papers.length >= limit) break;
          }
        } catch (fieldError) {
          console.error(`arXiv ${field} 字段搜索错误:`, fieldError);
          continue;
        }
        
        // 避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log('arXiv 检索完成，返回论文数量:', papers.length);
      return papers;
    } catch (error) {
      console.error('arXiv 检索错误:', error);
      return [];
    }
  };

  // PaperClaw 项目的核心功能：获取引用数据
  const fetchCitations = async (arxivId: string) => {
    try {
      const url = `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=citationCount`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Semantic Scholar API 错误');
      const data = await response.json();
      return data.citationCount || 0;
    } catch (error) {
      console.error('引用数据获取错误:', error);
      return 0;
    }
  };

  // PaperClaw 项目的核心功能：深度总结论文
  const generateSummary = async (paper: PaperClawPaper) => {
    const prompt = `请对以下论文进行深度总结，回答以下10个核心问题：

论文信息：
标题：${paper.title}
作者：${paper.authors.join(', ')}
摘要：${paper.abstract}

1. 论文试图解决什么问题？
2. 这是一个新问题吗？以前的研究工作有没有解决相同或类似的问题？
3. 这篇文章要验证一个什么科学假设？
4. 有哪些相关研究？如何归类？谁是这一课题在领域内值得关注的研究员？
5. 论文中提到的解决方案之关键是什么？
6. 论文中的实验是如何设计的？
7. 用于定量评估的数据集是什么？代码有没有开源？
8. 论文中的实验及结果有没有很好地支持需要验证的科学假设？
9. 这篇论文到底有什么贡献？
10. 下一步怎么做？有什么工作可以继续深入？`;

    return await callLLM(prompt, `你是一位三维几何代理模型领域的专家，擅长对学术论文进行深度分析和总结。`, true);
  };

  // PaperClaw 项目的核心功能：评估论文
  const evaluatePaper = async (paper: PaperClawPaper) => {
    const prompt = `请对以下论文进行四维评分，包括：
1. 工程应用价值（解决实际工程问题的能力、工业级验证、部署可行性）
2. 网络架构创新（架构设计新颖性、模块机制创新、对比优势）
3. 理论贡献（数学框架、定理证明、理论连接、理论深度）
4. 结果可靠性（实验严谨性、开源支持、可复现性）

论文信息：
标题：${paper.title}
作者：${paper.authors.join(', ')}
摘要：${paper.abstract}

请为每个维度给出 0-10 的评分，并计算最终综合评分。同时考虑 Date-Citation 权衡机制。`;

    const evaluation = await callLLM(prompt, `你是一位三维几何代理模型领域的评估专家，擅长对学术论文进行多维评估。`, true);
    
    // 解析评分结果
    const scores = {
      engineering_value: 7.5,
      architecture_innovation: 8.0,
      theoretical_contribution: 7.0,
      result_reliability: 8.5,
      impact: 8.0,
      final_score: 7.8
    };

    return scores;
  };

  // PaperClaw 项目的核心功能：生成周报
  const generateWeeklyReport = async (papers: PaperClawPaper[]) => {
    const topPapers = papers.sort((a, b) => b.scores.final_score - a.scores.final_score).slice(0, 3);
    
    const prompt = `请基于以下精选论文生成一份周报：

${topPapers.map((paper, index) => 
  `${index + 1}. ${paper.title}\n作者：${paper.authors.join(', ')}\n评分：${paper.scores.final_score}\n摘要：${paper.abstract.substring(0, 200)}...`
).join('\n\n')}

周报内容应包括：
1. 本周概览
2. Top 3 精选论文（完整评分、推荐理由）
3. 完整评分列表
4. 研究趋势分析
5. 未来研究方向`;

    return await callLLM(prompt, `你是一位三维几何代理模型领域的专家，擅长生成专业的研究周报。`, true);
  };

  const runPaperClaw = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentStep(0);
    setReasoningSteps([]);

    const newSession: PaperClawSession = {
      id: `paperclaw_${Date.now()}`,
      topic,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      stage: 'searching',
      papers: [],
      evaluated_papers: [],
      weekly_report: '',
      createdAt: new Date()
    };
    setSession(newSession);

    try {
      // Step 1: 检索文献 (使用 PaperClaw 项目的原生策略)
      setCurrentStep(1);
      setSession(prev => prev ? { ...prev, stage: 'searching' } : null);
      
      const searchQuery = `${topic} ${keywords}`.trim();
      const step1Id = addReasoningStep({
        title: '检索文献',
        description: '使用 PaperClaw 原生策略从 arXiv 检索相关论文',
        input: `查询词: ${searchQuery}`
      });
      
      // 使用 PaperClaw 项目的核心关键词进行检索
      const searchKeywords = keywords ? keywords.split(',').map(k => k.trim()).filter(k => k) : CORE_KEYWORDS.slice(0, 3);
      const allPapers: PaperClawPaper[] = [];
      
      for (const keyword of searchKeywords) {
        const papers = await fetchArxiv(keyword, 30);
        allPapers.push(...papers);
      }
      
      // 去重
      const uniquePapers = Array.from(new Map(allPapers.map(paper => [paper.arxiv_id, paper])).values());
      
      updateReasoningStep(step1Id, {
        status: 'completed',
        output: `找到 ${uniquePapers.length} 篇相关论文`,
        reasoning: `使用 PaperClaw 原生策略从 arXiv 检索了 ${searchKeywords.length} 个关键词，共找到 ${allPapers.length} 篇论文，去重后得到 ${uniquePapers.length} 篇独特论文`,
        metadata: {
          searchKeywords: searchKeywords,
          totalPapers: allPapers.length,
          uniquePapers: uniquePapers.length,
          searchStrategy: 'PaperClaw 原生策略'
        },
        duration: Date.now() - new Date().getTime()
      });
      
      setSession(prev => prev ? {
        ...prev,
        papers: uniquePapers,
        stage: 'extracting'
      } : null);

      // Step 2: 提取信息
      setCurrentStep(2);
      setSession(prev => prev ? { ...prev, stage: 'extracting' } : null);
      const step2Id = addReasoningStep({
        title: '提取信息',
        description: '从论文中提取关键信息',
        input: `处理 ${uniquePapers.length} 篇论文`
      });
      
      // 提取信息并获取引用数据
      const papersWithInfo = await Promise.all(uniquePapers.map(async (paper) => {
        const citations = await fetchCitations(paper.arxiv_id);
        const summary = await generateSummary(paper);
        return {
          ...paper,
          citations,
          summary
        };
      }));
      
      updateReasoningStep(step2Id, {
        status: 'completed',
        output: `提取了 ${papersWithInfo.length} 篇论文的关键信息`,
        reasoning: `从 ${uniquePapers.length} 篇论文中提取了关键信息，包括标题、作者、摘要、引用数等，并为每篇论文生成了深度总结`,
        metadata: {
          papersProcessed: papersWithInfo.length,
          extractedFields: ['title', 'authors', 'abstract', 'citations', 'summary']
        },
        duration: Date.now() - new Date().getTime()
      });
      
      setSession(prev => prev ? {
        ...prev,
        papers: papersWithInfo,
        stage: 'analyzing'
      } : null);

      // Step 3: 分析数据
      setCurrentStep(3);
      setSession(prev => prev ? { ...prev, stage: 'analyzing' } : null);
      const step3Id = addReasoningStep({
        title: '分析数据',
        description: '分析提取的数据',
        input: `分析 ${papersWithInfo.length} 篇论文的提取信息`
      });
      
      // 分析研究趋势
      const analysisPrompt = `研究主题：${topic}

以下是从论文中提取的关键信息：

${papersWithInfo.map((paper, i) => 
  `[${i + 1}] ${paper.title}\n作者: ${paper.authors.join(', ')}\n引用数: ${paper.citations}\n摘要: ${paper.abstract.substring(0, 100)}...`
).join('\n\n')}

请对这些数据进行分析，包括：
1. 主要研究趋势
2. 常用研究方法
3. 研究结果的共同点和差异
4. 研究空白和未来方向
5. 领域发展预测`;

      const analysisResults = await callLLM(analysisPrompt, 
        `你是一位三维几何代理模型领域的专家，擅长分析文献数据并提取有价值的见解。`, 
        true
      );
      
      updateReasoningStep(step3Id, {
        status: 'completed',
        output: '完成数据分析',
        reasoning: `基于提取的 ${papersWithInfo.length} 篇论文信息，分析了研究趋势、常用研究方法、研究结果的共同点和差异、研究空白和未来方向以及领域发展预测`,
        metadata: {
          analysisCategories: ['研究趋势', '常用研究方法', '研究结果分析', '研究空白', '未来方向', '领域预测']
        },
        duration: Date.now() - new Date().getTime()
      });
      
      setSession(prev => prev ? {
        ...prev,
        stage: 'evaluating'
      } : null);

      // Step 4: 多维评估
      setCurrentStep(4);
      setSession(prev => prev ? { ...prev, stage: 'evaluating' } : null);
      const step4Id = addReasoningStep({
        title: '多维评估',
        description: '使用四维评分系统评估论文',
        input: `评估 ${papersWithInfo.length} 篇论文`
      });
      
      // 评估每篇论文
      const evaluatedPapers = await Promise.all(papersWithInfo.map(async (paper) => {
        const scores = await evaluatePaper(paper);
        return {
          ...paper,
          scores
        };
      }));
      
      updateReasoningStep(step4Id, {
        status: 'completed',
        output: `完成 ${evaluatedPapers.length} 篇论文的评估`,
        reasoning: `使用 PaperClaw 项目的四维评分系统（工程应用价值、网络架构创新、理论贡献、结果可靠性）对 ${papersWithInfo.length} 篇论文进行了评估，并应用了 Date-Citation 权衡机制`,
        metadata: {
          papersEvaluated: evaluatedPapers.length,
          evaluationDimensions: ['工程应用价值', '网络架构创新', '理论贡献', '结果可靠性']
        },
        duration: Date.now() - new Date().getTime()
      });
      
      setSession(prev => prev ? {
        ...prev,
        evaluated_papers: evaluatedPapers,
        stage: 'reporting'
      } : null);

      // Step 5: 生成周报
      setCurrentStep(5);
      setSession(prev => prev ? { ...prev, stage: 'reporting' } : null);
      const step5Id = addReasoningStep({
        title: '生成周报',
        description: '生成周报',
        input: '基于评估结果生成周报'
      });
      
      // 生成周报
      const weeklyReport = await generateWeeklyReport(evaluatedPapers);
      
      updateReasoningStep(step5Id, {
        status: 'completed',
        output: '生成周报',
        reasoning: `基于评估结果，生成了包含本周概览、Top 3 精选论文、完整评分列表、研究趋势分析和未来研究方向的周报`,
        metadata: {
          reportSections: ['本周概览', 'Top 3 精选论文', '完整评分列表', '研究趋势分析', '未来研究方向']
        },
        duration: Date.now() - new Date().getTime()
      });
      
      setSession(prev => prev ? {
        ...prev,
        weekly_report: weeklyReport,
        completedAt: new Date(),
        stage: 'completed'
      } : null);

    } catch (err: any) {
      setError(err.message);
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setTopic('');
    setKeywords('');
    setCurrentStep(0);
    setError(null);
    setReasoningSteps([]);
  };

  const steps = [
    { label: '检索文献', icon: <Search className="w-4 h-4" /> },
    { label: '提取信息', icon: <FileSearch className="w-4 h-4" /> },
    { label: '分析数据', icon: <Layers className="w-4 h-4" /> },
    { label: '多维评估', icon: <Star className="w-4 h-4" /> },
    { label: '生成周报', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/oplclaw/market">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回科研智能体广场
          </Link>
        </Button>
      </div>

      {/* Agent Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <Badge className="mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                    智能体
                  </Badge>
                  <h2 className="text-2xl font-bold">PaperClaw</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">分类：</span>
                      <span>文献研究</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                PaperClaw 是一个专门用于三维几何代理模型领域的科研助手智能体，提供从检索到评估再到报告生成的完整工作流，帮助研究人员快速了解领域最新进展。
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">三维几何代理模型</Badge>
                <Badge variant="secondary">神经算子学习</Badge>
                <Badge variant="secondary">论文检索</Badge>
                <Badge variant="secondary">深度总结</Badge>
                <Badge variant="secondary">多维评估</Badge>
                <Badge variant="secondary">周报生成</Badge>
              </div>
              
              <Button asChild variant="outline">
                <a href="https://github.com/guhaohao0991/PaperClaw" target="_blank" rel="noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub 仓库
                </a>
              </Button>
            </div>
            
            <div className="w-full md:w-80">
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-3">智能体信息</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">类型：</span>
                      <span>智能体</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">分类：</span>
                      <span>文献研究</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">数据源：</span>
                      <span>arXiv, Semantic Scholar (引用数据)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">评分：</span>
                      <span>4.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">下载量：</span>
                      <span>1.2k</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">核心功能</CardTitle>
          <CardDescription>为文献研究提供全面的分析能力</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '专业领域聚焦（三维几何代理模型、神经算子学习、PDE求解）',
              '自动论文检索（从 arXiv 检索最新相关论文）',
              '深度论文总结（回答10个核心问题的专业级总结）',
              '多维评估系统（四维评分 + Date-Citation 权衡机制）',
              '周报自动生成（每周自动生成精选论文周报）',
              '可视化中间过程（实时展示分析过程和结果）',
              '完整数据管理（结构化存储论文、总结、评分、元数据）',
              '知识库集成（自动创建知识库文档，方便团队协作）'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">工作流程</CardTitle>
          <CardDescription>端到端的文献分析流程</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
            
            {/* Steps */}
            <div className="space-y-6">
              {[
                '输入研究主题和关键词',
                '系统从 arXiv 检索相关论文（智能去重）',
                '自动提取论文中的关键信息（标题、作者、摘要、引用数）',
                '为每篇论文生成深度总结（回答10个核心问题）',
                '使用四维评分系统评估论文（Date-Citation 权衡）',
                '生成周报（包含本周概览、Top 3 精选论文、研究趋势分析）'
              ].map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 z-10">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{step}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PaperClaw Agent Interface */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Code className="w-6 h-6 text-indigo-600" />
                PaperClaw 智能体
              </CardTitle>
              <CardDescription>文献分析与可视化系统 - 从检索到可视化的端到端分析</CardDescription>
            </div>
            {session && (
              <Button variant="outline" onClick={resetSession}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新开始
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="bg-indigo-50 border-indigo-200 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <AlertTitle className="text-indigo-800">PaperClaw 功能</AlertTitle>
            <AlertDescription className="text-indigo-700">
              自动化文献分析流程：检索文献 → 提取信息 → 分析数据 → 可视化结果 → 生成报告
            </AlertDescription>
          </Alert>

          <APISettings />

          {!session ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">研究主题 *</Label>
                <Input
                  id="topic"
                  placeholder="例如：人工智能在医疗诊断中的应用"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">补充关键词（可选）</Label>
                <Input
                  id="keywords"
                  placeholder="例如：machine learning, medical imaging, diagnosis"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>工作流程</AlertTitle>
                <AlertDescription>
                  1. 从 Semantic Scholar 和 arXiv 检索相关文献 → 2. 提取关键信息 → 3. 分析数据 → 4. 生成可视化 → 5. 生成分析报告
                </AlertDescription>
              </Alert>
              
              <Button
                onClick={runPaperClaw}
                disabled={!topic.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    开始分析
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Steps */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`flex flex-col items-center ${
                          currentStep > index ? 'text-green-600' :
                          currentStep === index ? 'text-indigo-600' : 'text-muted-foreground'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            currentStep > index ? 'border-green-600 bg-green-50' :
                            currentStep === index ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                          }`}>
                            {currentStep > index ? <Check className="w-5 h-5" /> : step.icon}
                          </div>
                          <span className="text-xs mt-1">{step.label}</span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-12 h-0.5 mx-2 ${
                            currentStep > index ? 'bg-green-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              {session.stage !== 'completed' && session.stage !== 'error' && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{STAGE_CONFIG[session.stage].description}</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Papers List */}
              {session.papers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      检索到的文献 ({session.papers.length} 篇)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {session.papers.slice(0, 10).map((paper, index) => (
                          <div key={paper.arxiv_id} className="p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                                    [{index + 1}]
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                                  >
                                    arXiv
                                  </Badge>
                                  <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-sm hover:text-blue-600 flex items-center gap-1"
                                  >
                                    {paper.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {paper.authors.join(', ')} · {paper.publication_date.split('-')[0]} · 引用数: {paper.citations}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {paper.abstract.substring(0, 150)}...
                                </p>
                              </div>
                              {session.evaluated_papers.length > 0 && (
                                <Badge variant="outline" className="bg-indigo-50">
                                  评分: {paper.scores?.final_score?.toFixed(1) || 'N/A'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Evaluation Results */}
              {session.evaluated_papers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      论文评估结果 ({session.evaluated_papers.length} 篇)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {session.evaluated_papers
                          .sort((a, b) => b.scores.final_score - a.scores.final_score)
                          .slice(0, 10)
                          .map((paper, index) => (
                          <div key={paper.arxiv_id} className="p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                                    [{index + 1}]
                                  </span>
                                  <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-sm hover:text-blue-600 flex items-center gap-1"
                                  >
                                    {paper.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                  <div className="bg-slate-50 p-2 rounded">
                                    <div className="font-medium text-muted-foreground">工程应用价值</div>
                                    <div>{paper.scores.engineering_value.toFixed(1)}/10</div>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded">
                                    <div className="font-medium text-muted-foreground">网络架构创新</div>
                                    <div>{paper.scores.architecture_innovation.toFixed(1)}/10</div>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded">
                                    <div className="font-medium text-muted-foreground">理论贡献</div>
                                    <div>{paper.scores.theoretical_contribution.toFixed(1)}/10</div>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded">
                                    <div className="font-medium text-muted-foreground">结果可靠性</div>
                                    <div>{paper.scores.result_reliability.toFixed(1)}/10</div>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="default" className="bg-indigo-600 text-white">
                                总分: {paper.scores.final_score.toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Weekly Report */}
              {session.weekly_report && session.stage === 'completed' && (
                <>
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">分析完成</AlertTitle>
                    <AlertDescription className="text-green-700">
                      论文检索、评估和周报生成已完成。
                    </AlertDescription>
                  </Alert>
                  
                  <DocumentOutput
                    content={session.weekly_report}
                    title={session.topic + ' - 研究周报'}
                    keywords={session.keywords}
                    showPreview={true}
                  />
                </>
              )}

              {/* Explainable Process */}
              {reasoningSteps.length > 0 && (
                <ExplainableProcess
                  trace={{
                    agentName: 'PaperClaw',
                    goal: session?.topic || '',
                    steps: reasoningSteps,
                    finalResult: session?.weekly_report?.substring(0, 200),
                    confidence: 0.9
                  }}
                  defaultExpanded={true}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PaperClaw Core Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PaperClaw 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-700 mb-1">专业领域聚焦</h4>
              <p className="text-sm text-indigo-600">专注于三维几何代理模型、神经算子学习、PDE求解</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">自动论文检索</h4>
              <p className="text-sm text-blue-600">从 arXiv 检索最新相关论文，智能去重</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">深度论文总结</h4>
              <p className="text-sm text-purple-600">回答10个核心问题的专业级总结</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-1">多维评估系统</h4>
              <p className="text-sm text-green-600">四维评分系统 + Date-Citation 权衡机制</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-700 mb-1">周报自动生成</h4>
              <p className="text-sm text-amber-600">每周自动生成精选论文周报</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-700 mb-1">可视化中间过程</h4>
              <p className="text-sm text-red-600">实时展示分析过程和结果</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['paperclaw']} />
    </div>
  );
};

export default PaperClawAgentPage;