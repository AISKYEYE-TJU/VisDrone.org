import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical, Lightbulb, Code, FileText, RefreshCw,
  Play, Loader2, Check, AlertCircle, Sparkles,
  GitBranch, TestTube, BookOpen, Target, Settings,
  ChevronRight, Download, Copy, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import APISettings from '@/components/APISettings';
import { API_CONFIG, searchSemanticScholar, searchArxiv, SemanticScholarPaper, ArxivPaper, callLLM } from '@/config/api';

type AIScientistV2Stage = 'initial' | 'hypothesis' | 'literature' | 'experiment' | 'analysis' | 'manuscript' | 'completed' | 'error';

interface Hypothesis {
  id: string;
  title: string;
  description: string;
  predictions: string[];
  rationale: string;
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  methodology: string;
  expectedResults: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface Analysis {
  id: string;
  experimentId: string;
  results: string;
  interpretation: string;
  conclusion: string;
  supportsHypothesis: boolean;
}

interface Manuscript {
  title: string;
  abstract: string;
  introduction: string;
  methodology: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string;
}

interface AIScientistV2Session {
  id: string;
  researchTopic: string;
  stage: AIScientistV2Stage;
  hypothesis: Hypothesis | null;
  literature: (SemanticScholarPaper | ArxivPaper)[];
  experiments: Experiment[];
  analyses: Analysis[];
  manuscript: Manuscript | null;
  createdAt: Date;
}

const STAGE_CONFIG: Record<AIScientistV2Stage, { label: string; description: string }> = {
  initial: { label: '准备开始', description: '输入研究主题' },
  hypothesis: { label: '假设生成', description: '正在生成研究假设...' },
  literature: { label: '文献调研', description: '正在检索相关文献...' },
  experiment: { label: '实验设计', description: '正在设计实验方案...' },
  analysis: { label: '结果分析', description: '正在分析实验结果...' },
  manuscript: { label: '论文撰写', description: '正在撰写论文...' },
  completed: { label: '完成', description: '研究完成' },
  error: { label: '错误', description: '发生错误' }
};

const RESEARCH_DOMAINS = [
  { value: 'machine-learning', label: '机器学习' },
  { value: 'natural-language-processing', label: '自然语言处理' },
  { value: 'computer-vision', label: '计算机视觉' },
  { value: 'reinforcement-learning', label: '强化学习' },
  { value: 'human-computer-interaction', label: '人机交互' },
  { value: 'ai-for-science', label: 'AI for Science' },
  { value: 'generative-ai', label: '生成式AI' },
  { value: 'multi-agent-systems', label: '多智能体系统' }
];

const AIScientistV2Agent: React.FC = () => {
  const [researchTopic, setResearchTopic] = useState('');
  const [domain, setDomain] = useState('machine-learning');
  const [session, setSession] = useState<AIScientistV2Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

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



  const runAIScientistV2 = async () => {
    if (!researchTopic.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);
    setLogs([]);
    setReasoningSteps([]);

    const newSession: AIScientistV2Session = {
      id: `aiscientistv2_${Date.now()}`,
      researchTopic,
      stage: 'hypothesis',
      hypothesis: null,
      literature: [],
      experiments: [],
      analyses: [],
      manuscript: null,
      createdAt: new Date()
    };
    setSession(newSession);
    addLog('开始 AI Scientist v2 研究流程');

    try {
      // Stage 1: 假设生成
      setCurrentStep(1);
      addLog('正在生成研究假设...');
      
      const hypothesisPrompt = `你是一位理论科学家。请针对以下研究主题，生成一个科学假设：

研究主题：${researchTopic}
研究领域：${domain}

请提供：
1. 假设标题（简洁明了）
2. 假设描述（详细说明）
3. 可验证的预测（3-5个）
4. 假设的理论基础

请以JSON格式输出：
{
  "title": "假设标题",
  "description": "假设描述",
  "predictions": ["预测1", "预测2"],
  "rationale": "理论基础"
}`;

      const hypothesisResult = await callLLM(hypothesisPrompt, 
        '你是一位理论科学家，擅长生成可验证的科学假设。请用JSON格式输出。');
      
      let hypothesis: Hypothesis;
      try {
        const jsonMatch = hypothesisResult.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : hypothesisResult);
        hypothesis = {
          id: `hypothesis_${Date.now()}`,
          ...parsed
        };
      } catch {
        hypothesis = {
          id: `hypothesis_${Date.now()}`,
          title: `${researchTopic}的研究假设`,
          description: hypothesisResult.substring(0, 300),
          predictions: ['预测1', '预测2', '预测3'],
          rationale: '基于现有理论和研究'
        };
      }
      
      setSession(prev => prev ? { ...prev, hypothesis, stage: 'literature' } : null);
      addLog(`假设已生成: ${hypothesis.title}`);

      // Stage 2: 文献调研
      setCurrentStep(2);
      addLog('正在检索相关文献...');
      
      const literatureResults = await searchSemanticScholar(researchTopic, 15);
      const arxivResults = await searchArxiv(researchTopic, 10);
      
      const allPapers = [...literatureResults, ...arxivResults];
      setSession(prev => prev ? { ...prev, literature: allPapers, stage: 'experiment' } : null);
      addLog(`检索到 ${allPapers.length} 篇相关文献`);

      // Stage 3: 实验设计
      setCurrentStep(3);
      addLog('正在设计实验方案...');
      
      const experimentPrompt = `基于以下假设，设计验证实验：

假设标题：${hypothesis.title}
假设描述：${hypothesis.description}
预测：${hypothesis.predictions.join('; ')}

请设计一个详细的实验方案，包括：
1. 实验名称
2. 实验目的
3. 实验方法
4. 预期结果
5. 实验步骤

请以JSON格式输出：
{
  "name": "实验名称",
  "description": "实验目的和描述",
  "methodology": "实验方法",
  "expectedResults": "预期结果"
}`;

      const experimentResult = await callLLM(experimentPrompt, 
        '你是一位实验设计专家，擅长设计严谨的科学实验。');
      
      let experiment: Experiment;
      try {
        const jsonMatch = experimentResult.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : experimentResult);
        experiment = {
          id: `exp_${Date.now()}`,
          ...parsed,
          status: 'completed'
        };
      } catch {
        experiment = {
          id: `exp_${Date.now()}`,
          name: `${hypothesis.title}验证实验`,
          description: `验证${hypothesis.title}的实验`,
          methodology: '实验方法',
          expectedResults: '预期结果',
          status: 'completed'
        };
      }
      
      setSession(prev => prev ? { ...prev, experiments: [experiment], stage: 'analysis' } : null);
      addLog(`实验已设计: ${experiment.name}`);

      // Stage 4: 结果分析
      setCurrentStep(4);
      addLog('正在分析实验结果...');
      
      const analysisPrompt = `请分析以下实验结果，验证假设：

假设：${hypothesis.title}
预测：${hypothesis.predictions.join('; ')}

实验：${experiment.name}
实验方法：${experiment.methodology}

请提供：
1. 模拟实验结果
2. 结果解释
3. 对假设的验证结论
4. 可能的改进方向`;

      const analysisResult = await callLLM(analysisPrompt, 
        '你是一位数据分析专家，擅长解释实验结果。');
      
      const analysis: Analysis = {
        id: `analysis_${Date.now()}`,
        experimentId: experiment.id,
        results: analysisResult.substring(0, 500),
        interpretation: analysisResult.substring(500, 1000),
        conclusion: analysisResult.substring(1000),
        supportsHypothesis: true
      };
      
      setSession(prev => prev ? { ...prev, analyses: [analysis], stage: 'manuscript' } : null);
      addLog('结果分析完成');

      // Stage 5: 论文撰写
      setCurrentStep(5);
      addLog('正在撰写论文...');
      
      const manuscriptPrompt = `请撰写一篇完整的学术论文，基于以下信息：

研究主题：${researchTopic}
假设：${hypothesis.title}
实验：${experiment.name}
分析结果：${analysis.conclusion}

相关文献：
${allPapers.slice(0, 10).map((p, i) => `[${i+1}] ${p.title}`).join('\n')}

请按以下结构撰写论文：
1. 摘要（Abstract）
2. 引言（Introduction）
3. 相关工作（Related Work）
4. 假设与方法（Hypothesis and Methodology）
5. 实验设计（Experimental Design）
6. 结果与分析（Results and Analysis）
7. 讨论（Discussion）
8. 结论（Conclusion）
9. 参考文献（References）

请使用学术写作风格，内容详实。`;

      const manuscriptContent = await callLLM(manuscriptPrompt, 
        '你是一位学术论文写作专家，擅长撰写高质量的学术论文。', true);
      
      const manuscript: Manuscript = {
        title: hypothesis.title,
        abstract: manuscriptContent.split('\n\n')[1] || '',
        introduction: manuscriptContent.split('\n\n')[2] || '',
        methodology: manuscriptContent.split('\n\n')[4] || '',
        results: manuscriptContent.split('\n\n')[6] || '',
        discussion: manuscriptContent.split('\n\n')[7] || '',
        conclusion: manuscriptContent.split('\n\n')[8] || '',
        references: allPapers.slice(0, 15).map((p, i) => 
          `[${i+1}] ${p.title} - ${'authors' in p ? p.authors.join(', ') : 'Authors'}`
        ).join('\n')
      };
      
      setSession(prev => prev ? { ...prev, manuscript, stage: 'completed' } : null);
      setCurrentStep(6);
      addLog('论文撰写完成，研究流程结束');

    } catch (err: any) {
      addLog(`错误: ${err.message}`);
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setResearchTopic('');
    setCurrentStep(0);
    setLogs([]);
    setReasoningSteps([]);
  };

  const steps = [
    { label: '假设生成', icon: <Lightbulb className="w-4 h-4" /> },
    { label: '文献调研', icon: <BookOpen className="w-4 h-4" /> },
    { label: '实验设计', icon: <TestTube className="w-4 h-4" /> },
    { label: '结果分析', icon: <Code className="w-4 h-4" /> },
    { label: '论文撰写', icon: <FileText className="w-4 h-4" /> }
  ];

  const fullManuscriptContent = session?.manuscript ? `
# ${session.manuscript.title}

## 摘要
${session.manuscript.abstract}

## 引言
${session.manuscript.introduction}

## 相关工作

## 假设与方法
${session.manuscript.methodology}

## 实验设计

## 结果与分析
${session.manuscript.results}

## 讨论
${session.manuscript.discussion}

## 结论
${session.manuscript.conclusion}

## 参考文献
${session.manuscript.references}
` : '';

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-purple-600" />
            AI Scientist v2 智能体
          </h1>
          <p className="text-muted-foreground">
            端到端智能体系统：假设→实验→分析→论文；首个AI撰写的被接受论文
          </p>
        </div>
        {session && (
          <Button variant="outline" onClick={resetSession}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        )}
      </div>

      <Alert className="bg-purple-50 border-purple-200">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <AlertTitle className="text-purple-800">AI Scientist v2 方法论</AlertTitle>
        <AlertDescription className="text-purple-700">
          端到端研究流程：假设生成 → 文献调研 → 实验设计 → 结果分析 → 论文撰写
        </AlertDescription>
      </Alert>

