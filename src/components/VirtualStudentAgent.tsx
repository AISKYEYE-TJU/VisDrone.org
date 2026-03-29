import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Send, Loader2, User, Bot, 
  Settings, Brain, Sparkles, Code, Eye, 
  Zap, Palette, Ruler, ClipboardCheck
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
import { TeamMember } from '@/lib/index';
import { getModelForScenario } from '@/config/api';

// ==================== 类型定义 ====================

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  isError?: boolean;
}

interface VirtualStudentAgentProps {
  student: TeamMember;
}

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

// ==================== 智能体系统提示配置 ====================

const getSystemPromptForStudent = (student: TeamMember): string => {
  const { name, title, researchInterests, bio } = student;
  
  return `你是${name}，${title}，隶属于人机协同设计实验室（HAI Lab）。

## 个人简介
${bio}

## 研究兴趣
${researchInterests.join('、')}

## 核心职责
作为${title}，你专注于${researchInterests[0]}等领域的研究。

## 交互风格
- 专业但友好
- 提供详细而有见地的回答
- 结合你的专业知识给出具体建议
- 鼓励创新思维和跨学科合作

## 输出要求
- 回答要基于你的专业背景
- 提供具体的例子和建议
- 保持语言清晰易懂
- 展现你在相关领域的专业知识`;
};

// ==================== 主组件 ====================

const VirtualStudentAgent: React.FC<VirtualStudentAgentProps> = ({ student }) => {
  // 基础状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('sk-8c277633f58644eab6f4fe91f2d8e53f');
  // 虚拟智能体对话使用中等模型，平衡性能和自然交互
  const [selectedModel, setSelectedModel] = useState(() => getModelForScenario('virtualAgent'));
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedService, setSelectedService] = useState('qwen35');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始加载时滚动到底部
  useEffect(() => {
    scrollToBottom();
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
          console.log(`[尝试 ${attempts + 1}/${maxAttempts}] 智能体: ${student.name}, 模型: ${currentModel}`);
          
          const messages = [
            { role: 'system', content: getSystemPromptForStudent(student) },
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
  const addMessage = (content: string, sender: 'user' | 'agent' | 'system') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // 逐步显示消息内容
  const typeMessage = async (content: string, sender: 'user' | 'agent' | 'system') => {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 先添加一个空消息
    const newMessage: Message = {
      id: messageId,
      content: '',
      sender,
      timestamp: new Date()
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
      
      // 每添加一个字符后，滚动到消息末尾
      setTimeout(() => {
        const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 0);
      
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    
    // 最终滚动到消息末尾
    setTimeout(() => {
      const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 0);
    
    return newMessage;
  };

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue;
    addMessage(userContent, 'user');
    scrollToBottom(); // 滚动到底部
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // 使用回调函数显示重试信息
      const response = await callLLM(
        userContent, 
        messages,
        (retryMsg) => {
          // 显示重试/切换信息（不阻塞）
          addMessage(retryMsg, 'system');
        }
      );
      
      await typeMessage(response, 'agent');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '发送消息失败';
      setError(errorMsg);
      addMessage(`❌ ${errorMsg}`, 'system');
    } finally {
      setIsLoading(false);
    }
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // 获取智能体图标
  const getAgentIcon = () => {
    const { researchInterests } = student;
    
    if (researchInterests.includes('生成式AI') || researchInterests.includes('创意生成')) {
      return <Sparkles className="w-5 h-5" />;
    } else if (researchInterests.includes('人机交互') || researchInterests.includes('用户体验')) {
      return <Eye className="w-5 h-5" />;
    } else if (researchInterests.includes('计算机视觉') || researchInterests.includes('视觉设计')) {
      return <Palette className="w-5 h-5" />;
    } else if (researchInterests.includes('创意编程') || researchInterests.includes('代码')) {
      return <Code className="w-5 h-5" />;
    } else if (researchInterests.includes('群智设计') || researchInterests.includes('协作系统')) {
      return <Brain className="w-5 h-5" />;
    } else if (researchInterests.includes('详细设计') || researchInterests.includes('CMF设计')) {
      return <Ruler className="w-5 h-5" />;
    } else if (researchInterests.includes('设计评估') || researchInterests.includes('质量把控')) {
      return <ClipboardCheck className="w-5 h-5" />;
    } else {
      return <Zap className="w-5 h-5" />;
    }
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
          <h1 className="text-3xl font-bold mb-2">与{student.name}对话</h1>
          <p className="text-muted-foreground">{student.title}</p>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：学生信息 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* 学生信息卡片 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  智能体信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img 
                      src={student.image} 
                      alt={student.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-1">{student.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{student.title}</p>
                  {student.nameEn && (
                    <p className="text-xs text-muted-foreground">{student.nameEn}</p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">研究兴趣</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.researchInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">个人简介</h4>
                    <p className="text-sm text-muted-foreground">
                      {student.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          {getAgentIcon()}
                        </span>
                        与{student.name}对话
                      </CardTitle>
                      <CardDescription>
                        {student.bio}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={clearChat}>
                        清空
                      </Button>
                    </div>
                  </CardHeader>

                  {/* 消息列表区域 */}
                  <div className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-4 py-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">
                            开始与{student.name}对话
                          </p>
                          <p className="text-sm max-w-md mx-auto">
                            询问关于{student.researchInterests[0]}等相关领域的问题，或请求专业建议
                          </p>
                        </div>
                      )}

                      {messages.map((message) => (
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
                            {message.sender === 'agent' && (
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                  {getAgentIcon()}
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{student.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{student.title}</span>
                                </div>
                              </div>
                            )}
                            
                            {/* 系统消息标识 */}
                            {message.sender === 'system' && (
                              <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium">系统</span>
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
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-4 rounded-2xl flex items-center gap-3 border">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <div>
                              <span className="text-sm font-medium">{student.name}思考中...</span>
                              <p className="text-xs text-muted-foreground">
                                正在处理您的问题，请稍候...
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
                        placeholder={`向${student.name}描述您的问题或需求...`}
                        className="flex-1 min-h-[90px] resize-none"
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
                          disabled={isLoading || !inputValue.trim()}
                          className="h-full px-6"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
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
                      <p className="text-xs text-muted-foreground mt-2">
                        根据{student.name}的专业领域，推荐选择合适的模型
                      </p>
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

export default VirtualStudentAgent;