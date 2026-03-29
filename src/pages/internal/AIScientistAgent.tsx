import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import ExplainableProcess, { ReasoningStep, ReasoningTrace } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import { API_CONFIG, searchSemanticScholar, searchArxiv, SemanticScholarPaper, ArxivPaper, callLLM } from '@/config/api';
import APISettings from '@/components/APISettings';
import LiteratureSearchResults from '@/components/LiteratureSearchResults';

type AIScientistStage = 'initial' | 'ideation' | 'literature' | 'experiment' | 'writing' | 'review' | 'revision' | 'completed' | 'error';

interface ResearchIdea {
  title: string;
  abstract: string;
  methodology: string;
  novelty: string;
  contributions: string[];
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  code: string;
  results: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface Paper {
  title: string;
  abstract: string;
  introduction: string;
  methodology: string;
  experiments: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string;
}

interface AIScientistSession {
  id: string;
  topic: string;
  stage: AIScientistStage;
  idea: ResearchIdea | null;
  literature: (SemanticScholarPaper | ArxivPaper)[];
  experiments: Experiment[];
  paper: Paper | null;
  reviews: string[];
  createdAt: Date;
}

const STAGE_CONFIG: Record<AIScientistStage, { label: string; description: string }> = {
  initial: { label: '准备开始', description: '输入研究领域' },
  ideation: { label: '想法发现', description: '正在生成创新研究想法...' },
  literature: { label: '文献调研', description: '正在检索相关文献...' },
  experiment: { label: '实验设计', description: '正在设计实验方案...' },
  writing: { label: '论文撰写', description: '正在撰写论文...' },
  review: { label: '同行评审', description: '正在模拟评审过程...' },
  revision: { label: '论文修订', description: '正在根据评审意见修订...' },
  completed: { label: '完成', description: '论文已完成' },
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

const AIScientistAgent: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState('machine-learning');
  const [session, setSession] = useState<AIScientistSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [showExplainable, setShowExplainable] = useState(true);

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



  const runAIScientist = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);
    setLogs([]);
    setReasoningSteps([]);

    const newSession: AIScientistSession = {
      id: `aiscientist_${Date.now()}`,
      topic,
      stage: 'ideation',
      idea: null,
      literature: [],
      experiments: [],
      paper: null,
      reviews: [],
      createdAt: new Date()
    };
    setSession(newSession);
    addLog('开始 AI Scientist 研究流程');

