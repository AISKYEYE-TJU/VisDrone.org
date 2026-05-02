import React, { useState, useEffect } from 'react';
import {
  Search, AlertCircle, BarChart2, FileText, RefreshCw, Play, Loader2,
  ExternalLink, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LiteratureRetrieval, LiteratureSearchOptions } from '@/lib/literature-retrieval';

interface AgentTestResult {
  agent: string;
  query: string;
  success: boolean;
  error?: string;
  results: Array<{title: string; authors?: Array<{name: string} | string>; year?: number | null; citationCount?: number; url?: string; paperId?: string}>;
  semanticScholarCount: number;
  arxivCount: number;
  responseTime: number;
  timestamp: Date;
}

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  dataSources: string[];
  defaultQuery: string;
  expectedResults: number;
}

const AGENTS: AgentConfig[] = [
  {
    id: 'literature-review',
    name: '文献综述智能体',
    description: '基于 Semantic Scholar + arXiv 双数据源的文献综述系统',
    dataSources: ['Semantic Scholar (50篇)', 'arXiv (30篇)'],
    defaultQuery: 'human-computer interaction emotion design',
    expectedResults: 80
  },
  {
    id: 'gpt-researcher',
    name: 'GPT Researcher 智能体',
    description: '多源信息采集与深度研究报告生成系统',
    dataSources: ['Semantic Scholar (10篇)', 'arXiv (8篇)'],
    defaultQuery: '大语言模型在教育领域的应用现状与挑战',
    expectedResults: 18
  },
  {
    id: 'open-scholar',
    name: 'OpenScholar 智能体',
    description: 'Allen AI 研究所 - 2亿+论文检索增强生成（RAG）系统',
    dataSources: ['Semantic Scholar (15篇)'],
    defaultQuery: 'What are the main challenges in human-AI collaboration for creative design?',
    expectedResults: 15
  },
  {
    id: 'surveyx',
    name: 'SurveyX 智能体',
    description: '学术综述论文生成系统 - 双层语义过滤 + LaTeX 输出',
    dataSources: ['Semantic Scholar (30篇)'],
    defaultQuery: 'A Survey on Human-AI Collaboration in Design',
    expectedResults: 30
  },
  {
    id: 'ai-scientist',
    name: 'AI Scientist 智能体',
    description: 'SakanaAI 自动化科研系统 - 从想法发现到论文完成的端到端研究流程',
    dataSources: ['Semantic Scholar (15篇)', 'arXiv (10篇)'],
    defaultQuery: '基于大语言模型的多智能体协作',
    expectedResults: 25
  },
  {
    id: 'asreview',
    name: 'ASReview 智能体',
    description: '主动学习系统性文献综述 - 高效筛选大量学术文献',
    dataSources: ['Semantic Scholar (50篇)'],
    defaultQuery: '人工智能在医疗诊断中的应用',
    expectedResults: 50
  }
];

const LiteratureRetrievalTestPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0].id);
  const [query, setQuery] = useState(AGENTS[0].defaultQuery);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<AgentTestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<Partial<AgentTestResult> | null>(null);

  const getAgentConfig = (agentId: string) => AGENTS.find(a => a.id === agentId) || AGENTS[0];

  useEffect(() => {
    const config = getAgentConfig(selectedAgent);
    setQuery(config.defaultQuery);
  }, [selectedAgent]);

  const testAgent = async () => {
    if (!query.trim()) return;

    setIsTesting(true);
    setCurrentTest({
      agent: getAgentConfig(selectedAgent).name,
      query,
      success: false,
      results: [],
      semanticScholarCount: 0,
      arxivCount: 0,
      responseTime: 0,
      timestamp: new Date()
    });

    try {
      const config = getAgentConfig(selectedAgent);
      let searchOptions: LiteratureSearchOptions = {
        query,
        sources: []
      };

      // 根据智能体配置设置搜索选项
      switch (selectedAgent) {
        case 'literature-review':
          searchOptions = {
            query,
            sources: ['semanticScholar', 'arxiv'],
            limits: { semanticScholar: 50, arxiv: 30 }
          };
          break;
        case 'gpt-researcher':
          searchOptions = {
            query,
            sources: ['semanticScholar', 'arxiv'],
            limits: { semanticScholar: 10, arxiv: 8 }
          };
          break;
        case 'open-scholar':
          searchOptions = {
            query,
            sources: ['semanticScholar'],
            limits: { semanticScholar: 15 }
          };
          break;
        case 'surveyx':
          searchOptions = {
            query,
            sources: ['semanticScholar'],
            limits: { semanticScholar: 30 }
          };
          break;
        case 'ai-scientist':
          searchOptions = {
            query,
            sources: ['semanticScholar', 'arxiv'],
            limits: { semanticScholar: 15, arxiv: 10 }
          };
          break;
        case 'asreview':
          searchOptions = {
            query,
            sources: ['semanticScholar'],
            limits: { semanticScholar: 50 }
          };
          break;
      }

      // 使用LiteratureRetrieval模块执行搜索
      const searchResult = await LiteratureRetrieval.search(searchOptions);
      
      // 按引用数排序结果
      const sortedResult = LiteratureRetrieval.sortByCitations(searchResult);

      const result: AgentTestResult = {
        agent: config.name,
        query,
        success: true,
        results: [...sortedResult.semanticScholar, ...sortedResult.arxiv],
        semanticScholarCount: sortedResult.semanticScholar.length,
        arxivCount: sortedResult.arxiv.length,
        responseTime: sortedResult.responseTime,
        timestamp: sortedResult.timestamp
      };

      setCurrentTest(result);
      setTestResults(prev => [result, ...prev]);

    } catch (error) {
      const result: AgentTestResult = {
        agent: getAgentConfig(selectedAgent).name,
        query,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        results: [],
        semanticScholarCount: 0,
        arxivCount: 0,
        responseTime: 0,
        timestamp: new Date()
      };

      setCurrentTest(result);
      setTestResults(prev => [result, ...prev]);
    } finally {
      setIsTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setCurrentTest(null);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-7 h-7 text-blue-600" />
            文献检索测试平台
          </h1>
          <p className="text-muted-foreground">
            测试各智能体的文献检索能力和结果分析
          </p>
        </div>
        <Button variant="outline" onClick={clearResults}>
          <RefreshCw className="w-4 h-4 mr-2" />
          清空结果
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>测试配置</CardTitle>
          <CardDescription>
            选择智能体和查询词进行测试
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent">智能体</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="选择智能体" />
              </SelectTrigger>
              <SelectContent>
                {AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div>
                      <span className="font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{agent.description.substring(0, 30)}...</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="query">查询词</Label>
            <Textarea
              id="query"
              placeholder="输入搜索查询词"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>数据源</Label>
            <div className="flex flex-wrap gap-2">
              {getAgentConfig(selectedAgent).dataSources.map((source, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50">
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={testAgent}
            disabled={!query.trim() || isTesting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                测试中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                开始测试
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {currentTest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              当前测试结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">智能体</h4>
                  <p className="text-sm">{currentTest.agent}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">查询词</h4>
                  <p className="text-sm truncate">{currentTest.query}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">状态</h4>
                  <p className={`text-sm ${currentTest.success ? 'text-green-600' : 'text-red-600'}`}>
                    {currentTest.success ? '成功' : '失败'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Semantic Scholar</h4>
                  <p className="text-sm">{currentTest.semanticScholarCount} 篇</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">arXiv</h4>
                  <p className="text-sm">{currentTest.arxivCount} 篇</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">响应时间</h4>
                  <p className="text-sm">{currentTest.responseTime} ms</p>
                </div>
              </div>

              {!currentTest.success && currentTest.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>{currentTest.error}</AlertDescription>
                </Alert>
              )}

              {currentTest.results && currentTest.results.length > 0 && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">检索摘要</h4>
                    <p className="text-sm text-blue-700">
                      {(() => {
                        // 构造临时的LiteratureSearchResult对象来生成摘要
                        const tempResult = {
                          query: currentTest.query || '',
                          semanticScholar: currentTest.results.filter((p) => p.paperId),
                          arxiv: currentTest.results.filter((p) => !p.paperId),
                          totalResults: currentTest.results.length,
                          responseTime: currentTest.responseTime || 0,
                          timestamp: currentTest.timestamp
                        };
                        return LiteratureRetrieval.generateSummary(tempResult);
                      })()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">检索结果</h4>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {currentTest.results.slice(0, 10).map((paper, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{paper.title}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {paper.authors?.map((a) => typeof a === 'object' && 'name' in a ? a.name : a).join(', ')}
                                  {paper.year && ` · ${paper.year}`}
                                  {paper.citationCount && ` · 引用: ${paper.citationCount}`}
                                </p>
                                {paper.url && (
                                  <a 
                                    href={paper.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    查看原文
                                  </a>
                                )}
                              </div>
                              <Badge variant="outline" className={paper.paperId ? 'bg-blue-50' : 'bg-orange-50'}>
                                {paper.paperId ? 'S2' : 'arXiv'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              测试历史
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-medium">{result.agent}</h4>
                        <p className="text-sm text-muted-foreground">{result.query}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.success ? '成功' : '失败'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {result.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Semantic Scholar:</span> {result.semanticScholarCount} 篇
                      </div>
                      <div>
                        <span className="font-medium">arXiv:</span> {result.arxivCount} 篇
                      </div>
                      <div>
                        <span className="font-medium">总结果:</span> {result.results.length} 篇
                      </div>
                      <div>
                        <span className="font-medium">响应时间:</span> {result.responseTime} ms
                      </div>
                    </div>
                    {!result.success && result.error && (
                      <div className="mt-2 text-sm text-red-600">
                        错误: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">智能体文献检索分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-1">成功因素</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• 网络连接稳定</li>
                  <li>• API服务可用</li>
                  <li>• 搜索关键词适当</li>
                  <li>• 符合API调用限制</li>
                  <li>• 数据源有相关文献</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-700 mb-1">失败原因</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• 网络连接问题</li>
                  <li>• API速率限制</li>
                  <li>• 搜索关键词过于具体</li>
                  <li>• API暂时不可用</li>
                  <li>• 跨域访问限制</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-700 mb-1">优化建议</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• 使用更通用的关键词</li>
                  <li>• 实现API调用速率控制</li>
                  <li>• 添加备用数据源</li>
                  <li>• 实现错误重试机制</li>
                  <li>• 优化搜索策略</li>
                </ul>
              </div>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <Zap className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">测试注意事项</AlertTitle>
              <AlertDescription className="text-amber-700">
                • 连续测试可能触发API速率限制<br />
                • 网络状况会影响响应时间<br />
                • 不同时间段的API性能可能不同<br />
                • 搜索结果数量会因关键词而异
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiteratureRetrievalTestPage;