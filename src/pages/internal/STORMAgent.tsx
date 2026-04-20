import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Send, Loader2, Copy, Check,
  FileText, Layers, GitBranch, Sparkles, 
  ChevronRight, AlertCircle, RefreshCw, Download,
  Play, MessageSquare, Users, Target, Lightbulb,
  ExternalLink, Quote, Database
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
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import { API_CONFIG, callLLM } from '@/config/api';
import APISettings from '@/components/APISettings';

type StormStage = 'initial' | 'researching' | 'questioning' | 'synthesizing' | 'writing' | 'completed' | 'error';

interface ExpertPerspective {
  id: string;
  name: string;
  expertise: string;
  questions: string[];
  answers: string[];
}

interface StormSession {
  id: string;
  topic: string;
  stage: StormStage;
  perspectives: ExpertPerspective[];
  researchNotes: string[];
  fullArticle: string;
  createdAt: Date;
}

const STAGE_CONFIG: Record<StormStage, { label: string; description: string }> = {
  initial: { label: '准备开始', description: '输入研究主题' },
  researching: { label: '背景研究', description: '正在收集主题背景信息...' },
  questioning: { label: '专家提问', description: '正在模拟多角度专家提问...' },
  synthesizing: { label: '知识合成', description: '正在整合专家观点...' },
  writing: { label: '撰写文章', description: '正在生成维基百科式文章...' },
  completed: { label: '完成', description: '文章已生成' },
  error: { label: '错误', description: '发生错误' }
};

const EXPERT_PROMPTS = [
  {
    name: '理论专家',
    expertise: '理论基础与概念框架',
    prompt: `你是一位理论专家，专注于分析主题的理论基础和概念框架。请针对以下主题提出3-5个深入的理论问题：

问题应该关注：
- 核心概念的定义和边界
- 理论基础和假设
- 概念之间的关系
- 理论演进的历史脉络

请以学术严谨的方式提出问题。`
  },
  {
    name: '方法论专家',
    expertise: '研究方法与技术路线',
    prompt: `你是一位方法论专家，专注于分析研究方法和技术路线。请针对以下主题提出3-5个方法论问题：

问题应该关注：
- 主要研究范式和方法
- 数据收集和分析技术
- 方法的优缺点比较
- 方法论创新方向

请以学术严谨的方式提出问题。`
  },
  {
    name: '实践专家',
    expertise: '应用场景与实践案例',
    prompt: `你是一位实践专家，专注于分析应用场景和实践案例。请针对以下主题提出3-5个实践问题：

问题应该关注：
- 主要应用领域
- 成功案例和失败教训
- 实施挑战和解决方案
- 实践与理论的差距

请以学术严谨的方式提出问题。`
  },
  {
    name: '前沿专家',
    expertise: '发展趋势与未来方向',
    prompt: `你是一位前沿专家，专注于分析发展趋势和未来方向。请针对以下主题提出3-5个前瞻性问题：

问题应该关注：
- 当前研究热点
- 技术发展趋势
- 未来挑战和机遇
- 跨学科融合可能

请以学术严谨的方式提出问题。`
  }
];

