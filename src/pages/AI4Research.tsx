import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Lightbulb, FlaskConical, Code, FileText, 
  Play, Trash2, RefreshCw, CheckCircle, AlertCircle, 
  Clock, Loader2, ChevronRight, BookOpen, GitBranch,
  Sparkles, Target, TrendingUp, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { API_CONFIG, callLLM, getModelForScenario } from '@/config/api';
import APISettings from '@/components/APISettings';

type WorkflowState = 
  | 'initial' 
  | 'generating' 
  | 'reflecting' 
  | 'external_data' 
  | 'evolving' 
  | 'ranking' 
  | 'method_development' 
  | 'refining' 
  | 'completed' 
  | 'error';

interface Idea {
  id: string;
  text: string;
  rationale: string;
  score: number;
  critiques: string[];
  evidence: string[];
  iteration: number;
  methodDetails?: string;
  parent_id?: string;
}

interface WorkflowSession {
  id: string;
  goal: string;
  domain: string;
  progress: string;
  constraints: string[];
  ideas: Idea[];
  topIdeas: string[];
  iteration: number;
  maxIterations: number;
  state: WorkflowState;
  feedbackHistory: string[];
  startedAt: Date;
  completedAt?: Date;
}

const WORKFLOW_STATES: Record<WorkflowState, { label: string; description: string; icon: React.ReactNode }> = {
  initial: { label: '初始化', description: '准备开始研究', icon: <Target className="w-4 h-4" /> },
  generating: { label: '假设生成', description: '生成研究假设', icon: <Lightbulb className="w-4 h-4" /> },
  reflecting: { label: '批判评估', description: '评估假设可行性', icon: <Brain className="w-4 h-4" /> },
  external_data: { label: '文献调研', description: '收集相关证据', icon: <BookOpen className="w-4 h-4" /> },
  evolving: { label: '假设演化', description: '优化改进假设', icon: <TrendingUp className="w-4 h-4" /> },
  ranking: { label: '假设排序', description: '评估排序假设', icon: <Sparkles className="w-4 h-4" /> },
  method_development: { label: '方法开发', description: '设计实验方法', icon: <FlaskConical className="w-4 h-4" /> },
  refining: { label: '方法优化', description: '优化实验方案', icon: <Code className="w-4 h-4" /> },
  completed: { label: '完成', description: '研究流程完成', icon: <CheckCircle className="w-4 h-4" /> },
  error: { label: '错误', description: '发生错误', icon: <AlertCircle className="w-4 h-4" /> }
};

