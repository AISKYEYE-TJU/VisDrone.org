import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Lightbulb, FlaskConical, Code, FileText, 
  Play, Trash2, RefreshCw, CheckCircle, AlertCircle, 
  Clock, Loader2, ChevronRight, BookOpen, GitBranch,
  Sparkles, Target, TrendingUp, Zap, Palette, Users,
  Layers, PenTool, Layout, MessageSquare, Compass, Star
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API_CONFIG } from '@/config/api';

type DesignWorkflowState = 
  | 'initial'
  | 'problem_framing'
  | 'literature_review'
  | 'user_research'
  | 'ideation'
  | 'concept_evaluation'
  | 'prototype_design'
  | 'ux_evaluation'
  | 'paper_writing'
  | 'completed'
  | 'error';

interface DesignConcept {
  id: string;
  name: string;
  description: string;
  rationale: string;
  userNeeds: string[];
  designPrinciples: string[];
  feasibility: number;
  novelty: number;
  impact: number;
  critiques: string[];
  iterations: number;
  sketches?: string;
  prototype?: string;
  evaluation?: string;
  parent_id?: string;
}

interface DesignResearchSession {
  id: string;
  title: string;
  domain: string;
  problemStatement: string;
  targetUsers: string;
  designContext: string;
  constraints: string[];
  concepts: DesignConcept[];
  topConcepts: string[];
  literatureReview: string;
  userInsights: string;
  iteration: number;
  maxIterations: number;
  state: DesignWorkflowState;
  startedAt: Date;
  completedAt?: Date;
}

const DESIGN_WORKFLOW_STATES: Record<DesignWorkflowState, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  initial: { label: '初始化', description: '准备开始设计研究', icon: <Target className="w-4 h-4" />, color: 'gray' },
  problem_framing: { label: '问题界定', description: '明确设计问题与范围', icon: <Compass className="w-4 h-4" />, color: 'blue' },
  literature_review: { label: '文献调研', description: '调研相关设计与研究', icon: <BookOpen className="w-4 h-4" />, color: 'amber' },
  user_research: { label: '用户研究', description: '分析用户需求与行为', icon: <Users className="w-4 h-4" />, color: 'purple' },
  ideation: { label: '创意生成', description: '生成设计概念与方案', icon: <Lightbulb className="w-4 h-4" />, color: 'yellow' },
  concept_evaluation: { label: '概念评估', description: '评估设计概念可行性', icon: <Star className="w-4 h-4" />, color: 'indigo' },
  prototype_design: { label: '原型设计', description: '设计交互原型方案', icon: <PenTool className="w-4 h-4" />, color: 'cyan' },
  ux_evaluation: { label: '体验评估', description: '评估用户体验质量', icon: <MessageSquare className="w-4 h-4" />, color: 'pink' },
  paper_writing: { label: '论文撰写', description: '撰写设计研究论文', icon: <FileText className="w-4 h-4" />, color: 'green' },
  completed: { label: '完成', description: '设计研究流程完成', icon: <CheckCircle className="w-4 h-4" />, color: 'emerald' },
  error: { label: '错误', description: '发生错误', icon: <AlertCircle className="w-4 h-4" />, color: 'red' }
};