const STORMAgent: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [session, setSession] = useState<StormSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);



  const runSTORM = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);

    const newSession: StormSession = {
      id: `storm_${Date.now()}`,
      topic,
      stage: 'researching',
      perspectives: [],
      researchNotes: [],
      fullArticle: '',
      createdAt: new Date()
    };
    setSession(newSession);

    try {
      // Stage 1: 背景研究
      setCurrentStep(1);
      setSession(prev => prev ? { ...prev, stage: 'researching' } : null);
      
      const backgroundPrompt = `请针对以下主题进行背景研究，收集关键信息：

主题：${topic}

请提供：
1. 主题的基本定义和范围
2. 历史发展脉络
3. 核心概念和术语
4. 主要研究者和机构
5. 重要里程碑事件`;

      const background = await callLLM(backgroundPrompt, 
        '你是一位知识策展专家，专注于收集和整理主题背景信息。');
      
      setSession(prev => prev ? { 
        ...prev, 
        researchNotes: [background],
        stage: 'questioning'
      } : null);

      // Stage 2: 多角度专家提问
      setCurrentStep(2);
      const perspectives: ExpertPerspective[] = [];

      for (const expert of EXPERT_PROMPTS) {
        const questionsPrompt = `${expert.prompt}

主题：${topic}

背景信息：
${background}`;

        const questionsResult = await callLLM(questionsPrompt, expert.prompt);
        
        const answersPrompt = `作为${expert.name}，请回答以下问题：

${questionsResult}

主题：${topic}

请提供详细、专业的回答。`;

        const answersResult = await callLLM(answersPrompt, expert.prompt, true);

        perspectives.push({
          id: `expert_${perspectives.length}`,
          name: expert.name,
          expertise: expert.expertise,
          questions: [questionsResult],
          answers: [answersResult]
        });

        setSession(prev => prev ? { ...prev, perspectives: [...perspectives] } : null);
      }

      // Stage 3: 知识合成
      setCurrentStep(3);
      setSession(prev => prev ? { ...prev, stage: 'synthesizing' } : null);

      const allPerspectives = perspectives.map(p => 
        `## ${p.name}（${p.expertise}）\n\n${p.answers.join('\n\n')}`
      ).join('\n\n---\n\n');

      const synthesizePrompt = `请整合以下多角度专家观点，构建知识框架：

主题：${topic}

${allPerspectives}

请生成结构化的知识合成报告。`;

      const synthesis = await callLLM(synthesizePrompt, 
        '你是一位知识合成专家，擅长整合多角度观点。', true);

      // Stage 4: 撰写维基百科式文章
      setCurrentStep(4);
      setSession(prev => prev ? { ...prev, stage: 'writing' } : null);

      const writePrompt = `请基于以下研究材料，撰写一篇维基百科风格的详尽文章：

主题：${topic}

背景研究：
${background}

专家观点整合：
${synthesis}

文章要求：
1. 采用维基百科的格式和风格
2. 包含目录结构
3. 分章节详细阐述
4. 语言客观中立
5. 内容详实有深度`;

      const fullArticle = await callLLM(writePrompt, 
        '你是一位维基百科风格的科技写作专家，擅长撰写结构清晰、内容详尽的知识文章。', 
        true);

      setSession(prev => prev ? {
        ...prev,
        fullArticle,
        stage: 'completed'
      } : null);
      setCurrentStep(5);

    } catch (err: any) {
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setTopic('');
    setCurrentStep(0);
  };

  const steps = [
    { label: '背景研究', icon: <Search className="w-4 h-4" /> },
    { label: '专家提问', icon: <MessageSquare className="w-4 h-4" /> },
    { label: '知识合成', icon: <Layers className="w-4 h-4" /> },
    { label: '撰写文章', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            STORM 智能体
          </h1>
          <p className="text-muted-foreground">
            斯坦福大学知识策展系统 - 多角度提问生成维基百科式深度综述
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

      <Alert className="bg-blue-50 border-blue-200">
        <Target className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">STORM 方法论</AlertTitle>
        <AlertDescription className="text-blue-700">
          模拟多位专家从不同角度提问，通过"发现式提问"挖掘主题的深度信息，
          最终生成结构完整、逻辑清晰的维基百科式知识文章。
        </AlertDescription>
      </Alert>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始知识策展</CardTitle>
            <CardDescription>
              输入研究主题，系统将模拟多专家对话生成深度知识文章
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">研究主题 *</Label>
              <Input
                id="topic"
                placeholder="例如：人工智能在教育领域的应用"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EXPERT_PROMPTS.map((expert, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">{expert.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{expert.expertise}</p>
                </div>
              ))}
            </div>
            
            <Button
              onClick={runSTORM}
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
                  开始 STORM 策展
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

          {session.stage !== 'completed' && session.stage !== 'error' && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{STAGE_CONFIG[session.stage].description}</span>
            </div>
          )}

          {session.perspectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  专家观点 ({session.perspectives.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {session.perspectives.map((p, i) => (
                      <div key={p.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{p.name}</Badge>
                          <span className="text-xs text-muted-foreground">{p.expertise}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {p.answers[0]?.substring(0, 300)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {session.fullArticle && session.stage === 'completed' && (
            <DocumentOutput
              content={session.fullArticle}
              title={session.topic}
              showPreview={true}
            />
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">STORM 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">多角度提问</h4>
              <p className="text-sm text-blue-600">模拟多位专家从不同视角深入挖掘主题</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">发现式研究</h4>
              <p className="text-sm text-purple-600">通过问答形式发现隐藏的知识关联</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-1">维基百科风格</h4>
              <p className="text-sm text-green-600">生成结构完整、逻辑清晰的知识文章</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['storm']} />
    </div>
  );
};

export default STORMAgent;