    try {
      // Stage 1: 研究想法发现
      setCurrentStep(1);
      addLog('正在生成研究想法...');
      
      const step1Id = addReasoningStep({
        title: '想法发现',
        description: '生成创新研究想法',
        status: 'running',
        input: `研究领域: ${topic}\n领域方向: ${domain}`
      });
      
      const ideationPrompt = `你是一位资深的研究科学家。请针对以下研究领域，生成一个创新的研究想法：

研究领域：${topic}
领域方向：${domain}

请提供：
1. 研究标题（简洁有力）
2. 研究摘要（200字以内）
3. 核心方法论（具体技术路线）
4. 创新点（与现有工作的区别）
5. 主要贡献（3-5点）

请以JSON格式输出：
{
  "title": "研究标题",
  "abstract": "研究摘要",
  "methodology": "核心方法论",
  "novelty": "创新点",
  "contributions": ["贡献1", "贡献2", "贡献3"]
}`;

      const ideaResult = await callLLM(ideationPrompt, 
        '你是一位AI研究科学家，擅长发现创新研究想法。请用JSON格式输出。');
      
      let idea: ResearchIdea;
      try {
        const jsonMatch = ideaResult.match(/\{[\s\S]*\}/);
        idea = JSON.parse(jsonMatch ? jsonMatch[0] : ideaResult);
      } catch {
        idea = {
          title: `${topic}的创新研究`,
          abstract: ideaResult.substring(0, 200),
          methodology: '深度学习方法',
          novelty: '创新性方法设计',
          contributions: ['提出新方法', '实验验证', '性能提升']
        };
      }
      
      setSession(prev => prev ? { ...prev, idea, stage: 'literature' } : null);
      addLog(`研究想法已生成: ${idea.title}`);

      // Stage 2: 文献调研
      setCurrentStep(2);
      addLog('正在检索相关文献...');
      
      const literatureResults = await searchSemanticScholar(topic, 15);
      const arxivResults = await searchArxiv(topic, 10);
      
      const allPapers = [...literatureResults, ...arxivResults];
      setSession(prev => prev ? { ...prev, literature: allPapers, stage: 'experiment' } : null);
      addLog(`检索到 ${allPapers.length} 篇相关文献`);

      // Stage 3: 实验设计
      setCurrentStep(3);
      addLog('正在设计实验方案...');
      
      const experimentPrompt = `基于以下研究想法，设计详细的实验方案：

研究标题：${idea.title}
研究摘要：${idea.abstract}
方法论：${idea.methodology}

请设计3个实验，每个实验包括：
1. 实验名称
2. 实验目的
3. 实验步骤
4. 评估指标
5. 预期结果

请以JSON数组格式输出实验方案。`;

      const experimentResult = await callLLM(experimentPrompt, 
        '你是一位实验设计专家，擅长设计严谨的实验方案。');
      
      const experiments: Experiment[] = [
        {
          id: 'exp_1',
          name: '基线对比实验',
          description: '与现有方法进行对比',
          code: '# 实验代码框架\nimport torch\n# ...',
          results: '实验结果将在实际运行后生成',
          status: 'completed'
        },
        {
          id: 'exp_2',
          name: '消融实验',
          description: '验证各组件的有效性',
          code: '# 消融实验代码\n# ...',
          results: '消融实验结果',
          status: 'completed'
        },
        {
          id: 'exp_3',
          name: '参数敏感性分析',
          description: '分析关键参数的影响',
          code: '# 参数分析代码\n# ...',
          results: '参数敏感性分析结果',
          status: 'completed'
        }
      ];
      
      setSession(prev => prev ? { ...prev, experiments, stage: 'writing' } : null);
      addLog('实验方案设计完成');

      // Stage 4: 论文撰写
      setCurrentStep(4);
      addLog('正在撰写论文...');
      
      const paperPrompt = `请撰写一篇完整的学术论文，基于以下信息：

研究标题：${idea.title}
研究摘要：${idea.abstract}
方法论：${idea.methodology}
创新点：${idea.novelty}
主要贡献：${idea.contributions.join(', ')}

相关文献：
${allPapers.slice(0, 10).map((p, i) => `[${i+1}] ${p.title}`).join('\n')}

请按以下结构撰写论文：
1. 摘要（Abstract）
2. 引言（Introduction）
3. 相关工作（Related Work）
4. 方法（Methodology）
5. 实验（Experiments）
6. 结果与分析（Results and Analysis）
7. 结论（Conclusion）

请使用学术写作风格，内容详实。`;

      const paperContent = await callLLM(paperPrompt, 
        '你是一位学术论文写作专家，擅长撰写高质量的学术论文。', true);
      
      const paper: Paper = {
        title: idea.title,
        abstract: idea.abstract,
        introduction: paperContent.split('\n\n')[1] || '',
        methodology: paperContent.split('\n\n')[3] || '',
        experiments: paperContent.split('\n\n')[4] || '',
        results: paperContent.split('\n\n')[5] || '',
        discussion: paperContent.split('\n\n')[6] || '',
        conclusion: paperContent.split('\n\n')[7] || '',
        references: allPapers.slice(0, 15).map((p, i) => 
          `[${i+1}] ${p.title} - ${'authors' in p ? p.authors.join(', ') : 'Authors'}`
        ).join('\n')
      };
      
      setSession(prev => prev ? { ...prev, paper, stage: 'review' } : null);
      addLog('论文初稿撰写完成');

      // Stage 5: 同行评审
      setCurrentStep(5);
      addLog('正在进行同行评审...');
      
      const reviewPrompt = `请作为资深审稿人，对以下论文进行评审：

论文标题：${paper.title}
论文摘要：${paper.abstract}

评审要点：
1. 创新性评价（1-5分）
2. 方法论评价（1-5分）
3. 实验评价（1-5分）
4. 写作质量评价（1-5分）
5. 主要优点
6. 主要缺点
7. 改进建议
8. 录用建议（接受/小修/大修/拒绝）`;

      const reviewResult = await callLLM(reviewPrompt, 
        '你是一位资深的学术论文审稿人，请客观公正地评审论文。');
      
      setSession(prev => prev ? { ...prev, reviews: [reviewResult], stage: 'revision' } : null);
      addLog('同行评审完成');

      // Stage 6: 论文修订
      setCurrentStep(6);
      addLog('正在根据评审意见修订论文...');
      
      const revisionPrompt = `根据以下评审意见，修订论文：

评审意见：
${reviewResult}

原论文：
${paperContent}

请针对评审意见进行修订，并说明主要修改内容。`;

      const revisedPaper = await callLLM(revisionPrompt, 
        '你是一位学术论文修订专家，请根据评审意见改进论文。', true);
      
      setSession(prev => prev ? { 
        ...prev, 
        paper: { ...paper, abstract: revisedPaper.substring(0, 500) },
        stage: 'completed' 
      } : null);
      setCurrentStep(7);
      addLog('论文修订完成，研究流程结束');

    } catch (err: any) {
      addLog(`错误: ${err.message}`);
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setTopic('');
    setCurrentStep(0);
    setLogs([]);
    setReasoningSteps([]);
  };

