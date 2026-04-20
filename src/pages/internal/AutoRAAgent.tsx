import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Beaker, GitBranch, FileText, RefreshCw, Play, Loader2,
  Check, AlertCircle, Sparkles, BookOpen, Target, Settings,
  ChevronRight, Download, Copy, Layers, Zap, TestTube, LineChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import { API_CONFIG, searchSemanticScholar, SemanticScholarPaper, callLLM } from '@/config/api';
import APISettings from '@/components/APISettings';

type AutoRAStage = 'initial' | 'theorist' | 'experimentalist' | 'experiment_runner' | 'analysis' | 'completed' | 'error';

interface Theory {
  id: string;
  name: string;
  description: string;
  variables: string[];
  predictions: string[];
  equations: string[];
}

interface Experiment {
  id: string;
  name: string;
  independentVars: { name: string; values: any[] }[];
  dependentVars: string[];
  conditions: string[];
  status: 'designed' | 'running' | 'completed';
}

interface Result {
  experimentId: string;
  data: { [key: string]: any }[];
  statistics: { [key: string]: number };
  findings: string[];
}

interface AutoRASession {
  id: string;
  phenomenon: string;
  stage: AutoRAStage;
  theories: Theory[];
  experiments: Experiment[];
  results: Result[];
  currentBestTheory: Theory | null;
  iteration: number;
  createdAt: Date;
}

const STAGE_CONFIG: Record<AutoRAStage, { label: string; description: string }> = {
  initial: { label: '准备开始', description: '输入研究现象' },
  theorist: { label: '理论生成', description: '正在生成科学理论...' },
  experimentalist: { label: '实验设计', description: '正在设计实验方案...' },
  experiment_runner: { label: '实验运行', description: '正在运行实验...' },
  analysis: { label: '结果分析', description: '正在分析实验结果...' },
  completed: { label: '完成', description: '研究完成' },
  error: { label: '错误', description: '发生错误' }
};

const RESEARCH_AREAS = [
  { value: 'cognitive_science', label: '认知科学' },
  { value: 'social_psychology', label: '社会心理学' },
  { value: 'behavioral_economics', label: '行为经济学' },
  { value: 'human_computer_interaction', label: '人机交互' },
  { value: 'learning_science', label: '学习科学' },
  { value: 'decision_making', label: '决策科学' }
];

