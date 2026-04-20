import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Globe, FileText, RefreshCw, Play, Loader2,
  Check, AlertCircle, Sparkles, BookOpen, Link, ExternalLink,
  Download, Copy, Layers, Zap, Target, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import { API_CONFIG, searchSemanticScholar, searchArxiv, SemanticScholarPaper, ArxivPaper, callLLM } from '@/config/api';
import APISettings from '@/components/APISettings';
import LiteratureSearchResults from '@/components/LiteratureSearchResults';

type GPTResearcherStage = 'initial' | 'planning' | 'crawling' | 'analyzing' | 'writing' | 'completed' | 'error';

interface Source {
  id: string;
  url: string;
  title: string;
  content: string;
  relevance: number;
  type: 'web' | 'academic' | 'news';
}

interface ResearchSection {
  title: string;
  content: string;
  sources: string[];
}

interface ResearchReport {
  title: string;
  query: string;
  summary: string;
  sections: ResearchSection[];
  sources: Source[];
  citations: string[];
  createdAt: Date;
}

interface GPTResearcherSession {
  id: string;
  query: string;
  reportType: string;
  stage: GPTResearcherStage;
  sources: Source[];
  papers: (SemanticScholarPaper | ArxivPaper)[];
  report: ResearchReport | null;
  createdAt: Date;
}

const STAGE_CONFIG: Record<GPTResearcherStage, { label: string; description: string }> = {
  initial: { label: '准备开始', description: '输入研究问题' },
  planning: { label: '规划研究', description: '正在规划研究策略...' },
  crawling: { label: '信息采集', description: '正在从多源采集信息...' },
  analyzing: { label: '分析整理', description: '正在分析和整理信息...' },
  writing: { label: '撰写报告', description: '正在撰写研究报告...' },
  completed: { label: '完成', description: '报告已生成' },
  error: { label: '错误', description: '发生错误' }
};

const REPORT_TYPES = [
  { value: 'research_report', label: '研究报告', desc: '全面深入的研究报告' },
  { value: 'resource_report', label: '资源报告', desc: '资源汇总和链接整理' },
  { value: 'outline_report', label: '大纲报告', desc: '结构化大纲形式' },
  { value: 'summary_report', label: '摘要报告', desc: '简洁的摘要形式' }
];