const AGENT_PROMPTS = {
  generation: `你是一位创新研究专家，负责生成具有科学价值的研究假设。

你的任务：
1. 分析研究领域的前沿进展和技术趋势
2. 识别现有研究的不足和空白
3. 提出3-5个创新性的研究假设
4. 每个假设需要明确研究问题、创新点和预期贡献

输出格式：
## 研究假设

### 假设1：[假设陈述]
- **研究问题**：明确要解决的核心问题
- **创新方法**：提出的新方法或新思路
- **科学依据**：支持该假设的理论基础
- **预期贡献**：可能的研究贡献

（依次列出其他假设）`,

  reflection: `你是一位严谨的科学评估专家，负责批判性评估研究假设。

你的任务：
1. 评估假设的科学性和可行性
2. 识别潜在的弱点和挑战
3. 提出改进建议
4. 给出评分（1-10分）

评估维度：
- 科学性：是否有理论依据
- 创新性：是否具有原创性
- 可行性：是否可以验证
- 价值性：是否有研究意义

输出格式：
## 评估报告

### 假设评估
- **优势**：列出假设的优点
- **弱点**：指出潜在问题
- **改进建议**：具体优化方向
- **综合评分**：X/10分`,

  evolution: `你是一位研究优化专家，负责演化和改进研究假设。

你的任务：
1. 根据批判评估识别的问题
2. 结合文献证据
3. 生成改进后的假设版本
4. 说明具体改进内容

输出格式：
## 演化后的假设

### 改进假设：[新假设陈述]
- **改进内容**：具体修改了什么
- **改进理由**：为什么这样修改
- **预期效果**：改进后的优势`,

  method_development: `你是一位实验设计专家，负责将研究假设转化为可执行的实验方案。

你的任务：
1. 设计详细的实验方法
2. 规划数据采集和分析流程
3. 提供代码框架或伪代码
4. 制定评估指标

输出格式：
## 实验方案

### 1. 实验设计
- 实验目标
- 实验变量
- 对照设置

### 2. 数据方案
- 数据来源
- 数据处理流程

### 3. 代码框架
\`\`\`python
# 核心代码框架
\`\`\`

### 4. 评估指标
- 主要指标
- 辅助指标`,

  paper_writing: `你是一位学术论文撰写专家，负责基于研究成果撰写完整论文。

你的任务：
1. 整合所有研究过程和结果
2. 按学术论文规范撰写
3. 确保逻辑清晰、论证充分

输出格式：
# [论文标题]

## 摘要
[研究背景、方法、结果、结论]

## 1. 引言
[研究背景、问题陈述、研究意义]

## 2. 相关工作
[文献综述、现有研究分析]

## 3. 研究方法
[研究设计、实验方法、数据收集]

## 4. 实验结果
[实验数据、结果分析]

## 5. 讨论
[结果讨论、与现有工作对比、局限性]

## 6. 结论
[研究结论、未来工作]

## 参考文献
[主要参考文献列表]`
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const AI4Research: React.FC = () => {
  const [session, setSession] = useState<WorkflowSession | null>(null);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [goal, setGoal] = useState('');
  const [domain, setDomain] = useState('');
  const [progress, setProgress] = useState('');
  const [constraints, setConstraints] = useState('');

  const sessionRef = useRef(session);
  useEffect(() => { sessionRef.current = session; }, [session]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const callAPI = async (prompt: string, systemPrompt: string, isLongOutput: boolean = false): Promise<string> => {
    // AI4Research 使用科研自动化场景模型（大参数模型）
    const model = getModelForScenario('ai4research');
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt }
    ];
    const response = await callLLM(messages, model);
    return response.content;
  };

  const updateState = (newState: WorkflowState) => {
    setSession(prev => prev ? { ...prev, state: newState } : null);
  };

  const runGenerationPhase = async () => {
    addLog('🔍 Generation Agent: 开始生成研究假设...');
    updateState('generating');

    const prompt = `研究领域：${domain}\n研究目标：${goal}\n领域进展：${progress || '请分析该领域的最新研究进展'}\n约束条件：${constraints || '无特殊约束'}`;
    
    const output = await callAPI(prompt, AGENT_PROMPTS.generation);
    
    const ideas: Idea[] = [{
      id: `idea_${Date.now()}`,
      text: output,
      rationale: '',
      score: 0,
      critiques: [],
      evidence: [],
      iteration: 0
    }];

    setSession(prev => prev ? { ...prev, ideas, iteration: 1 } : null);
    setCurrentIdea(ideas[0]);
    addLog(`✅ Generation Agent: 生成了 ${ideas.length} 个研究假设`);
  };

  const runReflectionPhase = async () => {
    addLog('🧠 Reflection Agent: 开始批判性评估...');
    updateState('reflecting');

    const currentSession = sessionRef.current;
    if (!currentSession || currentSession.ideas.length === 0) {
      throw new Error('没有可评估的假设');
    }

    const idea = currentSession.ideas[currentSession.ideas.length - 1];
    const prompt = `研究目标：${currentSession.goal}\n\n假设内容：\n${idea.text}`;
    
    const critique = await callAPI(prompt, AGENT_PROMPTS.reflection);
    
    const updatedIdea = { ...idea, critiques: [critique] };
    setCurrentIdea(updatedIdea);
    setSession(prev => prev ? {
      ...prev,
      ideas: prev.ideas.map(i => i.id === idea.id ? updatedIdea : i)
    } : null);
    
    addLog('✅ Reflection Agent: 完成批判性评估');
  };

  const runExternalDataPhase = async () => {
    addLog('📚 Scholar Agent: 收集相关文献证据...');
    updateState('external_data');

    const currentSession = sessionRef.current;
    const idea = currentSession?.ideas[currentSession.ideas.length - 1];
    if (!idea) throw new Error('没有可查找证据的假设');

    const prompt = `为以下研究假设提供相关的文献支持和理论依据：\n\n${idea.text}`;
    
    const evidence = await callAPI(prompt, `你是一位学术文献专家。请为研究假设提供相关的理论依据和文献支持。
列出3-5个相关的理论或研究方向，并说明其与假设的关联。`);
    
    const updatedIdea = { ...idea, evidence: [evidence] };
    setCurrentIdea(updatedIdea);
    setSession(prev => prev ? {
      ...prev,
      ideas: prev.ideas.map(i => i.id === idea.id ? updatedIdea : i)
    } : null);
    
    addLog('✅ Scholar Agent: 完成文献收集');
  };

  const runEvolutionPhase = async () => {
    addLog('📈 Evolution Agent: 演化优化假设...');
    updateState('evolving');

    const currentSession = sessionRef.current;
    const idea = currentSession?.ideas[currentSession.ideas.length - 1];
    if (!idea) throw new Error('没有可演化的假设');

    const prompt = `原始假设：\n${idea.text}\n\n批判评估：\n${idea.critiques.join('\n')}\n\n相关证据：\n${idea.evidence.join('\n')}`;
    
    const evolved = await callAPI(prompt, AGENT_PROMPTS.evolution);
    
    const newIdea: Idea = {
      id: `idea_${Date.now()}`,
      text: evolved,
      rationale: '基于批判评估和文献证据演化',
      score: 0,
      critiques: [],
      evidence: [],
      iteration: (idea.iteration || 0) + 1,
      parent_id: idea.id
    };

    setSession(prev => prev ? {
      ...prev,
      ideas: [...(prev?.ideas || []), newIdea],
      iteration: prev.iteration + 1
    } : null);
    setCurrentIdea(newIdea);
    
    addLog('✅ Evolution Agent: 完成假设演化');
  };

  const runMethodDevelopmentPhase = async () => {
    addLog('⚗️ Method Development Agent: 开发实验方法...');
    updateState('method_development');

    const currentSession = sessionRef.current;
    const idea = currentSession?.ideas[currentSession.ideas.length - 1];
    if (!idea) throw new Error('没有可开发方法的假设');

    const prompt = `研究目标：${currentSession?.goal}\n\n研究假设：\n${idea.text}\n\n相关证据：\n${idea.evidence.join('\n')}`;
    
    const method = await callAPI(prompt, AGENT_PROMPTS.method_development);
    
    const updatedIdea = { ...idea, methodDetails: method };
    setCurrentIdea(updatedIdea);
    setSession(prev => prev ? {
      ...prev,
      ideas: prev.ideas.map(i => i.id === idea.id ? updatedIdea : i)
    } : null);
    
    addLog('✅ Method Development Agent: 完成实验方法设计');
  };

  const runPaperWritingPhase = async () => {
    addLog('📝 Paper Writing Agent: 撰写研究论文...');
    updateState('refining');

    const currentSession = sessionRef.current;
    const idea = currentSession?.ideas[currentSession.ideas.length - 1];
    if (!idea) throw new Error('没有可撰写论文的假设');

    const prompt = `研究领域：${currentSession?.domain}\n研究目标：${currentSession?.goal}\n\n研究假设：\n${idea.text}\n\n批判评估：\n${idea.critiques.join('\n')}\n\n相关证据：\n${idea.evidence.join('\n')}\n\n实验方法：\n${idea.methodDetails || '未提供'}`;
    
    const paper = await callAPI(prompt, AGENT_PROMPTS.paper_writing, true);
    
    const updatedIdea = { ...idea, methodDetails: paper };
    setCurrentIdea(updatedIdea);
    setSession(prev => prev ? {
      ...prev,
      ideas: prev.ideas.map(i => i.id === idea.id ? updatedIdea : i),
      topIdeas: [idea.id]
    } : null);
    
    addLog('✅ Paper Writing Agent: 完成论文撰写');
  };

  const runWorkflow = async () => {
    if (!goal || !domain) {
      setError('请填写研究领域和研究目标');
      return;
    }

    setIsRunning(true);
    setError(null);
    setLogs([]);

    const newSession: WorkflowSession = {
      id: `session_${Date.now()}`,
      goal,
      domain,
      progress,
      constraints: constraints ? constraints.split('\n').filter(c => c.trim()) : [],
      ideas: [],
      topIdeas: [],
      iteration: 0,
      maxIterations: 3,
      state: 'initial',
      feedbackHistory: [],
      startedAt: new Date()
    };
    setSession(newSession);

    try {
      await runGenerationPhase();
      await delay(500);
      
      await runReflectionPhase();
      await delay(500);
      
      await runExternalDataPhase();
      await delay(500);
      
      await runEvolutionPhase();
      await delay(500);
      
      await runMethodDevelopmentPhase();
      await delay(500);
      
      await runPaperWritingPhase();
      
      updateState('completed');
      addLog('🎉 研究流程完成！');
      
    } catch (err: any) {
      setError(err.message || '执行过程中发生错误');
      updateState('error');
      addLog(`❌ 错误: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const stopWorkflow = () => {
    setIsRunning(false);
    updateState('error');
    addLog('⚠️ 用户中断了工作流');
  };

  const resetSession = () => {
    setSession(null);
    setCurrentIdea(null);
    setLogs([]);
    setError(null);
    setIsRunning(false);
  };

  const getStateColor = (state: WorkflowState) => {
    const colors: Record<WorkflowState, string> = {
      initial: 'bg-gray-100 text-gray-600',
      generating: 'bg-blue-100 text-blue-600',
      reflecting: 'bg-purple-100 text-purple-600',
      external_data: 'bg-amber-100 text-amber-600',
      evolving: 'bg-green-100 text-green-600',
      ranking: 'bg-indigo-100 text-indigo-600',
      method_development: 'bg-cyan-100 text-cyan-600',
      refining: 'bg-pink-100 text-pink-600',
      completed: 'bg-emerald-100 text-emerald-600',
      error: 'bg-red-100 text-red-600'
    };
    return colors[state];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">AI4Research 自动化科研系统</h1>
          <p className="text-muted-foreground">基于 InternAgent 架构的多智能体协同科研平台</p>
        </motion.div>

        <APISettings scenario="ai4research" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  研究任务配置
                </CardTitle>
                <CardDescription>定义研究目标和约束条件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">研究领域 *</Label>
                  <Input
                    id="domain"
                    placeholder="例如：人工智能、生物医学、材料科学"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">研究目标 *</Label>
                  <Textarea
                    id="goal"
                    placeholder="描述具体的研究问题和目标"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={3}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">领域研究进展</Label>
                  <Textarea
                    id="progress"
                    placeholder="描述该领域的最新研究动态、技术趋势、存在问题"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    rows={3}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="constraints">约束条件</Label>
                  <Textarea
                    id="constraints"
                    placeholder="每行一个约束条件"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    rows={2}
                    disabled={isRunning}
                  />
                </div>
                <Separator />
                <div className="flex gap-2">
                  {!isRunning ? (
                    <Button onClick={runWorkflow} className="flex-1" disabled={!goal || !domain}>
                      <Play className="w-4 h-4 mr-2" />
                      启动研究流程
                    </Button>
                  ) : (
                    <Button onClick={stopWorkflow} variant="destructive" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      停止
                    </Button>
                  )}
                  {session && !isRunning && (
                    <Button onClick={resetSession} variant="outline">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {session && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    工作流状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(WORKFLOW_STATES).map(([key, value]) => {
                      const stateKey = key as WorkflowState;
                      const isActive = session.state === stateKey;
                      const isPast = Object.keys(WORKFLOW_STATES).indexOf(session.state) > Object.keys(WORKFLOW_STATES).indexOf(key);
                      
                      return (
                        <div 
                          key={key}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            isActive ? 'bg-primary/10 border border-primary/30' : 
                            isPast ? 'opacity-50' : ''
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-primary text-primary-foreground' :
                            isPast ? 'bg-green-500 text-white' : 'bg-muted'
                          }`}>
                            {isPast && !isActive ? <CheckCircle className="w-4 h-4" /> : value.icon}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{value.label}</span>
                          </div>
                          {isActive && isRunning && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {session && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    当前研究进展
                    <Badge className={getStateColor(session.state)}>
                      {WORKFLOW_STATES[session.state].label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>迭代 {session.iteration} / {session.maxIterations}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {currentIdea && (
                      <motion.div
                        key={currentIdea.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            研究假设
                          </h4>
                          <div className="bg-slate-100 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {currentIdea.text}
                          </div>
                        </div>

                        {currentIdea.critiques.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-purple-500" />
                              批判评估
                            </h4>
                            <div className="bg-purple-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {currentIdea.critiques.join('\n\n')}
                            </div>
                          </div>
                        )}

                        {currentIdea.evidence.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-amber-500" />
                              文献证据
                            </h4>
                            <div className="bg-amber-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {currentIdea.evidence.join('\n\n')}
                            </div>
                          </div>
                        )}

                        {currentIdea.methodDetails && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-500" />
                              {session.state === 'refining' || session.state === 'completed' ? '研究论文' : '实验方法'}
                            </h4>
                            <div className="bg-green-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                              {currentIdea.methodDetails}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}

            {logs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    执行日志
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 text-green-400 rounded-md p-3 text-xs font-mono max-h-48 overflow-y-auto">
                    {logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!session && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">开始你的研究</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      配置研究任务后，系统将自动执行：假设生成 → 批判评估 → 文献调研 → 假设演化 → 方法开发 → 论文撰写
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI4Research;