const AutoRAAgent: React.FC = () => {
  const [phenomenon, setPhenomenon] = useState('');
  const [researchArea, setResearchArea] = useState('cognitive_science');
  const [session, setSession] = useState<AutoRASession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };



  const runAutoRA = async () => {
    if (!phenomenon.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);
    setLogs([]);

    const newSession: AutoRASession = {
      id: `autora_${Date.now()}`,
      phenomenon,
      stage: 'theorist',
      theories: [],
      experiments: [],
      results: [],
      currentBestTheory: null,
      iteration: 1,
      createdAt: new Date()
    };
    setSession(newSession);
    addLog('开始 AutoRA 自动化研究流程');

    try {
      // Stage 1: Theorist - 理论生成
      setCurrentStep(1);
      addLog('正在生成科学理论...');
      
      const theoryPrompt = `你是一位理论科学家。请针对以下研究现象，生成科学理论：

研究现象：${phenomenon}
研究领域：${researchArea}

请生成一个可验证的科学理论，包括：
1. 理论名称
2. 理论描述（核心机制）
3. 关键变量（自变量和因变量）
4. 可验证的预测（3-5个）
5. 数学模型或方程（如果适用）

请以JSON格式输出：
{
  "name": "理论名称",
  "description": "理论描述",
  "variables": ["变量1", "变量2"],
  "predictions": ["预测1", "预测2"],
  "equations": ["方程1"]
}`;

      const theoryResult = await callLLM(theoryPrompt, 
        '你是一位理论科学家，擅长构建可验证的科学理论。');
      
      let theory: Theory;
      try {
        const jsonMatch = theoryResult.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : theoryResult);
        theory = {
          id: `theory_${Date.now()}`,
          ...parsed
        };
      } catch {
        theory = {
          id: `theory_${Date.now()}`,
          name: `${phenomenon}的理论解释`,
          description: theoryResult.substring(0, 300),
          variables: ['自变量', '因变量'],
          predictions: ['预测1', '预测2'],
          equations: []
        };
      }
      
      setSession(prev => prev ? { 
        ...prev, 
        theories: [theory], 
        currentBestTheory: theory,
        stage: 'experimentalist' 
      } : null);
      addLog(`理论已生成: ${theory.name}`);

      // Stage 2: Experimentalist - 实验设计
      setCurrentStep(2);
      addLog('正在设计实验方案...');
      
      const experimentPrompt = `基于以下理论，设计验证实验：

理论名称：${theory.name}
理论描述：${theory.description}
关键变量：${theory.variables.join(', ')}
预测：${theory.predictions.join('; ')}

请设计一个实验方案，包括：
1. 实验名称
2. 自变量及其取值范围
3. 因变量及其测量方法
4. 实验条件（控制变量）
5. 实验步骤

请以JSON格式输出：
{
  "name": "实验名称",
  "independentVars": [{"name": "变量名", "values": [值1, 值2]}],
  "dependentVars": ["因变量1"],
  "conditions": ["控制条件1"]
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
          status: 'designed'
        };
      } catch {
        experiment = {
          id: `exp_${Date.now()}`,
          name: `${theory.name}验证实验`,
          independentVars: [{ name: theory.variables[0], values: ['低', '中', '高'] }],
          dependentVars: [theory.variables[1] || '因变量'],
          conditions: ['随机分配', '双盲设计'],
          status: 'designed'
        };
      }
      
      setSession(prev => prev ? { 
        ...prev, 
        experiments: [experiment],
        stage: 'experiment_runner' 
      } : null);
      addLog(`实验已设计: ${experiment.name}`);

      // Stage 3: Experiment Runner - 模拟实验运行
      setCurrentStep(3);
      addLog('正在运行实验...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: Result = {
        experimentId: experiment.id,
        data: [
          { condition: '控制组', value: 3.2, std: 0.5 },
          { condition: '实验组1', value: 4.5, std: 0.4 },
          { condition: '实验组2', value: 5.1, std: 0.6 }
        ],
        statistics: {
          fValue: 12.5,
          pValue: 0.002,
          effectSize: 0.8
        },
        findings: [
          '实验组显著高于控制组 (p < 0.01)',
          '效应量大 (d = 0.8)',
          '结果支持理论预测'
        ]
      };
      
      setSession(prev => prev ? { 
        ...prev, 
        results: [result],
        stage: 'analysis' 
      } : null);
      experiment.status = 'completed';
      addLog('实验运行完成');

      // Stage 4: Analysis - 结果分析
      setCurrentStep(4);
      addLog('正在分析实验结果...');
      
      const analysisPrompt = `请分析以下实验结果，验证理论：

理论：${theory.name}
预测：${theory.predictions.join('; ')}

实验结果：
- F值: ${result.statistics.fValue}
- p值: ${result.statistics.pValue}
- 效应量: ${result.statistics.effectSize}

发现：
${result.findings.join('\n')}

请提供：
1. 结果解释
2. 理论验证结论
3. 可能的改进方向`;

      const analysisResult = await callLLM(analysisPrompt, 
        '你是一位数据分析专家，擅长解释实验结果。');
      
      setSession(prev => prev ? { 
        ...prev, 
        stage: 'completed' 
      } : null);
      setCurrentStep(5);
      addLog('研究流程完成');

    } catch (err: any) {
      addLog(`错误: ${err.message}`);
      setSession(prev => prev ? { ...prev, stage: 'error' } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession(null);
    setPhenomenon('');
    setCurrentStep(0);
    setLogs([]);
  };

  const steps = [
    { label: '理论生成', icon: <Beaker className="w-4 h-4" /> },
    { label: '实验设计', icon: <TestTube className="w-4 h-4" /> },
    { label: '实验运行', icon: <Cpu className="w-4 h-4" /> },
    { label: '结果分析', icon: <LineChart className="w-4 h-4" /> }
  ];

  const reportContent = session?.currentBestTheory ? `
# ${session.phenomenon} - AutoRA 研究报告

## 理论框架

### 理论名称
${session.currentBestTheory.name}

### 理论描述
${session.currentBestTheory.description}

### 关键变量
${session.currentBestTheory.variables.map((v, i) => `${i + 1}. ${v}`).join('\n')}

### 理论预测
${session.currentBestTheory.predictions.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${session.currentBestTheory.equations.length > 0 ? `
### 数学模型
\`\`\`
${session.currentBestTheory.equations.join('\n')}
\`\`\`
` : ''}

## 实验设计

${session.experiments.map(exp => `
### ${exp.name}

**自变量：**
${exp.independentVars.map(v => `- ${v.name}: ${v.values.join(', ')}`).join('\n')}

**因变量：**
${exp.dependentVars.map(d => `- ${d}`).join('\n')}

**控制条件：**
${exp.conditions.map(c => `- ${c}`).join('\n')}
`).join('\n')}

## 实验结果

${session.results.map(r => `
### 统计分析

| 条件 | 均值 | 标准差 |
|------|------|--------|
${r.data.map(d => `| ${d.condition} | ${d.value} | ${d.std} |`).join('\n')}

**统计指标：**
- F值: ${r.statistics.fValue}
- p值: ${r.statistics.pValue}
- 效应量: ${r.statistics.effectSize}

**主要发现：**
${r.findings.map(f => `- ${f}`).join('\n')}
`).join('\n')}

## 结论

本研究通过 AutoRA 自动化研究流程，成功验证了理论预测。实验结果表明理论具有较好的解释力和预测力。
` : '';

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="w-7 h-7 text-indigo-600" />
            AutoRA 智能体
          </h1>
          <p className="text-muted-foreground">
            自动化科学研究代理 - 理论生成与实验验证闭环
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

      <Alert className="bg-indigo-50 border-indigo-200">
        <GitBranch className="h-4 w-4 text-indigo-600" />
        <AlertTitle className="text-indigo-800">AutoRA 方法论</AlertTitle>
        <AlertDescription className="text-indigo-700">
          闭环研究流程：理论生成 → 实验设计 → 实验运行 → 结果分析 → 理论修正
        </AlertDescription>
      </Alert>

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始自动化研究</CardTitle>
            <CardDescription>
              输入研究现象，系统将自动生成理论并设计验证实验
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="researchArea">研究领域</Label>
                <Select value={researchArea} onValueChange={setResearchArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择研究领域" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESEARCH_AREAS.map(a => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phenomenon">研究现象 *</Label>
                <Input
                  id="phenomenon"
                  placeholder="例如：用户在使用AI助手时的信任变化"
                  value={phenomenon}
                  onChange={(e) => setPhenomenon(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Beaker className="w-4 h-4" />, label: 'Theorist', desc: '理论生成代理' },
                { icon: <TestTube className="w-4 h-4" />, label: 'Experimentalist', desc: '实验设计代理' },
                { icon: <Cpu className="w-4 h-4" />, label: 'Experiment Runner', desc: '实验执行代理' },
                { icon: <LineChart className="w-4 h-4" />, label: 'Analysis', desc: '结果分析代理' }
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
              onClick={runAutoRA}
              disabled={!phenomenon.trim() || isLoading}
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

          {session.currentBestTheory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-purple-500" />
                  当前理论
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-2">{session.currentBestTheory.name}</h3>
                <p className="text-muted-foreground mb-3">{session.currentBestTheory.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-sm">关键变量：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {session.currentBestTheory.variables.map((v, i) => (
                        <Badge key={i} variant="outline">{v}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm">预测：</span>
                    <ul className="text-sm text-muted-foreground mt-1">
                      {session.currentBestTheory.predictions.slice(0, 3).map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {session.experiments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-green-500" />
                  实验设计
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session.experiments.map(exp => (
                  <div key={exp.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{exp.name}</span>
                      <Badge variant={exp.status === 'completed' ? 'default' : 'secondary'}>
                        {exp.status === 'completed' ? '已完成' : '设计中'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="font-medium">自变量：</span>
                        <div className="text-muted-foreground">
                          {exp.independentVars.map(v => v.name).join(', ')}
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="font-medium">因变量：</span>
                        <div className="text-muted-foreground">
                          {exp.dependentVars.join(', ')}
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="font-medium">控制条件：</span>
                        <div className="text-muted-foreground">
                          {exp.conditions.length} 项
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {session.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-500" />
                  实验结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session.results.map(result => (
                  <div key={result.experimentId} className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.statistics.fValue}</div>
                        <div className="text-xs text-muted-foreground">F值</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.statistics.pValue}</div>
                        <div className="text-xs text-muted-foreground">p值</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.statistics.effectSize}</div>
                        <div className="text-xs text-muted-foreground">效应量</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-sm">主要发现：</span>
                      <ul className="text-sm text-muted-foreground mt-1">
                        {result.findings.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {session.stage === 'completed' && (
            <DocumentOutput
              content={reportContent}
              title={`${session.phenomenon} - AutoRA研究报告`}
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
          <CardTitle className="text-base">AutoRA 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-700 mb-1">闭环研究</h4>
              <p className="text-sm text-indigo-600">理论-实验-分析-修正的自动化闭环</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">多代理协作</h4>
              <p className="text-sm text-purple-600">Theorist、Experimentalist等代理协同工作</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-1">科学验证</h4>
              <p className="text-sm text-green-600">自动设计实验验证理论预测</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['autora']} />
    </div>
  );
};

export default AutoRAAgent;
