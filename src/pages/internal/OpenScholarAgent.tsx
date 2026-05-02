import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Database, Search, Send, Loader2, Copy, Check,
  FileText, Layers, Sparkles, Play, ExternalLink,
  AlertCircle, RefreshCw, Quote, BookOpen, Link2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import { 
  API_CONFIG, 
  SEMANTIC_SCHOLAR_API, 
  ARXIV_API,
  searchArxiv,
  searchSemanticScholar,
  searchAllSources,
  ArxivPaper,
  SemanticScholarPaper,
  callLLM
} from '@/config/api';
import APISettings from '@/components/APISettings';
import LiteratureSearchResults from '@/components/LiteratureSearchResults';

interface Author {
  name: string;
  authorId?: string;
  affiliation?: string[];
}

interface Paper {
  paperId: string;
  title: string;
  authors: Author[];
  year: number | null;
  abstract: string;
  venue: string;
  citationCount: number;
  isOpenAccess: boolean;
  openAccessPdf?: string;
  url: string;
  tldr?: string;
}

interface CitationChain {
  paper: Paper;
  relatedPapers: Paper[];
  synthesis: string;
}

interface OpenScholarSession {
  id: string;
  query: string;
  papers: Paper[];
  citationChains: CitationChain[];
  synthesis: string;
  stage: 'initial' | 'searching' | 'building_chains' | 'synthesizing' | 'completed' | 'error';
}