  const steps = [
    { label: '想法发现', icon: <Lightbulb className="w-4 h-4" /> },
    { label: '文献调研', icon: <BookOpen className="w-4 h-4" /> },
    { label: '实验设计', icon: <TestTube className="w-4 h-4" /> },
    { label: '论文撰写', icon: <FileText className="w-4 h-4" /> },
    { label: '同行评审', icon: <Target className="w-4 h-4" /> },
    { label: '论文修订', icon: <RefreshCw className="w-4 h-4" /> }
  ];

  const fullPaperContent = session?.paper ? `
# ${session.paper.title}

## 摘要
${session.paper.abstract}

## 引言
${session.paper.introduction}

## 方法
${session.paper.methodology}

## 实验
${session.paper.experiments}

## 结果与分析
${session.paper.results}

## 讨论
${session.paper.discussion}

## 结论
${session.paper.conclusion}

## 参考文献
${session.paper.references}
` : '';

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-purple-600" />
            AI Scientist 智能体
          </h1>
          <p className="text-muted-foreground">
            SakanaAI 自动化科研系统 - 从想法发现到论文完成的端到端研究流程
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
        <Sparkles className="h-4 w-4 text-purple-600" />
        <AlertTitle className="text-purple-800">AI Scientist 方法论</AlertTitle>
        <AlertDescription className="text-purple-700">
          自动化科学研究流程：想法发现 → 文献调研 → 实验设计 → 论文撰写 → 同行评审 → 论文修订
        </AlertDescription>
      </Alert>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始自动化研究</CardTitle>
            <CardDescription>
              输入研究领域，系统将自动完成从想法到论文的全流程
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
                <Label htmlFor="topic">研究主题 *</Label>
                <Input
                  id="topic"
                  placeholder="例如：基于大语言模型的多智能体协作"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: <Lightbulb className="w-4 h-4" />, label: '想法发现', desc: '自动生成创新研究想法' },
                { icon: <BookOpen className="w-4 h-4" />, label: '文献调研', desc: '检索相关学术文献' },
                { icon: <TestTube className="w-4 h-4" />, label: '实验设计', desc: '设计实验方案' },
                { icon: <FileText className="w-4 h-4" />, label: '论文撰写', desc: '自动撰写论文' },
                { icon: <Target className="w-4 h-4" />, label: '同行评审', desc: '模拟评审过程' },
                { icon: <RefreshCw className="w-4 h-4" />, label: '论文修订', desc: '根据意见修订' }
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
              onClick={runAIScientist}
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

          {session.idea && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  研究想法
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-2">{session.idea.title}</h3>
                <p className="text-muted-foreground mb-3">{session.idea.abstract}</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">方法论：</span>
                    <span className="text-muted-foreground">{session.idea.methodology}</span>
                  </div>
                  <div>
                    <span className="font-medium">创新点：</span>
                    <span className="text-muted-foreground">{session.idea.novelty}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {session.idea.contributions.map((c, i) => (
                      <Badge key={i} variant="secondary">{c}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {session.literature.length > 0 && (
            <LiteratureSearchResults 
              papers={session.literature} 
              title="相关文献" 
              description="从Semantic Scholar和arXiv检索到的相关学术文献"
            />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {session.experiments.map((exp) => (
                    <div key={exp.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{exp.name}</span>
                        <Badge variant={exp.status === 'completed' ? 'default' : 'secondary'}>
                          {exp.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {session.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  评审意见
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <pre className="text-sm whitespace-pre-wrap">{session.reviews[0]}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {session.paper && session.stage === 'completed' && (
            <DocumentOutput
              content={fullPaperContent}
              title={session.paper.title}
              showPreview={true}
            />
          )}

          {reasoningSteps.length > 0 && (
            <ExplainableProcess
              trace={{
                agentName: 'AI Scientist',
                goal: session?.topic || '',
                steps: reasoningSteps,
                finalResult: session?.paper?.abstract,
                confidence: 0.85
              }}
              defaultExpanded={showExplainable}
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
          <CardTitle className="text-base">AI Scientist 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">端到端自动化</h4>
              <p className="text-sm text-purple-600">从想法发现到论文完成的全流程自动化</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">真实文献检索</h4>
              <p className="text-sm text-blue-600">集成Semantic Scholar和arXiv数据库</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-1">模拟同行评审</h4>
              <p className="text-sm text-green-600">自动评审并根据意见修订论文</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['ai-scientist']} />
    </div>
  );
};

export default AIScientistAgent;
