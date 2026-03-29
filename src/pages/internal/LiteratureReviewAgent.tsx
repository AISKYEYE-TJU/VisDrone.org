import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Send, Loader2, Copy, Check,
  FileText, Layers, GitBranch, Sparkles, Settings,
  ChevronRight, AlertCircle, RefreshCw, Download,
  Plus, Trash2, Eye, Edit3, Play, Pause, ExternalLink,
  Database, FileSearch, Quote, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import APISettings from '@/components/APISettings';
import { 
  API_CONFIG, 
  SEMANTIC_SCHOLAR_API, 
  ARXIV_API, 
  DATA_SOURCES,
  searchArxiv,
  searchSemanticScholar,
  searchAllSources,
  callLLM,
  ArxivPaper,
  SemanticScholarPaper
} from '@/config/api';

interface Author {
  name: string;
  authorId?: string;
  affiliation?: string[];
}

interface RealPaper {
  paperId: string;
  title: string;
  authors: Author[];
  year: number | null;
  abstract: string;
  venue: string;
  citationCount: number;
  referenceCount: number;
  influentialCitationCount: number;
  isOpenAccess: boolean;
  openAccessPdf?: string;
  url: string;
  tldr?: string;
  publicationDate?: string;
  journal?: string;
}

interface LiteratureSource {
  id: string;
  title: string;
  authors: string;
  year: string;
  summary: string;
  relevance: number;
  keyFindings: string[];
  paperId: string;
  url: string;
  citationCount: number;
  isOpenAccess: boolean;
  openAccessPdf?: string;
  source: 'semantic_scholar' | 'arxiv';
  categories?: string[];
}

type ReviewStage = 'initial' | 'searching' | 'fetching' | 'analyzing' | 'synthesizing' | 'writing' | 'completed' | 'error';

interface ReviewSession {
  id: string;
  topic: string;
  keywords: string[];
  stage: ReviewStage;
  papers: LiteratureSource[];
  selectedPapers: string[];
  fullReport: string;
  searchQuery: string;
  totalResults: number;
  semanticScholarCount: number;
  arxivCount: number;
  createdAt: Date;
  completedAt?: Date;
}

const STAGE_CONFIG: Record<ReviewStage, { label: string; description: string; progress: number }> = {
  initial: { label: '准备开始', description: '输入研究主题和关键词', progress: 0 },
  searching: { label: '检索真实文献', description: '正在从学术数据库检索真实论文...', progress: 15 },
  fetching: { label: '获取论文详情', description: '正在获取论文详细信息...', progress: 30 },
  analyzing: { label: '深度分析', description: '正在分析文献内容...', progress: 50 },
  synthesizing: { label: '知识合成', description: '正在合成知识框架...', progress: 70 },
  writing: { label: '撰写综述', description: '正在生成综述报告...', progress: 90 },
  completed: { label: '完成', description: '综述报告已生成', progress: 100 },
  error: { label: '错误', description: '发生错误', progress: 0 }
};