      <APISettings />

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始自动化研究</CardTitle>
            <CardDescription>
              输入研究主题，系统将自动完成从假设到论文的全流程
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">研究领域</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择研究领域" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESEARCH_DOMAINS.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="researchTopic">研究主题 *</Label>
                <Input
                  id="researchTopic"
                  placeholder="例如：基于大语言模型的多智能体协作"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: <Lightbulb className="w-4 h-4" />, label: '假设生成', desc: '自动生成科学假设' },
                { icon: <BookOpen className="w-4 h-4" />, label: '文献调研', desc: '检索相关学术文献' },
                { icon: <TestTube className="w-4 h-4" />, label: '实验设计', desc: '设计验证实验' },
                { icon: <Code className="w-4 h-4" />, label: '结果分析', desc: '分析实验结果' },
                { icon: <FileText className="w-4 h-4" />, label: '论文撰写', desc: '自动撰写论文' }
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
              onClick={runAIScientistV2}
              disabled={!researchTopic.trim() || isLoading}
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
                  开始自动化研究
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
                      <div className={`w-8 h-0.5 mx-1 ${
                        currentStep > index ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {session.hypothesis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  研究假设
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-2">{session.hypothesis.title}</h3>
                <p className="text-muted-foreground mb-3">{session.hypothesis.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">预测：</span>
                    <ul className="text-sm text-muted-foreground mt-1">
                      {session.hypothesis.predictions.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">理论基础：</span>
                    <p className="text-sm text-muted-foreground mt-1">{session.hypothesis.rationale}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {session.literature.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  相关文献 ({session.literature.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {session.literature.slice(0, 15).map((paper, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded text-sm">
                        <div className="font-medium">{paper.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {'authors' in paper ? paper.authors.slice(0, 3).join(', ') : 'Authors'}
                          {'year' in paper && paper.year ? ` (${paper.year})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {session.experiments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-green-500" />
                  实验设计 ({session.experiments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.experiments.map((exp) => (
                    <div key={exp.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{exp.name}</span>
                        <Badge variant={exp.status === 'completed' ? 'default' : 'secondary'}>
                          {exp.status === 'completed' ? '已完成' : exp.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{exp.description}</p>
                      <div className="text-sm">
                        <div className="font-medium">实验方法：</div>
                        <p className="text-muted-foreground">{exp.methodology}</p>
                      </div>
                      <div className="text-sm mt-2">
                        <div className="font-medium">预期结果：</div>
                        <p className="text-muted-foreground">{exp.expectedResults}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {session.analyses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500" />
                  结果分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session.analyses.map((analysis) => (
                  <div key={analysis.id} className="space-y-3">
                    <div>
                      <span className="font-medium">实验结果：</span>
                      <p className="text-sm text-muted-foreground mt-1">{analysis.results}</p>
                    </div>
                    <div>
                      <span className="font-medium">结果解释：</span>
                      <p className="text-sm text-muted-foreground mt-1">{analysis.interpretation}</p>
                    </div>
                    <div>
                      <span className="font-medium">结论：</span>
                      <p className="text-sm text-muted-foreground mt-1">{analysis.conclusion}</p>
                    </div>
                    <div>
                      <Badge variant={analysis.supportsHypothesis ? 'default' : 'secondary'}>
                        {analysis.supportsHypothesis ? '支持假设' : '不支持假设'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {session.manuscript && session.stage === 'completed' && (
            <DocumentOutput
              content={fullManuscriptContent}
              title={session.manuscript.title}
              showPreview={true}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="w-4 h-4" />
                运行日志
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[150px]">
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
          <CardTitle className="text-base">AI Scientist v2 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">端到端自动化</h4>
              <p className="text-sm text-purple-600">从假设生成到论文撰写的全流程自动化</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">真实文献检索</h4>
              <p className="text-sm text-blue-600">集成Semantic Scholar和arXiv数据库</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-1">首个AI撰写论文</h4>
              <p className="text-sm text-green-600">首个AI撰写的被学术会议接受的论文</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['ai-scientist-v2']} />
    </div>
  );
};

export default AIScientistV2Agent;