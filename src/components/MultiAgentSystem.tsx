import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Users, Lightbulb, Eye, Zap, Code, 
  MessageSquare, Send, Loader2, CheckCircle, XCircle, 
  Bot, User, Sparkles, Workflow, Settings, Play, 
  Pause, RotateCcw, ChevronRight, FileText, Palette, 
  Ruler, ClipboardCheck, Crown, GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getModelForScenario } from '@/config/api';

// ==================== 类型定义 ====================

type AgentRole = 'requirements' | 'concept' | 'detail' | 'evaluator' | 'manager';
type WorkflowMode = 'copilot' | 'autopilot';
type WorkflowStage = 'idle' | 'requirements' | 'concept' | 'detail' | 'evaluation' | 'completed';

interface Agent {
  id: AgentRole;
  name: string;
  title: string;
  description: string;
  systemPrompt: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  capabilities: string[];
  outputFormat: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  agentId?: AgentRole;
  agentName?: string;
  timestamp: Date;
  isError?: boolean;
  stage?: WorkflowStage;
}

interface WorkflowState {
  mode: WorkflowMode;
  currentStage: WorkflowStage;
  stages: {
    requirements: { completed: boolean; output: string };
    concept: { completed: boolean; output: string };
    detail: { completed: boolean; output: string };
    evaluation: { completed: boolean; output: string };
  };
  isRunning: boolean;
}

// ==================== 智能体配置 ====================

