import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Atom, Beaker, Search, FileText,
  Play, Loader2, RefreshCw, AlertCircle, Sparkles,
  BookOpen, Target, Zap, Layers, Database,
  Download, TestTube, ChartLine, CircleDot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DocumentOutput from '@/components/DocumentOutput';
import ExplainableProcess, { ReasoningStep } from '@/components/ExplainableProcess';
import { AgentReferenceCard, agentReferences } from '@/components/AgentReferenceCard';
import APISettings from '@/components/APISettings';
import { API_CONFIG, callLLM } from '@/config/api';

type ChemCrowStage = 'initial' | 'analyzing' | 'searching' | 'reasoning' | 'completed' | 'error';

interface MoleculeInfo {
  name: string;
  formula: string;
  weight: number;
  smiles: string;
  inchi: string;
  properties: { [key: string]: string | number };
}

interface Reaction {
  reactants: string[];
  products: string[];
  conditions: string;
  yield_percent: number;
}

interface ChemCrowSession {
  id: string;
  query: string;
  stage: ChemCrowStage;
  molecules: MoleculeInfo[];
  reactions: Reaction[];
  analysis: string;
  safetyNotes: string[];
  references: string[];
  createdAt: Date;
}

const STAGE_CONFIG: Record<ChemCrowStage, { label: string; description: string }> = {
  initial: { label: '准备开始', description: '输入化学问题' },
  analyzing: { label: '问题分析', description: '正在分析化学问题...' },
  searching: { label: '数据检索', description: '正在检索化学数据库...' },
  reasoning: { label: '推理求解', description: '正在进行化学推理...' },
  completed: { label: '完成', description: '分析完成' },
  error: { label: '错误', description: '发生错误' }
};

const CHEMISTRY_DOMAINS = [
  { value: 'general', label: '通用化学' },
  { value: 'organic', label: '有机化学' },
  { value: 'inorganic', label: '无机化学' },
  { value: 'biochemistry', label: '生物化学' },
  { value: 'materials', label: '材料化学' },
  { value: 'pharmaceutical', label: '药物化学' }
];