const DESIGN_AGENT_PROMPTS = {
  problem_framing: `你是一位设计研究专家，专注于设计学与人工智能的交叉研究。你的任务是帮助研究者明确和界定设计研究问题。

分析框架：
1. **问题背景**：分析设计问题的社会、技术、用户背景
2. **问题陈述**：清晰定义核心设计问题
3. **研究范围**：界定研究的边界和限制
4. **利益相关者**：识别所有相关的设计利益方
5. **设计机会**：发现潜在的设计创新机会

输出格式：
## 设计问题界定报告

### 1. 问题背景
[分析问题的背景和现状]

### 2. 核心问题陈述
[用一句话清晰陈述设计问题]

### 3. 问题分解
- 主问题：[核心设计问题]
- 子问题1：[具体方面]
- 子问题2：[具体方面]

### 4. 研究范围
- 包含：[研究范围内容]
- 不包含：[排除内容]

### 5. 利益相关者分析
- 主要用户：[目标用户群体]
- 次要用户：[相关用户群体]
- 其他利益方：[其他相关方]

### 6. 设计机会
[识别的设计创新机会]`,

  literature_review: `你是一位设计学文献调研专家，专注于设计学与人工智能交叉领域的文献分析。

调研框架：
1. **理论基础**：相关设计理论和方法论
2. **技术背景**：相关AI技术和应用
3. **设计案例**：相关设计实践案例
4. **研究空白**：现有研究的不足和机会

输出格式：
## 设计文献调研报告

### 1. 理论基础
[相关设计理论综述]

### 2. 技术背景
[相关AI技术综述]

### 3. 代表性案例
#### 案例1：[案例名称]
- 设计方法：[方法描述]
- 技术应用：[技术应用]
- 启示：[对本研究启示]

### 4. 研究现状分析
[现有研究的主要方向和成果]

### 5. 研究空白与机会
[识别的研究空白和创新机会]

### 6. 参考文献
[列出关键参考文献]`,

  user_research: `你是一位用户研究专家，专注于设计学领域的用户需求分析。

分析框架：
1. **用户画像**：目标用户群体特征
2. **需求分析**：用户需求和痛点
3. **行为分析**：用户行为模式和习惯
4. **场景分析**：典型使用场景
5. **设计启示**：对设计的指导意义

输出格式：
## 用户研究报告

### 1. 用户画像
#### 核心用户群体
- 人口统计特征：[年龄、职业、教育等]
- 技术熟练度：[技术水平描述]
- 使用动机：[使用产品的原因]

### 2. 需求分析
#### 功能需求
[用户期望的功能]

#### 情感需求
[用户的情感期望]

#### 痛点分析
[用户当前面临的问题]

### 3. 行为分析
[用户的行为模式和习惯]

### 4. 使用场景
#### 场景1：[场景名称]
- 触发条件：[什么情况下使用]
- 用户目标：[想达成什么]
- 关键行为：[主要操作步骤]

### 5. 设计启示
[对设计的具体指导建议]`,

  ideation: `你是一位设计创意专家，专注于生成创新的设计概念和方案。

创意框架：
1. **设计概念**：核心设计理念
2. **功能设计**：主要功能特性
3. **交互设计**：用户交互方式
4. **视觉设计**：视觉风格方向
5. **技术实现**：技术可行性分析

输出格式：
## 设计概念方案

### 概念名称：[概念名称]

### 1. 设计理念
[核心设计理念阐述]

### 2. 目标用户价值
- 核心价值：[为用户解决什么问题]
- 差异化价值：[与现有方案的差异]

### 3. 功能设计
#### 核心功能
1. [功能1]：[功能描述]
2. [功能2]：[功能描述]

#### 创新功能
[独特的创新功能]

### 4. 交互设计
[用户交互方式描述]

### 5. 视觉风格
[视觉设计方向]

### 6. 技术方案
[技术实现思路]

### 7. 可行性评估
- 技术可行性：[评估]
- 商业可行性：[评估]
- 用户接受度：[评估]`,

  concept_evaluation: `你是一位设计评估专家，负责对设计概念进行批判性评估。

评估维度：
1. **创新性**：设计的新颖程度
2. **可行性**：技术和资源的可实现性
3. **用户价值**：对用户的实际价值
4. **设计质量**：设计的美学和功能质量
5. **商业潜力**：市场应用前景

输出格式：
## 设计概念评估报告

### 评估对象：[概念名称]

### 1. 创新性评估 (X/10)
- 设计创新：[评估]
- 技术创新：[评估]
- 评分理由：[理由]

### 2. 可行性评估 (X/10)
- 技术可行性：[评估]
- 资源可行性：[评估]
- 评分理由：[理由]

### 3. 用户价值评估 (X/10)
- 需求匹配度：[评估]
- 体验提升度：[评估]
- 评分理由：[理由]

### 4. 设计质量评估 (X/10)
- 美学质量：[评估]
- 功能完整性：[评估]
- 评分理由：[理由]

### 5. 改进建议
[具体的改进方向和建议]

### 6. 综合评分：X/10`,

  prototype_design: `你是一位交互原型设计专家，负责将设计概念转化为可执行的原型方案。

设计框架：
1. **信息架构**：内容组织和导航
2. **交互流程**：用户操作流程
3. **界面布局**：页面布局设计
4. **交互细节**：交互反馈和动效
5. **设计规范**：设计系统和组件

输出格式：
## 交互原型设计方案

### 1. 信息架构
[内容组织和导航结构]

### 2. 核心交互流程
#### 主流程
1. 步骤1：[描述]
2. 步骤2：[描述]
...

#### 异常流程
[异常情况处理]

### 3. 界面设计
#### 首页/主界面
- 布局：[布局描述]
- 核心元素：[主要UI元素]
- 交互：[交互方式]

#### [其他关键页面]
[页面设计描述]

### 4. 交互细节
[交互反馈、动效设计]

### 5. 设计规范
- 色彩：[色彩方案]
- 字体：[字体规范]
- 间距：[间距规范]
- 组件：[设计组件]

### 6. 技术实现建议
[前端实现建议]`,

  ux_evaluation: `你是一位用户体验评估专家，负责评估设计方案的体验质量。

评估框架：
1. **可用性**：系统是否易于使用
2. **效率性**：用户能否高效完成任务
3. **满意度**：用户对设计的满意程度
4. **学习成本**：新用户上手难度
5. **错误处理**：错误预防和恢复

输出格式：
## 用户体验评估报告

### 1. 可用性评估
- 易学性：[评估]
- 易用性：[评估]
- 可记忆性：[评估]
- 问题点：[发现的问题]

### 2. 效率性评估
- 任务完成效率：[评估]
- 操作步骤：[评估]
- 优化建议：[建议]

### 3. 满意度评估
- 视觉满意度：[评估]
- 交互满意度：[评估]
- 整体满意度：[评估]

### 4. 启发式评估
[基于Nielsen十大可用性原则的评估]

### 5. 改进建议
#### 高优先级
[必须改进的问题]

#### 中优先级
[建议改进的问题]

#### 低优先级
[可选改进的问题]

### 6. 体验评分：X/10`,

  paper_writing: `你是一位设计学研究论文撰写专家，负责撰写符合学术规范的设计研究论文。

论文结构：
1. **摘要**：研究概述
2. **引言**：研究背景和问题
3. **相关工作**：文献综述
4. **研究方法**：设计研究方法
5. **设计实践**：设计方案和过程
6. **评估与讨论**：评估结果和讨论
7. **结论**：研究贡献和展望

输出格式：
# [论文标题]

## 摘要
[研究背景、目的、方法、结果、贡献，300字以内]

## 1. 引言
### 1.1 研究背景
[背景介绍]

### 1.2 问题陈述
[研究问题]

### 1.3 研究意义
[理论和实践意义]

### 1.4 论文结构
[论文组织结构]

## 2. 相关工作
### 2.1 [相关领域1]
[文献综述]

### 2.2 [相关领域2]
[文献综述]

### 2.3 研究空白
[现有研究不足]

## 3. 研究方法
### 3.1 研究设计
[研究方法选择]

### 3.2 数据收集
[数据收集方法]

### 3.3 分析方法
[数据分析方法]

## 4. 设计实践
### 4.1 用户研究
[用户研究发现]

### 4.2 设计概念
[设计方案阐述]

### 4.3 原型设计
[原型设计描述]

## 5. 评估与讨论
### 5.1 评估方法
[评估方法描述]

### 5.2 评估结果
[评估结果分析]

### 5.3 讨论
[结果讨论和启示]

## 6. 结论
### 6.1 研究贡献
[理论和实践贡献]

### 6.2 局限性
[研究局限]

### 6.3 未来工作
[未来研究方向]

## 参考文献
[参考文献列表]`
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const AI4DesignResearch: React.FC = () => {
  const [session, setSession] = useState<DesignResearchSession | null>(null);
  const [currentConcept, setCurrentConcept] = useState<DesignConcept | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('config');
  
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [designContext, setDesignContext] = useState('');
  const [constraints, setConstraints] = useState('');

  const sessionRef = useRef(session);
  const currentConceptRef = useRef(currentConcept);
  
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { currentConceptRef.current = currentConcept; }, [currentConcept]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const callAPI = async (prompt: string, systemPrompt: string, isLongOutput: boolean = false): Promise<string> => {
    const controller = new AbortController();
    const timeout = isLongOutput ? 300000 : API_CONFIG.timeout; // 5分钟超时时间
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: isLongOutput ? 10000 : API_CONFIG.maxTokens
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API错误: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  const updateState = (newState: DesignWorkflowState) => {
    setSession(prev => prev ? { ...prev, state: newState } : null);
  };

  const runProblemFramingPhase = async () => {
    addLog('🎯 Problem Framing Agent: 开始界定设计问题...');
    updateState('problem_framing');

    const prompt = `设计研究领域：${domain}
设计问题陈述：${problemStatement}
目标用户：${targetUsers}
设计背景：${designContext}
约束条件：${constraints || '无特殊约束'}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.problem_framing);
    
    const concept: DesignConcept = {
      id: `concept_${Date.now()}`,
      name: '问题界定结果',
      description: output,
      rationale: '',
      userNeeds: [],
      designPrinciples: [],
      feasibility: 0,
      novelty: 0,
      impact: 0,
      critiques: [],
      iterations: 0
    };

    setSession(prev => prev ? { ...prev, concepts: [concept], literatureReview: output } : null);
    setCurrentConcept(concept);
    addLog('✅ Problem Framing Agent: 完成设计问题界定');
  };

  const runLiteratureReviewPhase = async () => {
    addLog('📚 Literature Review Agent: 开始设计文献调研...');
    updateState('literature_review');

    const currentSession = sessionRef.current;
    const concept = currentSession?.concepts[0];
    if (!concept) throw new Error('没有可调研的设计问题');

    const prompt = `设计问题：${currentSession?.problemStatement}
设计领域：${currentSession?.domain}
问题界定结果：
${concept.description}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.literature_review);
    
    setSession(prev => prev ? { ...prev, literatureReview: output } : null);
    addLog('✅ Literature Review Agent: 完成文献调研');
  };

  const runUserResearchPhase = async () => {
    addLog('👥 User Research Agent: 开始用户研究分析...');
    updateState('user_research');

    const currentSession = sessionRef.current;
    if (!currentSession) throw new Error('没有活跃的研究会话');

    const prompt = `设计问题：${currentSession.problemStatement}
目标用户：${currentSession.targetUsers}
设计背景：${currentSession.designContext}
文献调研结果：
${currentSession.literatureReview}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.user_research);
    
    setSession(prev => prev ? { ...prev, userInsights: output } : null);
    addLog('✅ User Research Agent: 完成用户研究分析');
  };

  const runIdeationPhase = async () => {
    addLog('💡 Ideation Agent: 开始生成设计概念...');
    updateState('ideation');

    const currentSession = sessionRef.current;
    if (!currentSession) throw new Error('没有活跃的研究会话');

    const prompt = `设计问题：${currentSession.problemStatement}
目标用户：${currentSession.targetUsers}
用户研究洞察：
${currentSession.userInsights}
约束条件：${currentSession.constraints.join(', ')}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.ideation);
    
    const newConcept: DesignConcept = {
      id: `concept_${Date.now()}`,
      name: '设计方案',
      description: output,
      rationale: '基于用户研究和文献调研生成',
      userNeeds: [],
      designPrinciples: [],
      feasibility: 0,
      novelty: 0,
      impact: 0,
      critiques: [],
      iterations: 1
    };

    setSession(prev => prev ? { 
      ...prev, 
      concepts: [...prev.concepts, newConcept],
      iteration: 1 
    } : null);
    setCurrentConcept(newConcept);
    addLog('✅ Ideation Agent: 完成设计概念生成');
  };

  const runConceptEvaluationPhase = async () => {
    addLog('⭐ Concept Evaluation Agent: 开始评估设计概念...');
    updateState('concept_evaluation');

    const currentSession = sessionRef.current;
    const concept = currentSession?.concepts[currentSession.concepts.length - 1];
    if (!concept) throw new Error('没有可评估的设计概念');

    const prompt = `设计概念：
${concept.description}
设计问题：${currentSession?.problemStatement}
目标用户：${currentSession?.targetUsers}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.concept_evaluation);
    
    const updatedConcept = { ...concept, critiques: [output] };
    setCurrentConcept(updatedConcept);
    setSession(prev => prev ? {
      ...prev,
      concepts: prev.concepts.map(c => c.id === concept.id ? updatedConcept : c)
    } : null);
    
    addLog('✅ Concept Evaluation Agent: 完成设计概念评估');
  };

  const runPrototypeDesignPhase = async () => {
    addLog('🎨 Prototype Design Agent: 开始原型设计...');
    updateState('prototype_design');

    const currentSession = sessionRef.current;
    const concept = currentSession?.concepts[currentSession.concepts.length - 1];
    if (!concept) throw new Error('没有可设计原型的概念');

    const prompt = `设计概念：
${concept.description}
评估反馈：
${concept.critiques.join('\n')}
用户研究：
${currentSession?.userInsights}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.prototype_design);
    
    const updatedConcept = { ...concept, prototype: output };
    setCurrentConcept(updatedConcept);
    setSession(prev => prev ? {
      ...prev,
      concepts: prev.concepts.map(c => c.id === concept.id ? updatedConcept : c)
    } : null);
    
    addLog('✅ Prototype Design Agent: 完成原型设计方案');
  };

  const runUXEvaluationPhase = async () => {
    addLog('📊 UX Evaluation Agent: 开始用户体验评估...');
    updateState('ux_evaluation');

    const currentSession = sessionRef.current;
    const concept = currentSession?.concepts[currentSession.concepts.length - 1];
    if (!concept || !concept.prototype) throw new Error('没有可评估的原型设计');

    const prompt = `原型设计方案：
${concept.prototype}
设计概念：
${concept.description}
目标用户：${currentSession?.targetUsers}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.ux_evaluation);
    
    const updatedConcept = { ...concept, evaluation: output };
    setCurrentConcept(updatedConcept);
    setSession(prev => prev ? {
      ...prev,
      concepts: prev.concepts.map(c => c.id === concept.id ? updatedConcept : c)
    } : null);
    
    addLog('✅ UX Evaluation Agent: 完成用户体验评估');
  };

  const runPaperWritingPhase = async () => {
    addLog('📝 Paper Writing Agent: 开始撰写研究论文...');
    updateState('paper_writing');

    const currentSession = sessionRef.current;
    const concept = currentSession?.concepts[currentSession.concepts.length - 1];
    if (!concept) throw new Error('没有可撰写论文的设计研究');

    const prompt = `研究标题：${currentSession.title}
设计领域：${currentSession.domain}
设计问题：${currentSession.problemStatement}
目标用户：${currentSession.targetUsers}

文献调研：
${currentSession.literatureReview}

用户研究：
${currentSession.userInsights}

设计概念：
${concept.description}

概念评估：
${concept.critiques.join('\n')}

原型设计：
${concept.prototype || '未提供'}

用户体验评估：
${concept.evaluation || '未提供'}`;
    
    const output = await callAPI(prompt, DESIGN_AGENT_PROMPTS.paper_writing, true);
    
    const updatedConcept = { ...concept, description: output };
    setCurrentConcept(updatedConcept);
    setSession(prev => prev ? {
      ...prev,
      concepts: prev.concepts.map(c => c.id === concept.id ? updatedConcept : c),
      topConcepts: [concept.id]
    } : null);
    
    addLog('✅ Paper Writing Agent: 完成研究论文撰写');
  };

  const runWorkflow = async () => {
    if (!problemStatement || !domain) {
      setError('请填写设计领域和设计问题');
      return;
    }

    setIsRunning(true);
    setError(null);
    setLogs([]);
    setActiveTab('research');

    const newSession: DesignResearchSession = {
      id: `session_${Date.now()}`,
      title: title || '设计研究项目',
      domain,
      problemStatement,
      targetUsers,
      designContext,
      constraints: constraints ? constraints.split('\n').filter(c => c.trim()) : [],
      concepts: [],
      topConcepts: [],
      literatureReview: '',
      userInsights: '',
      iteration: 0,
      maxIterations: 3,
      state: 'initial',
      startedAt: new Date()
    };
    setSession(newSession);

    try {
      await runProblemFramingPhase();
      await delay(500);
      
      await runLiteratureReviewPhase();
      await delay(500);
      
      await runUserResearchPhase();
      await delay(500);
      
      await runIdeationPhase();
      await delay(500);
      
      await runConceptEvaluationPhase();
      await delay(500);
      
      await runPrototypeDesignPhase();
      await delay(500);
      
      await runUXEvaluationPhase();
      await delay(500);
      
      await runPaperWritingPhase();
      
      updateState('completed');
      addLog('🎉 设计研究流程完成！');
      
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
    setCurrentConcept(null);
    setLogs([]);
    setError(null);
    setIsRunning(false);
    setActiveTab('config');
  };

  const getStateColor = (state: DesignWorkflowState) => {
    const colors: Record<DesignWorkflowState, string> = {
      initial: 'bg-gray-100 text-gray-600',
      problem_framing: 'bg-blue-100 text-blue-600',
      literature_review: 'bg-amber-100 text-amber-600',
      user_research: 'bg-purple-100 text-purple-600',
      ideation: 'bg-yellow-100 text-yellow-600',
      concept_evaluation: 'bg-indigo-100 text-indigo-600',
      prototype_design: 'bg-cyan-100 text-cyan-600',
      ux_evaluation: 'bg-pink-100 text-pink-600',
      paper_writing: 'bg-green-100 text-green-600',
      completed: 'bg-emerald-100 text-emerald-600',
      error: 'bg-red-100 text-red-600'
    };
    return colors[state];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Palette className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI4DesignResearch
            </h1>
          </div>
          <p className="text-muted-foreground">设计学 + 人工智能 交叉学科自动化研究系统</p>
          <p className="text-xs text-muted-foreground mt-1">
            融合 InternAgent · AI-Scientist · STORM · GPT-Researcher 核心架构
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              研究配置
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2" disabled={!session}>
              <Brain className="w-4 h-4" />
              研究过程
            </TabsTrigger>
            <TabsTrigger value="output" className="flex items-center gap-2" disabled={!session?.concepts.length}>
              <FileText className="w-4 h-4" />
              研究成果
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    设计研究配置
                  </CardTitle>
                  <CardDescription>定义设计研究问题和背景</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">研究标题</Label>
                    <Input
                      id="title"
                      placeholder="例如：基于AI的智能设计辅助系统研究"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">设计领域 *</Label>
                    <Input
                      id="domain"
                      placeholder="例如：交互设计、服务设计、产品设计、视觉设计"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="problemStatement">设计问题陈述 *</Label>
                    <Textarea
                      id="problemStatement"
                      placeholder="描述你想要解决的设计问题，例如：如何利用AI技术提升设计师的创意工作效率？"
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      rows={4}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetUsers">目标用户</Label>
                    <Textarea
                      id="targetUsers"
                      placeholder="描述目标用户群体，例如：专业设计师、设计学生、产品经理等"
                      value={targetUsers}
                      onChange={(e) => setTargetUsers(e.target.value)}
                      rows={2}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designContext">设计背景</Label>
                    <Textarea
                      id="designContext"
                      placeholder="描述设计背景和应用场景"
                      value={designContext}
                      onChange={(e) => setDesignContext(e.target.value)}
                      rows={2}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="constraints">约束条件</Label>
                    <Textarea
                      id="constraints"
                      placeholder="每行一个约束条件，例如技术限制、时间限制等"
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      rows={2}
                      disabled={isRunning}
                    />
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    {!isRunning ? (
                      <Button onClick={runWorkflow} className="flex-1" disabled={!problemStatement || !domain}>
                        <Play className="w-4 h-4 mr-2" />
                        启动设计研究
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

              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    研究流程架构
                  </CardTitle>
                  <CardDescription>基于多项目融合的设计研究工作流</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-1">问题界定阶段</h4>
                      <p className="text-sm text-blue-600">明确设计问题、范围和利益相关者</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <h4 className="font-medium text-amber-700 mb-1">调研分析阶段</h4>
                      <p className="text-sm text-amber-600">文献调研 + 用户研究双轨并行</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-700 mb-1">设计创新阶段</h4>
                      <p className="text-sm text-purple-600">创意生成 → 概念评估 → 迭代优化</p>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <h4 className="font-medium text-cyan-700 mb-1">原型设计阶段</h4>
                      <p className="text-sm text-cyan-600">交互原型设计 + 用户体验评估</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-1">论文撰写阶段</h4>
                      <p className="text-sm text-green-600">自动生成符合学术规范的研究论文</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <h4 className="font-medium mb-2">🎯 核心特性</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 设计学 + AI 交叉学科专属优化</li>
                      <li>• 多智能体协同研究架构</li>
                      <li>• 用户研究驱动的创新设计</li>
                      <li>• 自动化论文撰写与评估</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      工作流状态
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(DESIGN_WORKFLOW_STATES).map(([key, value]) => {
                        const stateKey = key as DesignWorkflowState;
                        const isActive = session?.state === stateKey;
                        const stateOrder = Object.keys(DESIGN_WORKFLOW_STATES).indexOf(session?.state || 'initial');
                        const currentStateOrder = Object.keys(DESIGN_WORKFLOW_STATES).indexOf(key);
                        const isPast = stateOrder > currentStateOrder;
                        
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      执行日志
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900 text-green-400 rounded-md p-3 text-xs font-mono max-h-64 overflow-y-auto">
                      {logs.length > 0 ? (
                        logs.map((log, i) => <div key={i}>{log}</div>)
                      ) : (
                        <div className="text-gray-500">等待开始...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
                          {DESIGN_WORKFLOW_STATES[session.state].label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        迭代 {session.iteration} / {session.maxIterations}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence mode="wait">
                        {currentConcept && (
                          <motion.div
                            key={currentConcept.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                          >
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                {session.state === 'problem_framing' ? '问题界定' : 
                                 session.state === 'literature_review' ? '文献调研' :
                                 session.state === 'user_research' ? '用户研究' :
                                 session.state === 'ideation' ? '设计概念' :
                                 session.state === 'concept_evaluation' ? '概念评估' :
                                 session.state === 'prototype_design' ? '原型设计' :
                                 session.state === 'ux_evaluation' ? '体验评估' :
                                 session.state === 'paper_writing' || session.state === 'completed' ? '研究论文' : '研究内容'}
                              </h4>
                              <ScrollArea className="h-[500px]">
                                <div className="bg-slate-50 rounded-md p-4 text-sm whitespace-pre-wrap">
                                  {currentConcept.description}
                                </div>
                              </ScrollArea>
                            </div>

                            {currentConcept.critiques.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-purple-500" />
                                  评估反馈
                                </h4>
                                <div className="bg-purple-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                                  {currentConcept.critiques.join('\n\n')}
                                </div>
                              </div>
                            )}

                            {currentConcept.prototype && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <PenTool className="w-4 h-4 text-cyan-500" />
                                  原型设计
                                </h4>
                                <div className="bg-cyan-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                                  {currentConcept.prototype}
                                </div>
                              </div>
                            )}

                            {currentConcept.evaluation && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-pink-500" />
                                  体验评估
                                </h4>
                                <div className="bg-pink-50 rounded-md p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                                  {currentConcept.evaluation}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                )}

                {session && session.literatureReview && session.state !== 'problem_framing' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-500" />
                        文献调研
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="bg-amber-50 rounded-md p-3 text-sm whitespace-pre-wrap">
                          {session.literatureReview}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {session && session.userInsights && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        用户研究
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="bg-purple-50 rounded-md p-3 text-sm whitespace-pre-wrap">
                          {session.userInsights}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-6">
            {session && session.state === 'completed' && currentConcept && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    研究论文
                  </CardTitle>
                  <CardDescription>自动生成的设计研究论文</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="prose prose-sm max-w-none p-4 bg-white rounded-lg">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {currentConcept.description}
                      </pre>
                    </div>
                  </ScrollArea>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(currentConcept.description);
                    }}>
                      复制论文
                    </Button>
                    <Button variant="outline">
                      导出 Markdown
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AI4DesignResearch;