const agents: Agent[] = [
  {
    id: 'manager',
    name: '协同主控',
    title: 'Manager / Orchestrator',
    description: '负责任务拆解、路由调度和流程控制，协调各智能体协同工作',
    systemPrompt: `你是协同主控（Manager/Orchestrator），是多智能体设计团队的指挥官。

## 核心职责：
1. **任务分析**：理解用户的设计需求，判断任务复杂度
2. **流程规划**：决定采用单节点模式还是全流程协同模式
3. **任务分发**：将任务分配给合适的智能体
4. **进度监控**：跟踪各阶段完成情况
5. **质量控制**：确保输出质量符合标准

## 工作模式：
- **Copilot模式**：用户主导，在特定环节呼叫特定智能体
- **Autopilot模式**：智能体团队接管全流程，自动完成从需求到评估的完整设计流程

## 输出要求：
- 清晰说明当前采用的工作模式
- 列出任务执行计划和各阶段负责人
- 在阶段转换时提供简要说明`,
    icon: <Crown className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    capabilities: ['任务调度', '流程控制', '质量监控'],
    outputFormat: '任务计划与阶段说明'
  },
  {
    id: 'requirements',
    name: '需求分析师',
    title: 'Requirements Analyst',
    description: '与用户对话澄清需求，提取关键设计约束，输出标准化需求文档',
    systemPrompt: `你是需求分析师（Requirements Analyst），是设计流程的第一道关卡。

## 核心职责：
1. **需求澄清**：通过提问澄清模糊需求
2. **约束提取**：识别目标人群、使用场景、核心功能、文化背景等关键约束
3. **文档化**：输出标准化的《设计需求文档》

## 分析维度：
- **用户画像**：目标用户年龄、职业、使用习惯
- **使用场景**：何时、何地、如何使用
- **功能需求**：必须实现的核心功能
- **情感需求**：用户期望的情感体验
- **技术约束**：材料、工艺、成本限制
- **文化因素**：地域文化、审美偏好

## 输出格式：
请按以下结构输出《设计需求文档》：

# 设计需求文档

## 1. 项目概述
- 产品名称/类型
- 设计目标

## 2. 用户画像
- 目标人群特征
- 用户需求分析

## 3. 使用场景
- 主要使用场景描述
- 环境条件

## 4. 功能需求
- 核心功能列表
- 优先级排序

## 5. 设计约束
- 技术约束
- 成本约束
- 文化约束

## 6. 成功标准
- 如何衡量设计成功`,
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    capabilities: ['需求挖掘', '用户研究', '文档撰写'],
    outputFormat: '《设计需求文档》'
  },
  {
    id: 'concept',
    name: '概念设计师',
    title: 'Conceptual Designer',
    description: '基于需求进行头脑风暴，提出3-5个设计方向，生成概念描述和视觉建议',
    systemPrompt: `你是概念设计师（Conceptual Designer），负责将需求转化为创意概念。

## 核心职责：
1. **创意发散**：基于需求文档进行头脑风暴
2. **方案生成**：提出3-5个不同的设计方向
3. **概念描述**：每个方案包含设计理念、形态描述、创新点
4. **视觉建议**：提供色彩、材质、风格的建议

## 设计方法：
- **类比法**：从自然、艺术、文化中汲取灵感
- **组合法**：将不同元素创新组合
- **极端法**：考虑极端使用场景
- **反思维**：挑战常规设计假设

## 输出格式：
请按以下结构输出概念方案：

# 概念设计方案

## 方案一：[名称]
### 设计理念
[核心设计思想]

### 形态描述
[外观、结构描述]

### 创新亮点
[独特之处]

### 视觉风格
- 色彩建议
- 材质建议
- 造型语言

## 方案二：[名称]
...

## 方案三：[名称]
...

## 方案对比
| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| 方案一 | ... | ... | ... |
| 方案二 | ... | ... | ... |
| 方案三 | ... | ... | ... |`,
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    capabilities: ['创意生成', '概念发展', '视觉构思'],
    outputFormat: '《概念设计方案》（含3-5个方向）'
  },
  {
    id: 'detail',
    name: '细节设计师',
    title: 'Detail / Engineering Designer',
    description: '将概念具象化，细化材质、尺寸、人机工程、CMF等详细规格',
    systemPrompt: `你是细节设计师（Detail/Engineering Designer），负责将概念转化为可执行的设计方案。

## 核心职责：
1. **规格细化**：确定具体尺寸、比例、结构
2. **CMF设计**：色彩、材料、表面处理方案
3. **人机工程**：握持方式、操作逻辑、舒适度
4. **工程可行性**：制造工艺、装配方式、成本控制

## 设计细节：
- **尺寸规格**：长×宽×高，关键尺寸标注
- **结构设计**：内部结构、连接方式
- **材料选择**：主体材料、辅助材料、环保考量
- **表面处理**：质感、纹理、涂层
- **交互细节**：按钮、接口、反馈机制

## 输出格式：
请按以下结构输出详细设计规格：

# 详细设计规格书

## 1. 总体规格
- 产品尺寸：长×宽×高（mm）
- 产品重量：约xx克
- 主要材料：xxx

## 2. 形态细节
### 整体造型
[详细描述]

### 关键尺寸
- 部件A：xxx mm
- 部件B：xxx mm

## 3. CMF方案
### 色彩方案
- 主色：xxx（ Pantone xxx ）
- 辅色：xxx（ Pantone xxx ）
- 点缀色：xxx

### 材料清单
| 部件 | 材料 | 工艺 | 质感 |
|------|------|------|------|
| 外壳 | ... | ... | ... |
| 按键 | ... | ... | ... |

### 表面处理
[详细描述]

## 4. 人机工程
- 握持方式
- 操作逻辑
- 舒适度分析

## 5. 工程说明
- 制造工艺
- 装配流程
- 成本估算`,
    icon: <Ruler className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    capabilities: ['详细设计', 'CMF设计', '工程实现'],
    outputFormat: '《详细设计规格书》'
  },
  {
    id: 'evaluator',
    name: '方案评估专家',
    title: 'Design Evaluator',
    description: '基于需求对设计方案进行多维度评估，提出修改建议和优化方向',
    systemPrompt: `你是方案评估专家（Design Evaluator），是设计质量的把关者。

## 核心职责：
1. **多维度评估**：从可行性、美学、用户体验等角度评估
2. **需求对齐**：检查设计是否符合初始需求
3. **问题识别**：发现潜在问题和改进空间
4. **优化建议**：提出具体的修改建议

## 评估维度：
- **需求符合度**：是否满足功能、情感、文化需求
- **技术可行性**：制造难度、成本控制
- **美学质量**：视觉吸引力、设计一致性
- **用户体验**：易用性、舒适度、情感连接
- **创新性**：差异化程度、竞争优势
- **可持续性**：环保性、生命周期

## 评分标准（1-10分）：
- 9-10分：优秀，可直接采用
- 7-8分：良好，需小幅优化
- 5-6分：及格，需较大改进
- 1-4分：不及格，需重新设计

## 输出格式：
请按以下结构输出评估报告：

# 设计方案评估报告

## 1. 评估概述
- 评估对象：[设计方案名称]
- 评估依据：《设计需求文档》

## 2. 多维度评分
| 维度 | 得分 | 权重 | 加权得分 | 说明 |
|------|------|------|----------|------|
| 需求符合度 | x/10 | 25% | x | ... |
| 技术可行性 | x/10 | 20% | x | ... |
| 美学质量 | x/10 | 20% | x | ... |
| 用户体验 | x/10 | 20% | x | ... |
| 创新性 | x/10 | 15% | x | ... |
| **总分** | - | - | **x/10** | - |

## 3. 优点分析
1. ...
2. ...

## 4. 问题识别
1. **问题**：...
   **影响**：...
   **建议**：...

## 5. 优化建议
### 高优先级
- ...

### 中优先级
- ...

### 低优先级
- ...

## 6. 总体结论
[是否通过评估，下一步建议]`,
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    capabilities: ['设计评估', '质量把控', '优化建议'],
    outputFormat: '《设计方案评估报告》'
  }
];