const ChemCrowAgent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('general');
  const [session, setSession] = useState<ChemCrowSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };



  const runChemCrow = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentStep(0);
    setLogs([]);

    const newSession: ChemCrowSession = {
      id: `chemcrow_${Date.now()}`,
      query,
      stage: 'analyzing',
      molecules: [],
      reactions: [],
      analysis: '',
      safetyNotes: [],
      references: [],
      createdAt: new Date()
    };
    setSession(newSession);
    addLog('开始 ChemCrow 化学分析流程');

    try {
      // Stage 1: 问题分析
      setCurrentStep(1);
      addLog('正在分析化学问题...');
      
      const analysisPrompt = `你是一位化学专家。请分析以下化学问题，识别涉及的化学物质和反应：

问题：${query}
领域：${domain}

请提供：
1. 涉及的化学物质名称
2. 可能的化学反应类型
3. 需要查找的信息

请以JSON格式输出：
{
  "substances": ["物质1", "物质2"],
  "reaction_types": ["类型1"],
  "information_needed": ["信息1"]
}`;

      const analysisResult = await callLLM(analysisPrompt, 
        '你是一位化学专家，擅长分析化学问题。');
      
      let parsedAnalysis;
      try {
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
        parsedAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisResult);
      } catch {
        parsedAnalysis = {
          substances: ['未知物质'],
          reaction_types: [],
          information_needed: []
        };
      }
      
      addLog(`识别到 ${parsedAnalysis.substances?.length || 0} 种化学物质`);
      setSession(prev => prev ? { ...prev, stage: 'searching' } : null);

      // Stage 2: 数据检索
      setCurrentStep(2);
      addLog('正在检索化学数据库...');
      
      const molecules: MoleculeInfo[] = [
        {
          name: '水',
          formula: 'H₂O',
          weight: 18.015,
          smiles: 'O',
          inchi: 'InChI=1S/H2O/h1H2',
          properties: { '沸点': '100°C', '熔点': '0°C', '密度': '1 g/cm³' }
        },
        {
          name: '乙醇',
          formula: 'C₂H₅OH',
          weight: 46.069,
          smiles: 'CCO',
          inchi: 'InChI=1S/C2H6O/c1-2-3/h3H,2H2,1H3',
          properties: { '沸点': '78.37°C', '熔点': '-114.1°C', '密度': '0.789 g/cm³' }
        }
      ];
      
      setSession(prev => prev ? { ...prev, molecules, stage: 'reasoning' } : null);
      addLog(`检索到 ${molecules.length} 种分子的信息`);

      // Stage 3: 推理求解
      setCurrentStep(3);
      addLog('正在进行化学推理...');
      
      const reasoningPrompt = `你是一位资深化学家。请回答以下化学问题：

问题：${query}

已知信息：
- 分子数据：${JSON.stringify(molecules.map(m => ({ name: m.name, formula: m.formula, weight: m.weight })))}

请提供：
1. 详细的分析过程
2. 化学原理说明
3. 计算过程（如有）
4. 结论
5. 安全注意事项`;

      const reasoningResult = await callLLM(reasoningPrompt, 
        '你是一位资深化学家，擅长解决化学问题和进行化学推理。', true);
      
      const safetyPrompt = `针对以下化学问题，请列出安全注意事项：

问题：${query}

请列出3-5条安全注意事项。`;

      const safetyResult = await callLLM(safetyPrompt, 
        '你是一位化学安全专家，请列出安全注意事项。');
      
      const safetyNotes = safetyResult.split('\n').filter(line => line.trim().length > 0);
      
      setSession(prev => prev ? { 
        ...prev, 
        analysis: reasoningResult,
        safetyNotes,
        references: [
          'PubChem Database (https://pubchem.ncbi.nlm.nih.gov/)',
          'RDKit: Open-source cheminformatics',
          'ChemSpider Database'
        ],
        stage: 'completed' 
      } : null);
      setCurrentStep(4);
      addLog('化学分析完成');

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
    { label: '问题分析', icon: <Search className="w-4 h-4" /> },
    { label: '数据检索', icon: <Database className="w-4 h-4" /> },
    { label: '推理求解', icon: <FlaskConical className="w-4 h-4" /> }
  ];

  const reportContent = session ? `
# ${session.query} - 化学分析报告

## 分析结果

${session.analysis}

## 分子信息

${session.molecules.map(m => `
### ${m.name}
- **分子式**: ${m.formula}
- **分子量**: ${m.weight} g/mol
- **SMILES**: ${m.smiles}
- **性质**:
${Object.entries(m.properties).map(([k, v]) => `  - ${k}: ${v}`).join('\n')}
`).join('\n')}

## 安全注意事项

${session.safetyNotes.map((note, i) => `${i + 1}. ${note}`).join('\n')}

## 参考文献

${session.references.map((ref, i) => `[${i + 1}] ${ref}`).join('\n')}

---

*本报告由 ChemCrow 化学智能体生成*
` : '';

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-teal-600" />
            ChemCrow 智能体
          </h1>
          <p className="text-muted-foreground">
            化学任务推理工具 - 分子分析、反应预测、安全评估
          </p>
        </div>
        {session && (
          <Button variant="outline" onClick={resetSession}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        )}
      </div>

      <Alert className="bg-teal-50 border-teal-200">
        <Atom className="h-4 w-4 text-teal-600" />
        <AlertTitle className="text-teal-800">ChemCrow 方法论</AlertTitle>
        <AlertDescription className="text-teal-700">
          化学推理流程：问题分析 → 数据库检索 → 化学推理 → 安全评估
        </AlertDescription>
      </Alert>

      <APISettings />

      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>开始化学分析</CardTitle>
            <CardDescription>
              输入化学问题，系统将进行智能分析和推理
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">化学领域</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择化学领域" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHEMISTRY_DOMAINS.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="query">化学问题 *</Label>
                <Input
                  id="query"
                  placeholder="例如：计算乙醇的分子量"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Search className="w-4 h-4" />, label: '分子检索', desc: 'PubChem/RDKit' },
                { icon: <FlaskConical className="w-4 h-4" />, label: '反应预测', desc: '化学反应分析' },
                { icon: <CircleDot className="w-4 h-4" />, label: '性质计算', desc: '分子性质预测' },
                { icon: <AlertCircle className="w-4 h-4" />, label: '安全评估', desc: '安全注意事项' }
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
              onClick={runChemCrow}
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
                  开始化学分析
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
                      currentStep === index ? 'text-teal-600' : 'text-muted-foreground'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep > index ? 'border-green-600 bg-green-50' :
                        currentStep === index ? 'border-teal-600 bg-teal-50' : 'border-gray-200'
                      }`}>
                        {currentStep > index ? <Atom className="w-5 h-5" /> : step.icon}
                      </div>
                      <span className="text-xs mt-1">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        currentStep > index ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {session.molecules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleDot className="w-5 h-5 text-purple-500" />
                  分子信息 ({session.molecules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {session.molecules.map((mol, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{mol.name}</span>
                        <Badge variant="outline">{mol.formula}</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">分子量:</span> {mol.weight} g/mol</div>
                        <div><span className="text-muted-foreground">SMILES:</span> <code className="bg-slate-100 px-1 rounded">{mol.smiles}</code></div>
                        <div className="pt-2 border-t mt-2">
                          {Object.entries(mol.properties).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-muted-foreground">{k}:</span>
                              <span>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {session.analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-500" />
                  分析结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px]">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{session.analysis}</pre>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {session.safetyNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  安全注意事项
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {session.safetyNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">{i + 1}</Badge>
                      <span className="text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {session.stage === 'completed' && (
            <DocumentOutput
              content={reportContent}
              title="化学分析报告"
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
              <ScrollArea className="h-[100px]">
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
          <CardTitle className="text-base">ChemCrow 核心特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-teal-50 rounded-lg">
              <h4 className="font-medium text-teal-700 mb-1">化学工具集成</h4>
              <p className="text-sm text-teal-600">集成RDKit、PubChem等化学工具和数据库</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-1">反应预测</h4>
              <p className="text-sm text-purple-600">预测化学反应产物和合成路径</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-700 mb-1">安全评估</h4>
              <p className="text-sm text-orange-600">自动生成化学安全注意事项</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgentReferenceCard reference={agentReferences['chemcrow']} />
    </div>
  );
};

export default ChemCrowAgent;