const GPTResearcherAgent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [reportType, setReportType] = useState('research_report');
  const [session, setSession] = useState<GPTResearcherSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };



  const runGPTResearcher = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);
    setLogs([]);

    const newSession: GPTResearcherSession = {
      id: `gptresearcher_${Date.now()}`,
      query,
      reportType,
      stage: 'planning',
      sources: [],
      papers: [],
      report: null,
      createdAt: new Date()
    };
    setSession(newSession);
    addLog('开始 GPT Researcher 研究流程');

    try {
      // Stage 1: 规划研究策略
      setCurrentStep(1);
      addLog('正在规划研究策略...');
      
      const planningPrompt = `你是一位研究规划专家。请针对以下研究问题，制定详细的研究策略：

研究问题：${query}
报告类型：${reportType}

请提供：
1. 关键搜索词（5-8个）
2. 需要关注的子主题（3-5个）
3. 可能的信息来源类型
4. 预期的报告结构`;

      const planResult = await callLLM(planningPrompt, 
        '你是一位研究规划专家，擅长制定系统的研究策略。');
      addLog('研究策略规划完成');

      // Stage 2: 信息采集（模拟多源采集）
      setCurrentStep(2);
      setSession(prev => prev ? { ...prev, stage: 'crawling' } : null);
      addLog('正在从多源采集信息...');
      
      const semanticScholarPapers = await searchSemanticScholar(query, 10);
      const arxivPapers = await searchArxiv(query, 8);
      
      const sources: Source[] = [];
      
      semanticScholarPapers.forEach((paper, i) => {
        sources.push({
          id: `s2_${i}`,
          url: paper.url || `https://semanticscholar.org/paper/${paper.paperId}`,
          title: paper.title,
          content: paper.abstract || '无摘要',
          relevance: 0.9 - (i * 0.05),
          type: 'academic'
        });
      });
      
      arxivPapers.forEach((paper, i) => {
        sources.push({
          id: `arxiv_${i}`,
          url: paper.link,
          title: paper.title,
          content: paper.summary,
          relevance: 0.85 - (i * 0.05),
          type: 'academic'
        });
      });
      
      const allPapers = [...semanticScholarPapers, ...arxivPapers];
      setSession(prev => prev ? { ...prev, sources, papers: allPapers, stage: 'analyzing' } : null);
      addLog(`采集到 ${sources.length} 个信息源`);

      // Stage 3: 分析整理
      setCurrentStep(3);
      addLog('正在分析和整理信息...');
      
      const sourcesContent = sources.slice(0, 15).map((s, i) => 
        `[${i+1}] ${s.title}\n${s.content.substring(0, 500)}`
      ).join('\n\n---\n\n');

      const analyzePrompt = `请分析以下研究资料，提取关键信息：

研究问题：${query}

资料内容：
${sourcesContent}

请提供：
1. 主要发现（3-5点）
2. 关键观点和论据
3. 不同来源的共识与分歧
4. 研究空白和未来方向`;

      const analysisResult = await callLLM(analyzePrompt, 
        '你是一位研究分析专家，擅长从大量资料中提取关键信息。', true);
      addLog('信息分析完成');

      // Stage 4: 撰写报告
      setCurrentStep(4);
      setSession(prev => prev ? { ...prev, stage: 'writing' } : null);
      addLog('正在撰写研究报告...');
      
      const writePrompt = `请基于以下研究资料和分析结果，撰写一份全面的研究报告：

研究问题：${query}
报告类型：${reportType}

分析结果：
${analysisResult}

参考资料：
${sources.slice(0, 10).map((s, i) => `[${i+1}] ${s.title}`).join('\n')}

报告要求：
1. 结构清晰，逻辑严谨
2. 内容全面，论据充分
3. 引用规范，来源可追溯
4. 语言专业，表述准确

请按以下结构撰写：
- 摘要
- 引言
- 主要发现
- 详细分析
- 结论与建议
- 参考文献`;

      const reportContent = await callLLM(writePrompt, 
        '你是一位专业的学术写作专家，擅长撰写高质量的研究报告。', true);
      
      const report: ResearchReport = {
        title: `${query} - 研究报告`,
        query,
        summary: analysisResult.substring(0, 500),
        sections: [
          { title: '摘要', content: reportContent.split('\n\n')[0] || '', sources: [] },
          { title: '引言', content: reportContent.split('\n\n')[1] || '', sources: [] },
          { title: '主要发现', content: reportContent.split('\n\n')[2] || '', sources: [] },
          { title: '详细分析', content: reportContent.split('\n\n')[3] || '', sources: [] },
          { title: '结论与建议', content: reportContent.split('\n\n')[4] || '', sources: [] }
        ],
        sources,
        citations: sources.slice(0, 15).map((s, i) => `[${i+1}] ${s.title} - ${s.url}`),
        createdAt: new Date()
      };
      
      setSession(prev => prev ? { ...prev, report, stage: 'completed' } : null);
      setCurrentStep(5);
      addLog('研究报告撰写完成');

    } catch (err: any) {
      addLog(`错误: ${err.message}`);
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setQuery('');
    setCurrentStep(0);
    setLogs([]);
  };

  const steps = [
    { label: '规划研究', icon: <Target className="w-4 h-4" /> },
    { label: '信息采集', icon: <Globe className="w-4 h-4" /> },
    { label: '分析整理', icon: <Layers className="w-4 h-4" /> },
    { label: '撰写报告', icon: <FileText className="w-4 h-4" /> }
  ];

  const fullReportContent = session?.report ? `
# ${session.report.title}

## 摘要
${session.report.summary}

${session.report.sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n')}

## 参考文献
${session.report.citations.join('\n')}
` : '';

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-7 h-7 text-emerald-600" />
            GPT Researcher 智能体
          </h1>
          <p className="text-muted-foreground">
            多源信息采集与深度研究报告生成系统
          </p>
        </div>
        {session && (
          <Button variant="outline" onClick={resetSession}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        )}
      </div>

      <APISettings />

      <Alert className="bg-emerald-50 border-emerald-200">
        <Zap className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="text-emerald-800">GPT Researcher 方法论</AlertTitle>
        <AlertDescription className="text-emerald-700">
          自动化研究流程：研究规划 → 多源采集 → 信息分析 → 报告生成
        </AlertDescription>
      </Alert>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始研究</CardTitle>
            <CardDescription>
              输入研究问题，系统将自动采集信息并生成研究报告
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">研究问题 *</Label>
              <Input
                id="query"
                placeholder="例如：大语言模型在教育领域的应用现状与挑战"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportType">报告类型</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择报告类型" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <div>
                        <span className="font-medium">{t.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{t.desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Target className="w-4 h-4" />, label: '研究规划', desc: '制定研究策略' },
                { icon: <Globe className="w-4 h-4" />, label: '多源采集', desc: '20+信息源' },
                { icon: <Layers className="w-4 h-4" />, label: '信息分析', desc: '智能整理归纳' },
                { icon: <FileText className="w-4 h-4" />, label: '报告生成', desc: '专业研究报告' }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <Button
              onClick={runGPTResearcher}
              disabled={!query.trim() || isLoading}
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
                  开始研究
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex flex-col items-center ${
                      currentStep > index ? 'text-green-600' :
                      currentStep === index ? 'text-emerald-600' : 'text-muted-foreground'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep > index ? 'border-green-600 bg-green-50' :
                        currentStep === index ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'
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

          {session.papers.length > 0 && (
            <LiteratureSearchResults 
              papers={session.papers} 
              title="学术文献" 
              description="从Semantic Scholar和arXiv检索到的相关学术文献"
            />
          )}

          {session.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  信息来源 ({session.sources.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="academic">学术</TabsTrigger>
                    <TabsTrigger value="web">网页</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {session.sources.map((source) => (
                          <div key={source.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{source.title}</div>
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {source.url.substring(0, 50)}...
                                </a>
                              </div>
                              <Badge variant="outline">
                                {Math.round(source.relevance * 100)}%相关
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="academic">
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {session.sources.filter(s => s.type === 'academic').map((source) => (
                          <div key={source.id} className="p-3 border rounded-lg">
                            <div className="font-medium text-sm">{source.title}</div>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline"
                            >
                              {source.url.substring(0, 50)}...
                            </a>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="web">
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {session.sources.filter(s => s.type === 'web').map((source) => (
                          <div key={source.id} className="p-3 border rounded-lg">
                            <div className="font-medium text-sm">{source.title}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {session.report && session.stage === 'completed' && (
            <DocumentOutput
              content={fullReportContent}
              title={session.report.title}
              showPreview={true}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                运行日志
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[120px]">
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, i) => (
                    <div key={i} className="text-muted-foreground">{log}</div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">GPT Researcher 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <h4 className="font-medium text-emerald-700 mb-1">多源信息采集</h4>
              <p className="text-sm text-emerald-600">整合Semantic Scholar、arXiv等多个数据源</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">智能信息分析</h4>
              <p className="text-sm text-blue-600">自动提取关键信息，识别观点共识与分歧</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">专业报告生成</h4>
              <p className="text-sm text-purple-600">生成结构完整、引用规范的研究报告</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['gpt-researcher']} />
    </div>
  );
};

export default GPTResearcherAgent;