// ==================== API配置 ====================

const API_SERVICES = {
  'qwen35': {
    name: '阿里云 Qwen3.5',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      'qwen3.5-flash-2026-02-23',
      'qwen3.5-plus-2026-02-15',
      'qwen3.5-plus',
      'qwen3.5-35b-a3b',
      'qwen3.5-27b',
      'qwen3.5-122b-a10b',
      'qwen3.5-397b-a17b'
    ],
    defaultModel: 'qwen3.5-flash-2026-02-23',
    description: '阿里云 Qwen3.5 系列模型，免费额度 1,000,000 tokens/模型',
    modelInfo: {
      'qwen3.5-flash-2026-02-23': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 1 },
      'qwen3.5-plus-2026-02-15': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 2 },
      'qwen3.5-plus': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 3 },
      'qwen3.5-35b-a3b': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 4 },
      'qwen3.5-27b': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 5 },
      'qwen3.5-122b-a10b': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 6 },
      'qwen3.5-397b-a17b': { quota: 1000000, used: 0, expiry: '2026/12/31', status: 'active', priority: 7 }
    }
  }
};

const DEFAULT_SERVICE = 'qwen35';
const DEFAULT_MODEL = 'qwen3.5-flash-2026-02-23';

// ==================== 主组件 ====================