const OpenScholarAgent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [session, setSession] = useState<OpenScholarSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const searchPapers = useCallback(async (searchQuery: string, limit: number = 15): Promise<Paper[]> => {
    try {
      // 使用更新后的 searchSemanticScholar 函数
      const papers = await searchSemanticScholar(searchQuery, limit);
      
      // 即使结果少也不抛出错误
      if (papers.length === 0) {
        console.log('OpenScholar: 未找到相关论文，尝试使用简化查询');
        // 尝试使用更简单的查询
        const simpleQuery = searchQuery.split(/\s+/).slice(0, 5).join(' ');
        const simplePapers = await searchSemanticScholar(simpleQuery, limit);
        if (simplePapers.length > 0) {
          console.log('OpenScholar: 简化查询找到论文:', simplePapers.length, '篇');
          return simplePapers;
        }
      }
      
      return papers;
    } catch (error) {
      console.error('OpenScholar 搜索错误:', error);
      // 即使出错也返回空数组，避免整个流程失败
      return [];
    }
  }, []);

  const getRelatedPapers = useCallback(async (paperId: string): Promise<Paper[]> => {
    try {
      const response = await fetch(
        `${SEMANTIC_SCHOLAR_API}/paper/${paperId}/related_papers?limit=5&fields=paperId,title,authors,year,abstract,venue,citationCount,isOpenAccess,openAccessPdf,url,tldr`
      );
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.relatedPapers || [];
    } catch {
      return [];
    }
  }, []);



  const runOpenScholar = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);

    const newSession: OpenScholarSession = {
      id: `os_${Date.now()}`,
      query,
      papers: [],
      citationChains: [],
      synthesis: '',
      stage: 'searching'
    };
    setSession(newSession);

    try {
      // Step 1: 搜索论文
      setCurrentStep(1);
      const papers = await searchPapers(query, 15);
      
      // 即使没有找到论文也不抛出错误，而是使用空数组继续
      if (papers.length === 0) {
        console.log('OpenScholar: 未找到相关文献，使用空数组继续');
      }

      setSession(prev => prev ? { ...prev, papers, stage: 'building_chains' } : null);

      // Step 2: 构建引用链
      setCurrentStep(2);
      const citationChains: CitationChain[] = [];

      // 只处理有论文的情况
      if (papers.length > 0) {
        for (const paper of papers.slice(0, 5)) {
          try {
            const relatedPapers = await getRelatedPapers(paper.paperId);
            
            const chainPrompt = `请分析以下论文及其相关论文，生成引用链分析：

主论文：
标题：${paper.title}
作者：${paper.authors?.map(a => a.name).join(', ')}
摘要：${paper.abstract || paper.tldr?.text || '无摘要'}

相关论文：
${relatedPapers.map((rp, i) => `[${i + 1}] ${rp.title}`).join('\n')}

请说明这些论文之间的学术关联。`;

            const synthesis = await callLLM(chainPrompt, 
              '你是一位学术引用分析专家，擅长分析论文之间的引用关系和学术脉络。');

            citationChains.push({ paper, relatedPapers, synthesis });
            setSession(prev => prev ? { ...prev, citationChains: [...citationChains] } : null);
          } catch (error) {
            console.error('构建引用链时出错:', error);
            // 继续处理下一篇论文
            continue;
          }
        }
      }

      // Step 3: 综合分析
      setCurrentStep(3);
      setSession(prev => prev ? { ...prev, stage: 'synthesizing' } : null);

      const allPapersInfo = papers.slice(0, 10).map((p, i) => 
        `[${i + 1}] ${p.title}\n作者: ${p.authors?.map(a => a.name).join(', ')}\n年份: ${p.year}\n引用数: ${p.citationCount}\n来源: ${p.url}`
      ).join('\n\n');

      const synthesisPrompt = `请基于以下真实学术论文生成学术综述回复：

研究问题：${query}

论文列表：
${allPapersInfo}

引用链分析：
${citationChains.map(c => c.synthesis).join('\n\n')}

要求：
1. 回答研究问题
2. 引用具体论文支持观点
3. 使用[1][2]等引用标记
4. 列出参考文献`;

      const synthesis = await callLLM(synthesisPrompt,
        '你是一位学术研究助手，擅长基于真实文献生成严谨的学术回复。所有引用必须来自提供的真实论文列表。',
        true);

      setSession(prev => prev ? {
        ...prev,
        synthesis,
        stage: 'completed'
      } : null);
      setCurrentStep(4);

    } catch (err: any) {
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setQuery('');
    setCurrentStep(0);
  };

  const steps = [
    { label: '检索论文', icon: <Search className="w-4 h-4" /> },
    { label: '构建引用链', icon: <Link2 className="w-4 h-4" /> },
    { label: '综合分析', icon: <Layers className="w-4 h-4" /> },
    { label: '生成回复', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-7 h-7 text-purple-600" />
            OpenScholar 智能体
          </h1>
          <p className="text-muted-foreground">
            Allen AI 研究所 - 2亿+论文检索增强生成（RAG）系统
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

      <Alert className="bg-purple-50 border-purple-200">
        <Quote className="h-4 w-4 text-purple-600" />
        <AlertTitle className="text-purple-800">OpenScholar 方法</AlertTitle>
        <AlertDescription className="text-purple-700">
          连接 Semantic Scholar 2亿+学术论文数据库，通过构建引用链（Citation Chain）
          确保每个论点都有真实文献支撑，极大降低"幻觉"率。
        </AlertDescription>
      </Alert>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>学术问答</CardTitle>
            <CardDescription>
              输入研究问题，系统将检索真实论文并生成带引用的学术回复
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">研究问题 *</Label>
              <Textarea
                id="query"
                placeholder="例如：What are the main challenges in human-AI collaboration for creative design?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                建议使用英文提问以获得更全面的检索结果
              </p>
            </div>
            
            <Button
              onClick={runOpenScholar}
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
                  开始检索分析
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex flex-col items-center ${
                      currentStep > index ? 'text-green-600' :
                      currentStep === index ? 'text-purple-600' : 'text-muted-foreground'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep > index ? 'border-green-600 bg-green-50' :
                        currentStep === index ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
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

          {session.stage !== 'completed' && session.stage !== 'error' && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>正在处理...</span>
            </div>
          )}

          {session.papers.length > 0 && (
            <LiteratureSearchResults 
              papers={session.papers as any} 
              title="检索到的论文" 
              description="从Semantic Scholar检索到的相关学术文献"
            />
          )}

          {session.citationChains.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  引用链分析 ({session.citationChains.length} 条)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {session.citationChains.map((chain, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm font-medium mb-1">{chain.paper.title}</p>
                        <p className="text-xs text-muted-foreground">
                          相关论文: {chain.relatedPapers.length} 篇
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {session.synthesis && session.stage === 'completed' && (
            <DocumentOutput
              content={session.synthesis}
              title="OpenScholar 学术回复"
              showPreview={true}
            />
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">OpenScholar 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">2亿+ 论文库</h4>
              <p className="text-sm text-purple-600">连接 Semantic Scholar 海量学术数据库</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">引用链构建</h4>
              <p className="text-sm text-blue-600">分析论文间的引用关系，确保论点有据可查</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-1">低幻觉率</h4>
              <p className="text-sm text-green-600">基于真实文献生成回复，大幅降低编造风险</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['openscholar']} />
    </div>
  );
};

export default OpenScholarAgent;