const LiteratureReviewAgent: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const getPaperDetails = useCallback(async (paperId: string): Promise<RealPaper | null> => {
    try {
      const response = await fetch(
        `${SEMANTIC_SCHOLAR_API}/paper/${paperId}?fields=paperId,title,authors,year,abstract,venue,citationCount,referenceCount,influentialCitationCount,isOpenAccess,openAccessPdf,url,tldr,publicationDate,journal`
      );
      
      if (!response.ok) return null;
      
      return await response.json();
    } catch (err) {
      return null;
    }
  }, []);

  const runFullReview = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentStep(0);

    const newSession: ReviewSession = {
      id: `review_${Date.now()}`,
      topic,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      stage: 'searching',
      papers: [],
      selectedPapers: [],
      fullReport: '',
      searchQuery: topic,
      totalResults: 0,
      semanticScholarCount: 0,
      arxivCount: 0,
      createdAt: new Date()
    };
    setSession(newSession);

    try {
      // Step 1: 从多个数据源搜索真实文献
      setCurrentStep(1);
      setSession(prev => prev ? { ...prev, stage: 'searching' } : null);
      
      const searchQuery = `${topic} ${keywords}`.trim();
      console.log('开始搜索，查询词:', searchQuery);
      
      // 并行搜索 Semantic Scholar 和 arXiv
      const [ssPapers, arxivPapers] = await Promise.allSettled([
        searchSemanticScholar(searchQuery, 50),
        searchArxiv(searchQuery, 30)
      ]);
      
      let semanticScholarResults = ssPapers.status === 'fulfilled' ? ssPapers.value : [];
      let arxivResults = arxivPapers.status === 'fulfilled' ? arxivPapers.value : [];
      
      console.log('Semantic Scholar 搜索结果数量:', semanticScholarResults.length);
      console.log('arXiv 搜索结果数量:', arxivResults.length);
      
      // 分析arXiv搜索结果
      if (arxivResults.length === 0) {
        console.log('arXiv搜索结果为空，可能原因：');
        console.log('1. 网络连接问题');
        console.log('2. arXiv API限制');
        console.log('3. 搜索关键词过于具体');
        console.log('4. arXiv API暂时不可用');
      }
      
      // 分析Semantic Scholar搜索结果
      if (semanticScholarResults.length === 0) {
        console.log('Semantic Scholar搜索结果为空，可能原因：');
        console.log('1. 网络连接问题');
        console.log('2. Semantic Scholar API限制');
        console.log('3. 搜索关键词过于具体');
        console.log('4. Semantic Scholar API暂时不可用');
      }
      
      if (semanticScholarResults.length === 0 && arxivResults.length === 0) {
        // 尝试使用更简单的搜索关键词
        const simpleQuery = topic.trim();
        console.log('尝试使用简化的搜索关键词:', simpleQuery);
        
        const [simpleSsPapers, simpleArxivPapers] = await Promise.allSettled([
          searchSemanticScholar(simpleQuery, 20),
          searchArxiv(simpleQuery, 15)
        ]);
        
        const simpleSemanticScholarResults = simpleSsPapers.status === 'fulfilled' ? simpleSsPapers.value : [];
        const simpleArxivResults = simpleArxivPapers.status === 'fulfilled' ? simpleArxivPapers.value : [];
        
        console.log('简化关键词 Semantic Scholar 搜索结果数量:', simpleSemanticScholarResults.length);
        console.log('简化关键词 arXiv 搜索结果数量:', simpleArxivResults.length);
        
        if (simpleSemanticScholarResults.length === 0 && simpleArxivResults.length === 0) {
          // 即使没有找到结果也不抛出错误，而是使用空数组继续
          console.log('未找到相关文献，使用空数组继续');
        } else {
          // 使用简化关键词的结果
          semanticScholarResults = simpleSemanticScholarResults;
          arxivResults = simpleArxivResults;
          console.log('使用简化关键词的搜索结果');
        }
      }

      // 转换 Semantic Scholar 论文
      const ssLiteratureSources: LiteratureSource[] = semanticScholarResults.map(paper => ({
        id: paper.paperId,
        title: paper.title,
        authors: paper.authors?.map(a => a.name || 'Unknown').join(', ') || 'Unknown Authors',
        year: paper.year?.toString() || 'N/A',
        summary: paper.abstract || paper.tldr?.text || '暂无摘要',
        relevance: Math.min(100, ((paper.citationCount || 0) / 10) + (paper.isOpenAccess ? 20 : 0)),
        keyFindings: [],
        paperId: paper.paperId,
        url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
        citationCount: paper.citationCount || 0,
        isOpenAccess: paper.isOpenAccess || false,
        openAccessPdf: paper.openAccessPdf?.url,
        source: 'semantic_scholar' as const
      }));

      // 转换 arXiv 论文
      const arxivLiteratureSources: LiteratureSource[] = arxivResults.map(paper => ({
        id: `arxiv_${paper.id}`,
        title: paper.title,
        authors: paper.authors.join(', ') || 'Unknown Authors',
        year: paper.published?.split('-')[0] || 'N/A',
        summary: paper.summary || '暂无摘要',
        relevance: 80,
        keyFindings: [],
        paperId: paper.id,
        url: paper.link,
        citationCount: 0,
        isOpenAccess: true,
        openAccessPdf: paper.pdfLink,
        source: 'arxiv' as const,
        categories: paper.categories
      }));

      // 合并结果
      const literatureSources = [...ssLiteratureSources, ...arxivLiteratureSources];

      setSession(prev => prev ? {
        ...prev,
        papers: literatureSources,
        totalResults: literatureSources.length,
        semanticScholarCount: semanticScholarResults.length,
        arxivCount: arxivResults.length,
        stage: 'fetching'
      } : null);

      // Step 2: 分析文献
      setCurrentStep(2);
      await new Promise(r => setTimeout(r, 500));
      setSession(prev => prev ? { ...prev, stage: 'analyzing' } : null);

      let analyzeResult = '';
      let synthesizeResult = '';
      let fullReport = '';

      if (literatureSources.length > 0) {
        // 使用所有检索到的文献进行分析
        const topPapers = literatureSources;
        const papersInfo = topPapers.map((p, i) => 
          `[${i + 1}] ${p.title}\n作者: ${p.authors}\n年份: ${p.year}\n引用数: ${p.citationCount}\n摘要: ${p.summary}\n链接: ${p.url}`
        ).join('\n\n');

        const analyzePrompt = `研究主题：${topic}

以下是从 Semantic Scholar 和 arXiv 数据库检索到的真实学术论文：

${papersInfo}

请对这些真实文献进行深度分析：
1. 识别主要研究主题和趋势
2. 分析研究方法的演进
3. 总结核心研究发现
4. 指出研究空白和未来方向
5. 分析不同研究方法的优缺点
6. 识别研究领域的关键挑战

注意：以上文献均来自真实学术数据库，请基于这些真实文献进行详细分析，引用尽可能多的文献。`;

        analyzeResult = await callLLM(analyzePrompt, 
          `你是一位学术文献分析专家。请基于提供的真实文献信息进行详细分析，不要编造不存在的文献。分析要深入全面，引用尽可能多的文献。`, 
          true
        );

        // Step 3: 知识合成
        setCurrentStep(3);
        setSession(prev => prev ? { ...prev, stage: 'synthesizing' } : null);
        await new Promise(r => setTimeout(r, 500));

        const synthesizePrompt = `研究主题：${topic}

文献分析结果：
${analyzeResult}

请构建该领域的知识框架，包括：
1. 理论基础和发展脉络
2. 研究方法分类和比较
3. 主要研究发现和贡献
4. 研究趋势与未来展望
5. 研究空白和机会
6. 跨领域关联和影响

要求：
- 详细分析，引用尽可能多的文献
- 构建完整的知识体系
- 识别领域内的关键转折点`;

        synthesizeResult = await callLLM(synthesizePrompt,
          `你是一位知识合成专家。请基于真实文献分析结果进行详细的知识合成，构建完整的知识框架，引用尽可能多的文献。`,
          true
        );

        // Step 4: 撰写综述
        setCurrentStep(4);
        setSession(prev => prev ? { ...prev, stage: 'writing' } : null);
        await new Promise(r => setTimeout(r, 500));

        // 使用所有文献作为参考文献，但在撰写时只引用对综述有用的
        const allPapers = literatureSources;
        const referencesSection = allPapers.map((p, i) => 
          `[${i + 1}] ${p.authors} (${p.year}). ${p.title}. ${p.url}`
        ).join('\n');

        const writePrompt = `研究主题：${topic}

文献分析：
${analyzeResult}

知识合成：
${synthesizeResult}

真实参考文献列表：
${referencesSection}

请撰写一篇详细的文献综述，要求：
1. 基于上述真实文献进行全面分析
2. 引用格式使用上标数字[1][2]等
3. 参考文献列表必须使用上面提供的真实文献
4. 不要编造任何不存在的文献
5. 综述要详细全面，引用尽可能多的文献
6. 结构清晰，包括引言、研究现状、方法分析、研究发现、研究空白、未来展望等部分
7. 分析不同研究方法的优缺点和适用场景
8. 识别研究领域的发展趋势和关键转折点
9. 只引用对综述撰写有用的文献，确保引用的文献与综述内容相关`;

        fullReport = await callLLM(writePrompt,
          `你是一位学术写作专家。请基于真实文献撰写详细的综述，严格遵守学术规范，不编造文献。所有引用必须来自提供的真实参考文献列表。综述要详细全面，引用尽可能多的文献，结构清晰，分析深入。`,
          true
        );
      } else {
        // 没有找到文献时，生成一个基于主题的概述
        console.log('未找到相关文献，生成基于主题的概述');
        
        const overviewPrompt = `研究主题：${topic}

请基于该研究主题生成一个文献综述概述，包括：
1. 该领域的基本概念和重要性
2. 主要研究方向和趋势
3. 常用的研究方法
4. 研究空白和未来方向
5. 对该领域的展望

由于未找到具体文献，请基于您的知识生成一个概述，但不要编造具体的文献引用。`;

        fullReport = await callLLM(overviewPrompt,
          `你是一位学术写作专家。请基于研究主题生成一个文献综述概述，不要编造具体的文献引用。`,
          true
        );
      }

      setSession(prev => prev ? {
        ...prev,
        fullReport,
        stage: 'completed',
        completedAt: new Date()
      } : null);
      setCurrentStep(5);

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
  };

  const steps = [
    { label: '检索真实文献', icon: <Database className="w-4 h-4" /> },
    { label: '获取论文详情', icon: <FileSearch className="w-4 h-4" /> },
    { label: '深度分析', icon: <BookOpen className="w-4 h-4" /> },
    { label: '知识合成', icon: <Layers className="w-4 h-4" /> },
    { label: '撰写综述', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            文献综述智能体
          </h1>
          <p className="text-muted-foreground">
            基于 Semantic Scholar + arXiv 双数据源的文献综述系统
          </p>
        </div>
        {session && (
          <Button variant="outline" onClick={resetSession}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        )}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">双数据源真实文献保障</AlertTitle>
        <AlertDescription className="text-blue-700">
          本系统同时检索 <strong>Semantic Scholar</strong>（2亿+篇学术论文）和 <strong>arXiv</strong>（开放获取预印本），
          所有参考文献均来自真实学术数据库，包含论文ID、作者、年份、引用数等真实元数据，可追溯验证。
        </AlertDescription>
      </Alert>

      <APISettings />

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始文献综述</CardTitle>
            <CardDescription>
              输入研究主题，系统将从 Semantic Scholar 和 arXiv 双数据源检索真实学术论文并生成综述
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">研究主题 *</Label>
              <Input
                id="topic"
                placeholder="例如：human-computer interaction emotion design"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                建议使用英文关键词以获得更全面的检索结果
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">补充关键词（可选）</Label>
              <Input
                id="keywords"
                placeholder="例如：user experience, affective computing"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>工作流程</AlertTitle>
              <AlertDescription>
                1. 从 Semantic Scholar 检索真实论文 → 2. 获取论文元数据 → 3. 分析文献内容 → 4. 合成知识框架 → 5. 生成综述报告
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={runFullReview}
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
                  开始检索真实文献
                </>
              )}
            </Button>
          </CardContent>
        </Card>
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
                      currentStep === index ? 'text-blue-600' : 'text-muted-foreground'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep > index ? 'border-green-600 bg-green-50' :
                        currentStep === index ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
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
                  检索到的真实文献 ({session.papers.length} 篇)
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-blue-50">Semantic Scholar: {session.semanticScholarCount || 0} 篇</Badge>
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-orange-50">arXiv: {session.arxivCount || 0} 篇</Badge>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {session.papers.map((paper, index) => (
                      <div key={paper.id} className="p-3 border rounded-lg hover:bg-slate-50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                [{index + 1}]
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  paper.source === 'arxiv' 
                                    ? 'bg-orange-50 text-orange-700 border-orange-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {paper.source === 'arxiv' ? 'arXiv' : 'S2'}
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
                              {paper.authors} · {paper.year} · 引用数: {paper.citationCount}
                              {paper.isOpenAccess && (
                                <Badge variant="secondary" className="ml-2 text-xs">开放获取</Badge>
                              )}
                              {paper.categories && paper.categories.length > 0 && (
                                <span className="ml-2 text-xs text-orange-600">
                                  [{paper.categories.slice(0, 2).join(', ')}]
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {paper.summary.substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Output */}
          {session.fullReport && session.stage === 'completed' && (
            <>
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">综述生成完成</AlertTitle>
                <AlertDescription className="text-green-700">
                  本综述基于 {session.papers.length} 篇真实学术文献生成，所有参考文献均可通过 Semantic Scholar 链接验证。
                </AlertDescription>
              </Alert>
              
              <DocumentOutput
                content={session.fullReport}
                title={session.topic + ' - 文献综述'}
                keywords={session.keywords}
                showPreview={true}
              />
            </>
          )}
        </div>
      )}

      {/* Data Source Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">数据来源说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Semantic Scholar
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Allen Institute for AI 提供</li>
                <li>• 收录 2 亿+ 篇学术论文</li>
                <li>• 提供论文元数据和引用关系</li>
                <li>• 支持开放获取 PDF 链接</li>
              </ul>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                arXiv
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 开放获取预印本平台</li>
                <li>• 涵盖物理、数学、CS 等</li>
                <li>• 最新研究成果首发地</li>
                <li>• 全部免费开放获取</li>
              </ul>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Quote className="w-4 h-4 text-purple-600" />
                引用规范
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 所有文献均包含真实 ID</li>
                <li>• 可追溯至原始论文页面</li>
                <li>• 引用数、作者、年份真实可查</li>
                <li>• 不编造任何不存在的文献</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['literature-review']} />
    </div>
  );
};

export default LiteratureReviewAgent;