const MultiAgentSystem: React.FC = () => {
  // 基础状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('sk-8c277633f58644eab6f4fe91f2d8e53f');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedService, setSelectedService] = useState('qwen35');
  // 群智创新使用大参数模型，需要高级推理能力
  const [selectedModel, setSelectedModel] = useState(() => getModelForScenario('swarmInnovation'));
  
  // 工作流状态
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('copilot');
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    mode: 'copilot',
    currentStage: 'idle',
    stages: {
      requirements: { completed: false, output: '' },
      concept: { completed: false, output: '' },
      detail: { completed: false, output: '' },
      evaluation: { completed: false, output: '' }
    },
    isRunning: false
  });
  
  // 选中的智能体（Copilot模式）
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到底部（只在消息容器内滚动，不影响整个页面）
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // 初始加载时滚动到底部（只滚动消息容器，不滚动整个页面）
  useEffect(() => {
    // 延迟一小段时间确保 DOM 已经渲染
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, []);

  // 可用的模型列表（按优先级排序）
  const getAvailableModels = () => {
    const service = API_SERVICES[selectedService];
    if (!service || !service.modelInfo) return service?.models || [];
    
    return service.models.filter(model => {
      const info = service.modelInfo[model];
      return info && info.status === 'active' && info.quota > info.used;
    });
  };

  // 获取下一个可用的模型
  const getNextModel = (currentModel: string) => {
    const availableModels = getAvailableModels();
    const currentIndex = availableModels.indexOf(currentModel);
    
    // 尝试下一个模型
    if (currentIndex < availableModels.length - 1) {
      return availableModels[currentIndex + 1];
    }
    
    // 如果当前是最后一个，回到第一个（如果至少有两个模型）
    if (availableModels.length > 1 && currentIndex === availableModels.length - 1) {
      return availableModels[0];
    }
    
    return null;
  };

  // 延迟函数
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // 调用大模型API（带智能重试和模型切换）
  const callLLM = async (
    agent: Agent, 
    userMessage: string, 
    conversationHistory: Message[],
    onRetry?: (message: string) => void
  ): Promise<string> => {
    if (!apiKey) {
      throw new Error('请先设置API密钥');
    }

    const service = API_SERVICES[selectedService];
    if (!service) {
      throw new Error('选择的服务不存在');
    }

    let currentModel = selectedModel;
    let attempts = 0;
    const maxAttempts = 3; // 每个模型最多尝试3次
    const modelSwitchAttempts = 2; // 最多切换2次模型
    let modelSwitchCount = 0;
    const triedModels: string[] = [];

    while (modelSwitchCount <= modelSwitchAttempts) {
      attempts = 0;
      
      while (attempts < maxAttempts) {
        try {
          console.log(`[尝试 ${attempts + 1}/${maxAttempts}] 智能体: ${agent.name}, 模型: ${currentModel}`);
          
          const messages = [
            { role: 'system', content: agent.systemPrompt },
            ...conversationHistory.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ];
          
          let apiEndpoint = service.baseUrl;
          if (!apiEndpoint.endsWith('/chat/completions')) {
            apiEndpoint = `${apiEndpoint}/chat/completions`;
          }
          
          // 动态超时：第一次45秒，第二次60秒，第三次75秒
          const timeoutDuration = 45000 + (attempts * 15000);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
          
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: currentModel,
              messages: messages,
              temperature: 0.7,
              max_tokens: 4000
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          console.log('API响应状态:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || errorData.message || `HTTP错误: ${response.status}`;
            
            // 如果是额度用完的错误，直接切换模型
            if (errorMsg.includes('quota') || errorMsg.includes('额度') || errorMsg.includes('limit')) {
              throw new Error(`MODEL_QUOTA_EXHAUSTED:${errorMsg}`);
            }
            
            throw new Error(errorMsg);
          }
          
          const data = await response.json();
          
          if (data.choices && data.choices[0] && data.choices[0].message) {
            // 成功，更新选中的模型
            if (currentModel !== selectedModel) {
              setSelectedModel(currentModel);
              onRetry?.(`✅ 已自动切换到模型: ${currentModel}`);
            }
            return data.choices[0].message.content;
          } else if (data.output && data.output.text) {
            if (currentModel !== selectedModel) {
              setSelectedModel(currentModel);
              onRetry?.(`✅ 已自动切换到模型: ${currentModel}`);
            }
            return data.output.text;
          } else {
            throw new Error('无法解析API响应格式');
          }
          
        } catch (error) {
          clearTimeout(undefined as any); // 清理可能存在的超时
          
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          console.error(`[尝试 ${attempts + 1}] 错误:`, errorMessage);
          
          // 检查是否是额度用完的错误
          if (errorMessage.startsWith('MODEL_QUOTA_EXHAUSTED:')) {
            const nextModel = getNextModel(currentModel);
            if (nextModel && !triedModels.includes(nextModel)) {
              triedModels.push(currentModel);
              currentModel = nextModel;
              modelSwitchCount++;
              const switchMsg = `⚠️ 模型 ${triedModels[triedModels.length - 1]} 额度已用完，自动切换到: ${currentModel}`;
              console.log(switchMsg);
              onRetry?.(switchMsg);
              break; // 跳出内层循环，使用新模型重试
            } else {
              throw new Error('所有可用模型额度都已用完，请购买配额或更换API密钥');
            }
          }
          
          // 检查是否是超时错误
          if (errorMessage.includes('timeout') || errorMessage.includes('超时') || error.name === 'AbortError') {
            attempts++;
            
            if (attempts < maxAttempts) {
              // 指数退避：1秒、2秒、4秒
              const backoffDelay = Math.pow(2, attempts - 1) * 1000;
              const retryMsg = `⏱️ 正在努力思考中，耐心等待哦 (${attempts}/${maxAttempts})...`;
              console.log(retryMsg);
              onRetry?.(retryMsg);
              await delay(backoffDelay);
              continue;
            } else {
              // 当前模型重试次数用完，尝试切换模型
              const nextModel = getNextModel(currentModel);
              if (nextModel && !triedModels.includes(nextModel) && modelSwitchCount < modelSwitchAttempts) {
                triedModels.push(currentModel);
                currentModel = nextModel;
                modelSwitchCount++;
                const switchMsg = `🔄 模型 ${triedModels[triedModels.length - 1]} 响应超时，自动切换到: ${currentModel}`;
                console.log(switchMsg);
                onRetry?.(switchMsg);
                break; // 跳出内层循环，使用新模型重试
              } else {
                throw new Error(`API请求多次超时，已尝试模型: ${triedModels.join(', ') || currentModel}。请检查网络连接或稍后重试`);
              }
            }
          }
          
          // 其他错误（非超时、非额度问题）
          attempts++;
          if (attempts < maxAttempts) {
            const backoffDelay = Math.pow(2, attempts - 1) * 1000;
            const retryMsg = `⚠️ 请求失败: ${errorMessage}，${backoffDelay/1000}秒后重试...`;
            console.log(retryMsg);
            onRetry?.(retryMsg);
            await delay(backoffDelay);
          } else {
            // 尝试切换模型
            const nextModel = getNextModel(currentModel);
            if (nextModel && !triedModels.includes(nextModel) && modelSwitchCount < modelSwitchAttempts) {
              triedModels.push(currentModel);
              currentModel = nextModel;
              modelSwitchCount++;
              const switchMsg = `🔄 模型 ${triedModels[triedModels.length - 1]} 请求失败，自动切换到: ${currentModel}`;
              console.log(switchMsg);
              onRetry?.(switchMsg);
              break;
            } else {
              throw new Error(`请求失败: ${errorMessage}。已尝试模型: ${triedModels.join(', ') || currentModel}`);
            }
          }
        }
      }
      
      // 如果内层循环正常结束（非break），说明成功或已用尽所有尝试
      if (attempts >= maxAttempts && modelSwitchCount >= modelSwitchAttempts) {
        break;
      }
    }
    
    throw new Error(`所有模型尝试均失败。已尝试: ${triedModels.join(', ') || currentModel}`);
  };

  // 添加消息
  const addMessage = (content: string, sender: 'user' | 'agent' | 'system', agentId?: AgentRole, stage?: WorkflowStage) => {
    const agent = agentId ? agents.find(a => a.id === agentId) : null;
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      agentId,
      agentName: agent?.name,
      timestamp: new Date(),
      stage
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // 逐步显示消息内容
  const typeMessage = async (content: string, sender: 'user' | 'agent' | 'system', agentId?: AgentRole, stage?: WorkflowStage) => {
    const agent = agentId ? agents.find(a => a.id === agentId) : null;
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 先添加一个空消息
    const newMessage: Message = {
      id: messageId,
      content: '',
      sender,
      agentId,
      agentName: agent?.name,
      timestamp: new Date(),
      stage
    };
    setMessages(prev => [...prev, newMessage]);
    
    // 逐字显示内容
    let typedContent = '';
    const typingSpeed = 30; // 打字速度，毫秒/字符
    
    for (let i = 0; i < content.length; i++) {
      typedContent += content[i];
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, content: typedContent } : msg
        )
      );
      
      // 每添加一个字符后，滚动到消息末尾（使用 ref）
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    
    // 最终滚动到消息末尾（使用 ref）
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
    return newMessage;
  };

  // Copilot模式：与单个智能体对话
  const handleCopilotChat = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!selectedAgent) {
      setError('请先选择一个智能体');
      return;
    }

    const userContent = inputValue;
    addMessage(userContent, 'user');
    setTimeout(() => scrollToBottom(), 0); // 滚动到底部
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const agent = agents.find(a => a.id === selectedAgent)!;
      
      // 使用回调函数显示重试信息
      const response = await callLLM(
        agent, 
        userContent, 
        messages,
        (retryMsg) => {
          // 显示重试/切换信息（不阻塞）
          addMessage(retryMsg, 'system', 'manager');
        }
      );
      
      await typeMessage(response, 'agent', selectedAgent);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '发送消息失败';
      setError(errorMsg);
      addMessage(`❌ ${errorMsg}`, 'system');
    } finally {
      setIsLoading(false);
    }
  };

  // Autopilot模式：全流程自动协同
  const runAutopilotWorkflow = async (initialRequirement: string) => {
    setWorkflowState(prev => ({ ...prev, isRunning: true, currentStage: 'requirements' }));
    
    // 创建重试回调函数
    const onRetry = (retryMsg: string) => {
      addMessage(retryMsg, 'system', 'manager');
    };
    
    // Stage 1: 需求分析
    addMessage('🚀 启动全流程自动协同模式', 'system', 'manager', 'requirements');
    addMessage('正在将任务分发给需求分析师...', 'system', 'manager', 'requirements');
    
    try {
      const requirementsAgent = agents.find(a => a.id === 'requirements')!;
      const requirementsOutput = await callLLM(
        requirementsAgent, 
        `请分析以下设计需求并输出《设计需求文档》：\n\n${initialRequirement}`, 
        [],
        onRetry
      );
      
      await typeMessage(requirementsOutput, 'agent', 'requirements', 'requirements');
      setWorkflowState(prev => ({
        ...prev,
        stages: { ...prev.stages, requirements: { completed: true, output: requirementsOutput } },
        currentStage: 'concept'
      }));

      // Stage 2: 概念设计
      addMessage('✅ 需求分析完成，正在分发给概念设计师...', 'system', 'manager', 'concept');
      
      const conceptAgent = agents.find(a => a.id === 'concept')!;
      const conceptOutput = await callLLM(
        conceptAgent,
        `基于以下需求文档，请生成《概念设计方案》（包含3-5个设计方向）：\n\n${requirementsOutput}`,
        [],
        onRetry
      );
      
      await typeMessage(conceptOutput, 'agent', 'concept', 'concept');
      setWorkflowState(prev => ({
        ...prev,
        stages: { ...prev.stages, concept: { completed: true, output: conceptOutput } },
        currentStage: 'detail'
      }));

      // Stage 3: 细节设计
      addMessage('✅ 概念设计完成，正在分发给细节设计师...', 'system', 'manager', 'detail');
      
      const detailAgent = agents.find(a => a.id === 'detail')!;
      const detailOutput = await callLLM(
        detailAgent,
        `基于以下概念设计方案，请输出《详细设计规格书》：\n\n${conceptOutput}`,
        [],
        onRetry
      );
      
      await typeMessage(detailOutput, 'agent', 'detail', 'detail');
      setWorkflowState(prev => ({
        ...prev,
        stages: { ...prev.stages, detail: { completed: true, output: detailOutput } },
        currentStage: 'evaluation'
      }));

      // Stage 4: 方案评估
      addMessage('✅ 细节设计完成，正在分发给方案评估专家...', 'system', 'manager', 'evaluation');
      
      const evaluatorAgent = agents.find(a => a.id === 'evaluator')!;
      const evaluationOutput = await callLLM(
        evaluatorAgent,
        `请基于初始需求对以下设计方案进行评估，输出《设计方案评估报告》：\n\n初始需求：\n${initialRequirement}\n\n设计方案：\n${detailOutput}`,
        [],
        onRetry
      );
      
      await typeMessage(evaluationOutput, 'agent', 'evaluator', 'evaluation');
      setWorkflowState(prev => ({
        ...prev,
        stages: { ...prev.stages, evaluation: { completed: true, output: evaluationOutput } },
        currentStage: 'completed',
        isRunning: false
      }));
      
      addMessage('🎉 全流程协同设计完成！请查看各阶段的输出结果。', 'system', 'manager', 'completed');
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '工作流执行失败';
      setError(errorMsg);
      addMessage(`❌ 工作流中断：${errorMsg}`, 'system');
      setWorkflowState(prev => ({ ...prev, isRunning: false }));
    }
  };

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (workflowMode === 'autopilot') {
      // Autopilot模式：启动全流程
      const userContent = inputValue;
      addMessage(userContent, 'user');
      setInputValue('');
      await runAutopilotWorkflow(userContent);
    } else {
      // Copilot模式：单智能体对话
      await handleCopilotChat();
    }
  };

  // 重置工作流
  const resetWorkflow = () => {
    setWorkflowState({
      mode: workflowMode,
      currentStage: 'idle',
      stages: {
        requirements: { completed: false, output: '' },
        concept: { completed: false, output: '' },
        detail: { completed: false, output: '' },
        evaluation: { completed: false, output: '' }
      },
      isRunning: false
    });
    setMessages([]);
    setError(null);
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // 获取当前智能体
  const getCurrentAgent = () => {
    if (workflowMode === 'copilot' && selectedAgent) {
      return agents.find(a => a.id === selectedAgent);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">多智能体协同设计系统</h1>
          <p className="text-muted-foreground">Multi-Agent Collaborative Design System</p>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：智能体列表和工作流控制 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* 工作流模式切换 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  工作流模式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">{workflowMode === 'copilot' ? 'Copilot 模式' : 'Autopilot 模式'}</span>
                      <span className="text-xs text-muted-foreground">
                        {workflowMode === 'copilot' ? '单智能体协作' : '全流程自动协同'}
                      </span>
                    </div>
                    <Switch
                      checked={workflowMode === 'autopilot'}
                      onCheckedChange={(checked) => {
                        setWorkflowMode(checked ? 'autopilot' : 'copilot');
                        resetWorkflow();
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  {workflowMode === 'copilot' ? (
                    <p className="text-xs text-muted-foreground">
                      选择下方智能体进行一对一协作，在特定环节获得专业支持
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      输入设计需求，智能体团队将自动完成从需求到评估的完整流程
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 智能体列表 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">智能体团队</CardTitle>
                <CardDescription>
                  {workflowMode === 'copilot' ? '选择一个智能体进行对话' : '查看团队成员'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {agents.filter(a => a.id !== 'manager').map((agent) => (
                  <Card 
                    key={agent.id}
                    className={`cursor-pointer transition-all ${
                      workflowMode === 'copilot' && selectedAgent === agent.id 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'hover:border-primary/50'
                    } ${workflowMode === 'autopilot' ? 'opacity-60 cursor-default' : ''}`}
                    onClick={() => workflowMode === 'copilot' && setSelectedAgent(agent.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${agent.bgColor} ${agent.color} flex items-center justify-center shrink-0`}>
                          {agent.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{agent.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{agent.title}</p>
                          {workflowMode === 'copilot' && selectedAgent === agent.id && (
                            <Badge variant="secondary" className="mt-1 text-xs">已选择</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* 工作流进度 */}
            {workflowMode === 'autopilot' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    工作流进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { key: 'requirements', label: '需求分析', icon: FileText },
                      { key: 'concept', label: '概念设计', icon: Lightbulb },
                      { key: 'detail', label: '细节设计', icon: Ruler },
                      { key: 'evaluation', label: '方案评估', icon: ClipboardCheck }
                    ].map(({ key, label, icon: Icon }) => {
                      const stage = workflowState.stages[key as keyof typeof workflowState.stages];
                      const isActive = workflowState.currentStage === key;
                      const isCompleted = stage.completed;
                      
                      return (
                        <div 
                          key={key}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            isActive ? 'bg-primary/10 border border-primary/30' : ''
                          } ${isCompleted ? 'opacity-70' : ''}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isActive 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3 h-3" />}
                          </div>
                          <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{label}</span>
                          {isActive && workflowState.isRunning && (
                            <Loader2 className="w-3 h-3 animate-spin ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {workflowState.currentStage === 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={resetWorkflow}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      开始新任务
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* 右侧：对话区域 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  对话
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  设置
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-4">
                <Card className="h-[calc(100vh-180px)] flex flex-col overflow-hidden">
                  {/* 头部信息 */}
                  <CardHeader className="flex flex-row items-center justify-between py-4 shrink-0 border-b">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {workflowMode === 'copilot' ? (
                          getCurrentAgent() ? (
                            <>
                              <span className={`w-8 h-8 rounded-lg ${getCurrentAgent()?.bgColor} ${getCurrentAgent()?.color} flex items-center justify-center`}>
                                {getCurrentAgent()?.icon}
                              </span>
                              与{getCurrentAgent()?.name}对话
                            </>
                          ) : (
                            <>
                              <Bot className="w-5 h-5" />
                              请选择智能体
                            </>
                          )
                        ) : (
                          <>
                            <Workflow className="w-5 h-5" />
                            全流程自动协同
                          </>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {workflowMode === 'copilot' 
                          ? (getCurrentAgent()?.description || '请先选择左侧的智能体')
                          : '输入设计需求，智能体团队将自动完成全流程设计'
                        }
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {workflowMode === 'autopilot' && workflowState.isRunning && (
                        <Badge variant="secondary" className="animate-pulse">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          执行中
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" onClick={clearChat}>
                        清空
                      </Button>
                    </div>
                  </CardHeader>

                  {/* 消息列表区域 */}
                  <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-4 py-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">
                            {workflowMode === 'copilot' ? '开始与智能体对话' : '启动全流程设计'}
                          </p>
                          <p className="text-sm max-w-md mx-auto">
                            {workflowMode === 'copilot' 
                              ? '选择左侧的智能体，描述您的设计需求或问题'
                              : '输入您的设计需求，例如："设计一款融入中医文化的儿童辅助推拿仪，外观亲和，缓解儿童的医疗恐惧"'
                            }
                          </p>
                        </div>
                      )}

                      {messages.map((message) => {
                        const agent = message.agentId ? agents.find(a => a.id === message.agentId) : null;
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[90%] p-4 rounded-2xl ${
                                message.sender === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : message.isError
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : message.sender === 'system'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-muted border'
                              }`}
                              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            >
                              {/* 智能体标识 */}
                              {message.sender === 'agent' && agent && (
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                                  <div className={`w-7 h-7 rounded-lg ${agent.bgColor} ${agent.color} flex items-center justify-center`}>
                                    {agent.icon}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">{agent.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{agent.title}</span>
                                  </div>
                                  {message.stage && (
                                    <Badge variant="outline" className="ml-auto text-xs">
                                      {message.stage === 'requirements' && '需求分析'}
                                      {message.stage === 'concept' && '概念设计'}
                                      {message.stage === 'detail' && '细节设计'}
                                      {message.stage === 'evaluation' && '方案评估'}
                                      {message.stage === 'completed' && '已完成'}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              {/* 系统消息标识 */}
                              {message.sender === 'system' && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Crown className="w-4 h-4 text-amber-600" />
                                  <span className="text-sm font-medium">协同主控</span>
                                </div>
                              )}
                              
                              {/* 消息内容 */}
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                              </div>
                              
                              {/* 时间戳 */}
                              <div className="text-xs opacity-60 mt-2 text-right">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-4 rounded-2xl flex items-center gap-3 border">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <div>
                              <span className="text-sm font-medium">智能体思考中...</span>
                              <p className="text-xs text-muted-foreground">
                                {workflowMode === 'autopilot' && workflowState.currentStage !== 'idle' && (
                                  <>当前阶段：{workflowState.currentStage === 'requirements' && '需求分析'}
                                    {workflowState.currentStage === 'concept' && '概念设计'}
                                    {workflowState.currentStage === 'detail' && '细节设计'}
                                    {workflowState.currentStage === 'evaluation' && '方案评估'}</>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* 输入区域 */}
                  <div className="shrink-0 p-4 border-t bg-card">
                    <div className="flex gap-3">
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          workflowMode === 'copilot'
                            ? (selectedAgent 
                                ? `向${agents.find(a => a.id === selectedAgent)?.name}描述您的设计需求...`
                                : '请先选择左侧的智能体')
                            : '描述您的设计需求，智能体团队将自动完成全流程设计...'
                        }
                        className="flex-1 min-h-[90px] resize-none"
                        disabled={workflowMode === 'copilot' && !selectedAgent}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={handleSendMessage}
                          disabled={
                            isLoading || 
                            !inputValue.trim() || 
                            (workflowMode === 'copilot' && !selectedAgent) ||
                            (workflowMode === 'autopilot' && workflowState.isRunning)
                          }
                          className="h-full px-6"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : workflowMode === 'autopilot' ? (
                            <Play className="w-5 h-5" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        按 Enter 发送，Shift + Enter 换行
                      </p>
                      {workflowMode === 'autopilot' && (
                        <p className="text-xs text-muted-foreground">
                          Autopilot模式将依次执行：需求分析 → 概念设计 → 细节设计 → 方案评估
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>系统设置</CardTitle>
                    <CardDescription>配置智能体系统的参数</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">API密钥</label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="请输入通义千问 API密钥..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        您的API密钥仅存储在本地浏览器中
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">模型选择</label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择模型" />
                        </SelectTrigger>
                        <SelectContent>
                          {API_SERVICES[selectedService].models.map(model => {
                            const modelInfo = API_SERVICES[selectedService].modelInfo?.[model];
                            let statusText = '';
                            let statusClass = '';
                            
                            if (modelInfo) {
                              if (modelInfo.status === 'inactive') {
                                statusText = '(无免费额度)';
                                statusClass = 'text-red-500';
                              } else if (modelInfo.quota > modelInfo.used) {
                                const remaining = modelInfo.quota - modelInfo.used;
                                statusText = `(剩余: ${remaining.toLocaleString()})`;
                                statusClass = 'text-green-500';
                              } else {
                                statusText = '(额度已用完)';
                                statusClass = 'text-yellow-500';
                              }
                            }
                            
                            return (
                              <SelectItem key={model} value={model}>
                                <div className="flex justify-between items-center">
                                  <span>{model}</span>
                                  {statusText && (
                                    <span className={`text-xs ${statusClass} ml-2`}>
                                      {statusText}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">智能体说明</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {agents.filter(a => a.id !== 'manager').map(agent => (
                          <div key={agent.id} className="flex items-start gap-2">
                            <div className={`w-5 h-5 rounded ${agent.bgColor} ${agent.color} flex items-center justify-center shrink-0 mt-0.5`}>
                              {agent.icon}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">{agent.name}</span>
                              <span className="text-xs ml-2">{agent.title}</span>
                              <p className="text-xs mt-0.5">{agent.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">使用说明</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li><strong>Copilot模式</strong>：选择单个智能体进行一对一协作，适合特定环节的专业咨询</li>
                        <li><strong>Autopilot模式</strong>：输入需求后，智能体团队自动完成从需求分析到方案评估的完整流程</li>
                        <li>每个智能体都有详细的系统提示词，确保输出质量</li>
                        <li>工作流执行过程中可以实时查看各阶段的输出结果</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MultiAgentSystem;
