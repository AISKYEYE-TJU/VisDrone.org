import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, MessageSquare, Send, Loader2, 
  User, Bot, Brain, Sparkles, Code, Eye, Zap, Palette, 
  Ruler, ClipboardCheck, Plus, X, Settings
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
import { TeamMember } from '@/lib/index';
import { teamMembers } from '@/data/index';
import { getModelForScenario, getFallbackModelsForScenario } from '@/config/api';

// ==================== 类型定义 ====================

interface MeetingMessage {
  id: string;
  content: string;
  sender: 'user' | 'student' | 'virtual';
  senderId: string;
  senderName: string;
  timestamp: Date;
  isError?: boolean;
}

interface GroupMeetingProps {
  // 可选的初始主题
  initialTopic?: string;
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

const getSystemPromptForMeeting = (topic: string, student: TeamMember): string => {
  const { name, title, researchInterests, bio } = student;
  
  return `你是${name}，${title}，隶属于人机协同设计实验室（HAI Lab）。

## 个人简介
${bio}

## 研究兴趣
${researchInterests.join('、')}

## 当前组会
主题：${topic}

## 交互风格
- 积极参与讨论
- 提供专业见解
- 与其他参与者互动
- 鼓励创新思维
- 保持友好但专业的语气

## 输出要求
- 基于当前组会主题和你的专业背景回答
- 提供具体的想法和建议
- 与其他参与者的观点进行互动
- 保持语言清晰易懂`;
};

// ==================== 主组件 ====================

const GroupMeeting: React.FC<GroupMeetingProps> = ({ initialTopic = '设计创新与AI应用' }) => {
  // 基础状态
  const [meetingTopic, setMeetingTopic] = useState(initialTopic);
  const [messages, setMessages] = useState<MeetingMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('sk-8c277633f58644eab6f4fe91f2d8e53f');
  // 组会讨论使用轻量级模型，快速响应
  const [selectedModel, setSelectedModel] = useState(() => getModelForScenario('groupMeeting'));
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('meeting');
  const [selectedService, setSelectedService] = useState('qwen35');
  const [selectedVirtualStudent, setSelectedVirtualStudent] = useState<string>('phd-ai-1');
  const [currentUser, setCurrentUser] = useState<{id: string; name: string; type: 'teacher' | 'student' | 'virtual'}>({id: 'zhao-tianjiao', name: '赵天娇', type: 'teacher'});
  const [discussionRound, setDiscussionRound] = useState(0);
  const [maxDiscussionRounds, setMaxDiscussionRounds] = useState(5);
  const [host, setHost] = useState<{id: string; name: string; type: 'human' | 'agent'}>({id: 'user', name: '我', type: 'human'});
  const [isHostMode, setIsHostMode] = useState(false);
  const [hostQuestions, setHostQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [agentOnlyMode, setAgentOnlyMode] = useState(false);
  const [agentDiscussionRound, setAgentDiscussionRound] = useState(0);
  const [maxAgentDiscussionRounds, setMaxAgentDiscussionRounds] = useState(5);
  const [lastSpeakingAgent, setLastSpeakingAgent] = useState<string | null>(null);
  const [spokenAgents, setSpokenAgents] = useState<string[]>([]);
  const [showAgentSelect, setShowAgentSelect] = useState(false);
  const [atPosition, setAtPosition] = useState(-1);
  const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
  const [typingMessages, setTypingMessages] = useState<Map<string, string>>(new Map());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const agentDiscussionRoundRef = useRef(0);

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

  // 虚拟学生列表
  const virtualStudents = teamMembers.filter(member => 
    member.id.startsWith('phd-ai-') || member.id.startsWith('master-ai-')
  );

  // 真实用户列表（老师和学生）
  const realUsers = teamMembers.filter(member => 
    !member.id.startsWith('phd-ai-') && !member.id.startsWith('master-ai-')
  );

  // 所有参与者列表（移除毕业生）
  const allParticipants = [
    ...realUsers.filter(user => user.role !== 'Alumni'),
    ...virtualStudents
  ];

  // 主持人选项（移除毕业学生）
  const hostOptions = [
    { id: 'user', name: '我', type: 'human' },
    ...realUsers.filter(user => user.role !== 'Alumni').map(user => ({ id: user.id, name: user.name, type: 'human' as const })),
    { id: 'ai-host', name: 'AI 主持人', type: 'agent' }
  ];

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
    student: TeamMember,
    userMessage: string, 
    conversationHistory: MeetingMessage[],
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
            { role: 'system', content: getSystemPromptForMeeting(meetingTopic, student) },
            ...conversationHistory.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: `${msg.senderName}: ${msg.content}`
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
              max_tokens: 2000
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
  const addMessage = (content: string, sender: 'user' | 'student' | 'virtual', senderId: string, senderName: string) => {
    const newMessage: MeetingMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      senderId,
      senderName,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // 逐步显示消息内容
  const typeMessage = async (content: string, sender: 'user' | 'student' | 'virtual', senderId: string, senderName: string) => {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 先添加一个空消息
    const newMessage: MeetingMessage = {
      id: messageId,
      content: '',
      sender,
      senderId,
      senderName,
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

  // 生成讨论总结
  const generateDiscussionSummary = async () => {
    // 检查是否有虚拟智能体
    if (!virtualStudents || virtualStudents.length === 0) {
      addMessage('📝 没有可用的智能体，无法生成总结', 'virtual', 'system', '系统');
      return;
    }
    
    // 提取所有消息内容用于总结
    const allContent = messages
      .map(msg => `${msg.senderName}: ${msg.content}`)
      .join('\n');
    
    // 即使没有内容，也尝试生成总结
    addMessage('📝 正在生成讨论总结...', 'virtual', 'system', '系统');
    
    try {
      // 使用第一个智能体生成总结
      const summaryAgent = virtualStudents[0];
      
      // 准备讨论内容，如果没有内容，使用默认内容
      const discussionContent = allContent || `讨论主题：${meetingTopic}\n\n智能体们进行了讨论，但没有具体内容记录。`;
      
      // 获取当天的真实日期
      const today = new Date().toLocaleDateString('zh-CN');
      
      const summaryPrompt = `请根据以下智能体讨论内容，生成一份详细的总结报告：\n\n讨论主题：${meetingTopic}\n讨论日期：${today}\n\n讨论内容：\n${discussionContent}\n\n总结要求：\n1. 提炼主要观点和共识\n2. 总结讨论中的分歧和争议\n3. 归纳出的结论和建议\n4. 保持语言清晰、结构化\n5. 总结日期必须使用当天的真实日期：${today}`;
      
      const summary = await callLLM(
        summaryAgent,
        summaryPrompt,
        messages, // 传递完整的消息数组
        (retryMsg) => {
          addMessage(retryMsg, 'virtual', 'system', '系统');
        }
      );
      
      await typeMessage(`📝 **讨论总结**\n\n${summary}`, 'virtual', 'system', '系统');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '生成总结失败';
      addMessage(`❌ 生成总结失败：${errorMsg}`, 'virtual', 'system', '系统');
    }
  };

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue;
    addMessage(userContent, currentUser.type === 'teacher' ? 'student' : currentUser.type === 'student' ? 'student' : 'virtual', currentUser.id, currentUser.name);
      setTimeout(() => scrollToBottom(), 0); // 滚动到底部
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // 重置讨论轮数
      setDiscussionRound(1);
      
      // 触发虚拟学生的回复
      await triggerVirtualStudentResponse(userContent);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '发送消息失败';
      setError(errorMsg);
      addMessage(`❌ ${errorMsg}`, 'virtual', 'system', '系统');
    } finally {
      setIsLoading(false);
    }
  };

  // 触发虚拟学生回复
  const triggerVirtualStudentResponse = async (userMessage: string, currentRound: number = 1, initiatorId: string = currentUser.id, participatedAgents: string[] = [], currentAgentId?: string) => {
    if (currentRound > maxDiscussionRounds) {
      addMessage('💡 讨论已达到最大轮数限制，如需继续请重新开始讨论。', 'virtual', 'system', '系统');
      
      // 生成讨论总结
      await generateDiscussionSummary();
      
      return;
    }

    // 获取当前智能体（优先使用传入的agentId，否则使用selectedVirtualStudent）
    const agentId = currentAgentId || selectedVirtualStudent;
    const selectedStudent = virtualStudents.find(student => student.id === agentId);
    if (!selectedStudent) {
      throw new Error('请选择一个虚拟学生');
    }

    // 使用回调函数显示重试信息
    const response = await callLLM(
      selectedStudent,
      userMessage, 
      messages,
      (retryMsg) => {
        // 显示重试/切换信息（不阻塞）
        addMessage(retryMsg, 'virtual', 'system', '系统');
      }
    );
    
    await typeMessage(response, 'virtual', selectedStudent.id, selectedStudent.name);
    setDiscussionRound(currentRound);

    // 检查是否需要邀请其他虚拟智能体参与
    if (currentRound < maxDiscussionRounds) {
      // 提取@的智能体
      const mentionedAgents = extractMentionedAgents(response);
      let nextStudent: any = null;
      
      // 尝试找到@的有效的智能体（不在已参与列表中）
      for (const agentId of mentionedAgents) {
        const foundAgent = virtualStudents.find(s => s.id === agentId && s.id !== selectedStudent.id && !participatedAgents.includes(s.id));
        if (foundAgent) {
          nextStudent = foundAgent;
          break;
        }
      }
      
      // 如果没有@智能体或@的智能体已参与过，选择一个与话题相关且未参与的智能体
      if (!nextStudent) {
        // 过滤掉已参与的智能体
        const availableAgents = virtualStudents.filter(s => s.id !== selectedStudent.id && !participatedAgents.includes(s.id));
        
        if (availableAgents.length > 0) {
          // 根据研究兴趣与话题的相关性排序
          const relevantAgents = availableAgents
            .map(agent => {
              // 简单的相关性计算：研究兴趣与话题的匹配程度
              const relevance = agent.researchInterests.filter(interest => 
                meetingTopic.toLowerCase().includes(interest.toLowerCase())
              ).length;
              return { agent, relevance };
            })
            .sort((a, b) => b.relevance - a.relevance);
          
          // 选择相关性最高的智能体
          nextStudent = relevantAgents[0].agent;
          
          // 生成一个@该智能体的消息
          addMessage(`@${nextStudent.name} 请基于前面的讨论，分享你的观点`, 'virtual', 'system', '系统');
        }
      }
      
      if (nextStudent) {
        // 更新已参与的智能体列表
        const updatedParticipatedAgents = [...participatedAgents, nextStudent.id];
        
        // 切换到选中的智能体
        setSelectedVirtualStudent(nextStudent.id);
        await delay(2000); // 等待2秒，模拟思考时间
        
        // 真正唤起下一个智能体参与讨论
        addMessage(`现在邀请 ${nextStudent.name} 参与讨论...`, 'virtual', 'system', '系统');
        
        // 生成讨论历史摘要
        const recentMessages = messages.slice(-10); // 获取最近10条消息
        const discussionSummary = recentMessages.map(msg => `${msg.senderName}: ${msg.content}`).join('\n');
        
        // 构建接力消息，包含完整的讨论上下文
        const relayMessage = `@${nextStudent.name} 请基于以下讨论内容，分享你的观点和补充：\n\n${discussionSummary}`;
        
        await triggerVirtualStudentResponse(relayMessage, currentRound + 1, selectedStudent.id, updatedParticipatedAgents, nextStudent.id);
      } else {
        // 如果没有其他可用的智能体，结束讨论
        addMessage('💡 没有更多可用的智能体参与讨论。', 'virtual', 'system', '系统');
        
        // 生成讨论总结
        await generateDiscussionSummary();
      }
    }
  };

  // 主持人模式：开始讨论
  const startHostMode = async () => {
    setIsHostMode(true);
    setDiscussionRound(0);
    setCurrentQuestionIndex(0);
    
    // 清空现有消息
    setMessages([]);
    
    // 欢迎消息
    addMessage(`欢迎来到线上组会！今天的主题是：${meetingTopic}`, 'virtual', 'system', '系统');
    
    if (host.type === 'agent') {
      // AI主持人生成讨论问题
      await generateHostQuestions();
    } else {
      // 人类主持人模式
      addMessage(`${host.name} 将主持今天的讨论，请大家积极参与！`, 'virtual', 'system', '系统');
    }
  };

  // 生成主持人问题
  const generateHostQuestions = async () => {
    setIsLoading(true);
    
    try {
      // 创建一个临时的主持人智能体
      const hostAgent = {
        id: 'ai-host',
        name: 'AI 主持人',
        title: '组会主持人',
        bio: '我是一个专门负责组织和引导组会讨论的AI主持人，擅长提出有深度的问题并促进参与者之间的互动。',
        researchInterests: ['讨论引导', '问题设计', '会议管理']
      };

      const systemPrompt = `你是一个专业的组会主持人，负责引导关于"${meetingTopic}"的讨论。

请基于以下要求生成5个高质量的讨论问题：
1. 问题应该与主题紧密相关
2. 问题应该能够激发参与者的思考
3. 问题应该适合不同背景的参与者回答
4. 问题应该有层次感，从基础到深入
5. 每个问题都应该明确指出适合回答的角色（如：设计师、工程师、研究者等）

请以JSON格式返回问题列表，每个问题包含：
- question: 问题内容
- suitableRoles: 适合回答的角色数组
- difficulty: 难度级别（1-5）`;

      const response = await callLLM(
        hostAgent as any,
        systemPrompt,
        [],
        (retryMsg) => {
          addMessage(retryMsg, 'virtual', 'system', '系统');
        }
      );

      // 解析生成的问题
      let questions: string[] = [];
      try {
        const parsed = JSON.parse(response);
        questions = parsed.map((q: any) => q.question);
      } catch {
        // 如果JSON解析失败，尝试提取问题
        const lines = response.split('\n');
        questions = lines.filter((line: string) => line.trim().startsWith('Q:') || line.trim().match(/^\d+\./)).map((line: string) => line.replace(/^Q:|^\d+\./, '').trim());
      }

      if (questions.length === 0) {
        // 默认问题
        questions = [
          `关于"${meetingTopic}"，你认为当前面临的主要挑战是什么？`,
          `在这个领域，你觉得AI可以发挥哪些重要作用？`,
          `有哪些成功的案例可以分享？`,
          `未来发展的趋势是什么？`,
          `我们团队可以在这个方向上做哪些工作？`
        ];
      }

      setHostQuestions(questions);
      addMessage('AI主持人已生成讨论问题，现在开始第一个问题：', 'virtual', 'ai-host', 'AI 主持人');
      await askNextQuestion();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '生成问题失败';
      setError(errorMsg);
      addMessage(`❌ ${errorMsg}`, 'virtual', 'system', '系统');
    } finally {
      setIsLoading(false);
    }
  };

  // 提出下一个问题
  const askNextQuestion = async () => {
    if (currentQuestionIndex < hostQuestions.length) {
      const question = hostQuestions[currentQuestionIndex];
      addMessage(question, 'virtual', 'ai-host', 'AI 主持人');
      
      // 自动分配一个虚拟智能体回答
      if (virtualStudents.length > 0) {
        const assignedStudent = virtualStudents[currentQuestionIndex % virtualStudents.length];
        setSelectedVirtualStudent(assignedStudent.id);
        
        await delay(3000); // 等待3秒，模拟思考时间
        
        // 生成讨论历史摘要
        const recentMessages = messages.slice(-5); // 获取最近5条消息
        const discussionSummary = recentMessages.map(msg => `${msg.senderName}: ${msg.content}`).join('\n');
        
        // 构建包含上下文的消息
        const contextMessage = `请回答以下问题，并参考前面的讨论内容：\n\n问题：${question}\n\n讨论历史：\n${discussionSummary}`;
        
        await triggerVirtualStudentResponse(contextMessage, 1, 'ai-host', [assignedStudent.id], assignedStudent.id);
      }
    } else {
      addMessage('讨论已完成所有问题，感谢大家的参与！', 'virtual', 'ai-host', 'AI 主持人');
      
      // 生成讨论总结
      await generateDiscussionSummary();
      
      setIsHostMode(false);
    }
  };

  // 继续讨论（人类主持人使用）
  const continueDiscussion = async () => {
    if (inputValue.trim()) {
      addMessage(inputValue, host.type === 'human' ? 'student' : 'virtual', host.id, host.name);
      setInputValue('');
      
      // 检查是否包含@智能体
      const mentionedAgents = extractMentionedAgents(inputValue);
      if (mentionedAgents.length > 0) {
        // 回答@的智能体
        for (const agentId of mentionedAgents) {
          const agent = virtualStudents.find(s => s.id === agentId);
          if (agent) {
            setSelectedVirtualStudent(agent.id);
            await delay(2000);
            
            // 生成讨论历史摘要
            const recentMessages = messages.slice(-5); // 获取最近5条消息
            const discussionSummary = recentMessages.map(msg => `${msg.senderName}: ${msg.content}`).join('\n');
            
            // 构建包含上下文的消息
            const contextMessage = `请回答以下问题，并参考前面的讨论内容：\n\n问题：${inputValue}\n\n讨论历史：\n${discussionSummary}`;
            
            // 传递讨论轮数、已参与的智能体列表和当前智能体ID
            await triggerVirtualStudentResponse(contextMessage, 1, host.id, [agent.id], agent.id);
          }
        }
      } else {
        // 自动分配智能体回答
        if (virtualStudents.length > 0) {
          const assignedStudent = virtualStudents[Math.floor(Math.random() * virtualStudents.length)];
          setSelectedVirtualStudent(assignedStudent.id);
          
          await delay(2000);
          
          // 生成讨论历史摘要
          const recentMessages = messages.slice(-5); // 获取最近5条消息
          const discussionSummary = recentMessages.map(msg => `${msg.senderName}: ${msg.content}`).join('\n');
          
          // 构建包含上下文的消息
          const contextMessage = `请回答以下问题，并参考前面的讨论内容：\n\n问题：${inputValue}\n\n讨论历史：\n${discussionSummary}`;
          
          // 传递讨论轮数、已参与的智能体列表和当前智能体ID
          await triggerVirtualStudentResponse(contextMessage, 1, host.id, [assignedStudent.id], assignedStudent.id);
        }
      }
    }
  };

  // 提取@的智能体（支持ID和真实名字）
  const extractMentionedAgents = (message: string): string[] => {
    const mentions = message.match(/@([\w\s-]+)/g) || [];
    const mentionedNames = mentions.map(mention => mention.substring(1).trim());
    
    // 将真实名字转换为ID，只返回实验室内部参会人员
    const agentIds: string[] = [];
    for (const name of mentionedNames) {
      // 检查是否是虚拟智能体
      const agent = virtualStudents.find(s => s.name === name);
      if (agent) {
        agentIds.push(agent.id);
      } else {
        // 检查是否是真实用户
        const realUser = realUsers.find(u => u.name === name);
        if (realUser) {
          agentIds.push(realUser.id);
        }
        // 只添加实验室内部参会人员，不添加不存在的人员
      }
    }
    return agentIds;
  };

  // 开始虚拟智能体自主讨论
  const startAgentOnlyDiscussion = async () => {
    setAgentOnlyMode(true);
    setAgentDiscussionRound(0);
    agentDiscussionRoundRef.current = 0;
    setLastSpeakingAgent(null);
    setSpokenAgents([]);
    
    // 清空现有消息
    setMessages([]);
    
    // 欢迎消息
    addMessage(`开始虚拟智能体自主讨论模式！今天的主题是：${meetingTopic}。智能体们将轮流发言，讨论最多进行5轮。每个智能体不需要@其他智能体，系统会自动安排下一个智能体参与讨论。请每个智能体充分考虑之前的讨论上下文，确保发言连贯且有深度。`, 'virtual', 'system', '系统');
    
    // 开始第一轮讨论
    await startNextAgentDiscussion();
  };

  // 进行下一轮智能体讨论
  const startNextAgentDiscussion = async () => {
    // 如果当前轮数已经达到或超过5轮，直接结束讨论
    if (agentDiscussionRoundRef.current >= 5) {
      addMessage('💡 虚拟智能体自主讨论已达到最大轮数限制（5轮）。讨论已结束，感谢所有智能体的参与！', 'virtual', 'system', '系统');
      
      // 生成讨论总结
      await generateDiscussionSummary();
      
      setAgentOnlyMode(false);
      return;
    }

    // 选择下一个发言的智能体（不重复之前发言过的）
    const availableAgents = virtualStudents.filter(s => !spokenAgents.includes(s.id));
    let nextAgent: any = null;
    
    if (availableAgents.length === 0) {
      // 如果所有智能体都发过言，终止讨论（不重新开始）
      addMessage('💡 所有智能体都已参与过讨论，终止讨论。讨论已结束，感谢所有智能体的参与！', 'virtual', 'system', '系统');
      
      // 生成讨论总结
      await generateDiscussionSummary();
      
      setAgentOnlyMode(false);
      return;
    } else {
      // 随机选择一个未发言的智能体
      nextAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
    }
    
    // 生成一个@该智能体的消息
    addMessage(`@${nextAgent.name} 请开始讨论这个话题`, 'virtual', 'system', '系统');
    
    // 切换到选中的智能体并调用conductAgentDiscussion
    setSelectedVirtualStudent(nextAgent.id);
    await delay(2000); // 等待2秒，模拟思考时间
    await conductAgentDiscussion(nextAgent);
  };

  // 进行智能体讨论
  const conductAgentDiscussion = async (agent: any) => {
    // 检查轮数是否已经达到5轮
    if (agentDiscussionRoundRef.current >= 5) {
      addMessage('💡 虚拟智能体自主讨论已达到最大轮数限制（5轮）。讨论已结束，感谢所有智能体的参与！', 'virtual', 'system', '系统');
      
      // 生成讨论总结
      await generateDiscussionSummary();
      
      setAgentOnlyMode(false);
      return;
    }
    
    // 更新轮数（同时更新state和ref）
    agentDiscussionRoundRef.current += 1;
    setAgentDiscussionRound(agentDiscussionRoundRef.current);
    
    setLastSpeakingAgent(agent.id);
    setSpokenAgents(prev => [...prev, agent.id]);
    
    // 生成讨论内容
    const availableAgents = virtualStudents.filter(s => s.id !== agent.id && !spokenAgents.includes(s.id));
    
    // 生成详细的讨论历史摘要
    const discussionHistory = messages.map(msg => `${msg.senderName}: ${msg.content}`).join('\n');
    
    const systemPrompt = `你是${agent.name}，${agent.title}，隶属于东南大学人机协同设计实验室（HAI Lab）。

## 个人简介
${agent.bio}

## 研究兴趣
${agent.researchInterests.join('、')}

## 当前讨论
主题：${meetingTopic}

## 讨论历史
请仔细阅读并理解以下讨论内容，这将作为你发言的重要依据：
${discussionHistory}

## 任务
请基于当前讨论主题、你的专业背景以及上面的讨论历史，发表你的观点。

## 输出要求
- 充分考虑之前的讨论上下文，确保你的发言与前面的内容连贯
- 基于当前讨论主题和你的专业背景提供深入的分析和见解
- 不需要@其他智能体，系统会自动安排下一个智能体参与讨论
- 保持语言清晰易懂，逻辑连贯`;
    
    try {
      const response = await callLLM(
        agent,
        systemPrompt,
        messages,
        (retryMsg) => {
          addMessage(retryMsg, 'virtual', 'system', '系统');
        }
      );
      
      await typeMessage(response, 'virtual', agent.id, agent.name);
      
      // 检查轮数是否已经达到5轮
      if (agentDiscussionRoundRef.current >= 5) {
        addMessage('💡 虚拟智能体自主讨论已达到最大轮数限制（5轮）。讨论已结束，感谢所有智能体的参与！', 'virtual', 'system', '系统');
        
        // 生成讨论总结
        await generateDiscussionSummary();
        
        setAgentOnlyMode(false);
        return;
      }
      
      // 系统自动选择下一个智能体参与讨论
      let nextAgent: any = null;
      
      // 从可用智能体中选择一个（排除当前已发言的）
      const nextAvailableAgents = virtualStudents.filter(s => s.id !== agent.id && !spokenAgents.includes(s.id));
      if (nextAvailableAgents.length > 0) {
        nextAgent = nextAvailableAgents[Math.floor(Math.random() * nextAvailableAgents.length)];
        // 生成一个@该智能体的消息
        addMessage(`@${nextAgent.name} 请继续讨论这个话题`, 'virtual', 'system', '系统');
      }
      
      if (nextAgent) {
        // 切换到选中的智能体并直接调用conductAgentDiscussion，确保一致性
        setSelectedVirtualStudent(nextAgent.id);
        setLastSpeakingAgent(agent.id);
        await delay(3000); // 等待3秒，模拟思考时间
        await conductAgentDiscussion(nextAgent);
      } else {
        // 如果没有其他智能体，结束讨论
        addMessage('💡 没有更多可用的智能体参与讨论。', 'virtual', 'system', '系统');
        
        // 生成讨论总结
        await generateDiscussionSummary();
        
        setAgentOnlyMode(false);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '智能体讨论失败';
      setError(errorMsg);
      addMessage(`❌ ${errorMsg}`, 'virtual', 'system', '系统');
      // 错误后重新开始前，先检查是否已达到最大轮数（使用ref获取最新值）
      if (agentDiscussionRoundRef.current >= 5) {
        addMessage('💡 虚拟智能体自主讨论已达到最大轮数限制（5轮）。讨论已结束，感谢所有智能体的参与！', 'virtual', 'system', '系统');
        
        // 生成讨论总结
        await generateDiscussionSummary();
        
        setAgentOnlyMode(false);
        return;
      }
      await delay(2000);
      await startNextAgentDiscussion();
    }
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // 获取智能体图标
  const getAgentIcon = (student: TeamMember) => {
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
          <h1 className="text-3xl font-bold mb-2">线上组会</h1>
          <p className="text-muted-foreground">Group Meeting</p>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：组会信息和参与者 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* 组会信息卡片 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  组会信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">组会主题</label>
                    <Input
                      value={meetingTopic}
                      onChange={(e) => setMeetingTopic(e.target.value)}
                      placeholder="输入组会主题"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">日期时间</label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">主持人</label>
                    <Select value={host.id} onValueChange={(hostId) => {
                      const selectedHost = hostOptions.find(h => h.id === hostId);
                      if (selectedHost) {
                        setHost(selectedHost);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择主持人" />
                      </SelectTrigger>
                      <SelectContent>
                        {hostOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} ({option.type === 'human' ? '人类' : 'AI'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={startHostMode}
                      disabled={isLoading || isHostMode || agentOnlyMode}
                      className="flex-1"
                    >
                      开始主持讨论
                    </Button>
                    <Button 
                      onClick={startAgentOnlyDiscussion}
                      disabled={isLoading || isHostMode || agentOnlyMode}
                      variant="secondary"
                      className="flex-1"
                    >
                      智能体自主讨论
                    </Button>
                    {(isHostMode || agentOnlyMode) && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsHostMode(false);
                          setAgentOnlyMode(false);
                        }}
                      >
                        结束讨论
                      </Button>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-3">参与者</h4>
                    <div className="space-y-3">
                      {/* 老师 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">赵天娇 副教授</span>
                          <span className="text-xs text-muted-foreground block">实验室负责人</span>
                        </div>
                      </div>
                      
                      {/* 学生 */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">邹佳怡</span>
                          <span className="text-xs text-muted-foreground block">香港理工大学设计学博士生</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">罗晨尹</span>
                          <span className="text-xs text-muted-foreground block">天津大学设计学硕士生</span>
                        </div>
                      </div>
                      
                      {/* 虚拟学生 */}
                      {virtualStudents.map((student) => (
                        <div key={student.id} className={`flex items-center gap-3 ${selectedVirtualStudent === student.id ? 'bg-primary/5 rounded-lg p-2' : ''}`}>
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            {getAgentIcon(student)}
                          </div>
                          <div>
                            <span className="text-sm font-medium">{student.name}</span>
                            <span className="text-xs text-muted-foreground block">{student.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                <TabsTrigger value="meeting">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  组会讨论
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  设置
                </TabsTrigger>
              </TabsList>

              <TabsContent value="meeting" className="mt-4">
                <Card className="min-h-[600px] h-[calc(100vh-180px)] flex flex-col overflow-hidden">
                  {/* 头部信息 */}
                  <CardHeader className="flex flex-row items-center justify-between py-4 shrink-0 border-b">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        组会讨论
                      </CardTitle>
                      <CardDescription>
                        主题：{meetingTopic}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={clearChat}>
                        清空
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {/* 功能说明 */}
                  <div className="px-4 py-3 bg-primary/5 border-b">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">@智能体：</span>
                        <span>在消息中使用@智能体ID可以直接邀请特定智能体参与讨论</span>
                      </div>
                    </div>
                  </div>

                  {/* 消息列表区域 */}
                  <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-4 py-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">
                            开始组会讨论
                          </p>
                          <p className="text-sm max-w-md mx-auto">
                            输入您的想法或问题，与老师、学生和虚拟学生一起讨论
                          </p>
                        </div>
                      )}

                      {messages.map((message) => {
                        const isUser = message.sender === 'user';
                        const isVirtual = message.sender === 'virtual';
                        const student = teamMembers.find(m => m.id === message.senderId);
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[90%] p-4 rounded-2xl ${ 
                                isUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : message.isError
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : isVirtual
                                  ? 'bg-muted border'
                                  : 'bg-secondary/50 border border-secondary/20'
                              }`}
                              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            >
                              {/* 发送者标识 */}
                              {!isUser && (
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    {isVirtual && student ? getAgentIcon(student) : <User className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">{message.senderName}</span>
                                    {student && (
                                      <span className="text-xs text-muted-foreground ml-2">{student.title}</span>
                                    )}
                                  </div>
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
                              <span className="text-sm font-medium">{teamMembers.find(s => s.id === selectedVirtualStudent)?.name}思考中...</span>
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
                    <div className="space-y-4">
                      {/* 用户选择 */}
                      <div className="flex gap-3">
                        <Select value={currentUser.id} onValueChange={(userId) => {
                          const user = allParticipants.find(p => p.id === userId);
                          if (user) {
                            setCurrentUser({
                              id: user.id,
                              name: user.name,
                              type: user.id.startsWith('phd-ai-') || user.id.startsWith('master-ai-') ? 'virtual' : user.role === 'PI' ? 'teacher' : 'student'
                            });
                          }
                        }} className="w-48">
                          <SelectTrigger>
                            <SelectValue placeholder="选择参与者" />
                          </SelectTrigger>
                          <SelectContent>
                            {allParticipants.map(participant => (
                              <SelectItem key={participant.id} value={participant.id}>
                                {participant.name} ({participant.title})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select value={selectedVirtualStudent} onValueChange={setSelectedVirtualStudent} className="w-48">
                          <SelectTrigger>
                            <SelectValue placeholder="选择虚拟学生" />
                          </SelectTrigger>
                          <SelectContent>
                            {virtualStudents.map(student => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.title})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* 会议总结按钮 */}
                        <Button onClick={generateDiscussionSummary} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          生成会议总结
                        </Button>
                      </div>
                      
                      {/* 功能说明 */}
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">选择框说明：</span>
                          <span>1. 第一个选择框：选择当前发言的参与者（可以是老师、学生或你自己）</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">选择框说明：</span>
                          <span>2. 第二个选择框：选择默认的虚拟智能体（当没有@特定智能体时会使用此智能体）</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">@智能体：</span>
                          <span>使用@智能体真实名字（如@AI-创意生成专家）邀请特定智能体参与讨论</span>
                        </div>
                      </div>
                      
                      {/* 智能体选择列表 */}
                      {showAgentSelect && (
                        <div className="z-20 mb-3 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                          <div className="p-2 max-h-60 overflow-y-auto">
                            {virtualStudents.map((agent) => (
                              <div 
                                key={agent.id}
                                className="flex items-center gap-3 p-4 rounded-md hover:bg-muted cursor-pointer transition-colors"
                                onClick={() => {
                                  if (atPosition !== -1) {
                                    const newInputValue = inputValue.substring(0, atPosition) + `@${agent.name} ` + inputValue.substring(inputValue.length);
                                    setInputValue(newInputValue);
                                    setShowAgentSelect(false);
                                    // 聚焦到输入框并将光标移动到末尾
                                    setTimeout(() => {
                                      if (inputRef) {
                                        inputRef.focus();
                                        inputRef.setSelectionRange(newInputValue.length, newInputValue.length);
                                      }
                                    }, 0);
                                  }
                                }}
                              >
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                  {getAgentIcon(agent)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{agent.name}</div>
                                  <div className="text-xs text-muted-foreground">{agent.title}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 长条输入框 */}
                      <div className="flex gap-3 relative">
                        <Textarea
                          ref={(ref) => setInputRef(ref)}
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                            // 检测@符号
                            const value = e.target.value;
                            const lastAt = value.lastIndexOf('@');
                            if (lastAt !== -1 && (lastAt === 0 || value[lastAt - 1] === ' ')) {
                              setAtPosition(lastAt);
                              setShowAgentSelect(true);
                            } else {
                              setShowAgentSelect(false);
                            }
                          }}
                          placeholder={isHostMode ? "作为主持人，输入您的问题..." : "输入您的想法或问题..."}
                          className="flex-1 min-h-[120px] resize-y"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (isHostMode) {
                                continueDiscussion();
                              } else {
                                handleSendMessage();
                              }
                              setShowAgentSelect(false);
                            } else if (e.key === 'Escape') {
                              setShowAgentSelect(false);
                            }
                          }}
                          onBlur={() => {
                            // 延迟关闭，以便点击选择框时能触发点击事件
                            setTimeout(() => {
                              setShowAgentSelect(false);
                            }, 200);
                          }}
                        />
                        <Button 
                          onClick={() => {
                            if (isHostMode) {
                              continueDiscussion();
                            } else {
                              handleSendMessage();
                            }
                            setShowAgentSelect(false);
                          }}
                          disabled={isLoading || !inputValue.trim()}
                          className="h-12 px-6"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : isHostMode ? (
                            <MessageSquare className="w-5 h-5" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="text-xs text-muted-foreground">
                            按 Enter 发送，Shift + Enter 换行
                          </p>
                          <p className="text-xs text-muted-foreground">
                            当前用户：{currentUser.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {isHostMode && (
                            <p className="text-xs text-primary font-medium">
                              主持人模式：{host.name}
                            </p>
                          )}
                          {agentOnlyMode && (
                            <p className="text-xs text-secondary font-medium">
                              智能体自主讨论模式
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            当前虚拟学生：{teamMembers.find(s => s.id === selectedVirtualStudent)?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            讨论轮数：{agentOnlyMode ? agentDiscussionRound : discussionRound}/{agentOnlyMode ? maxAgentDiscussionRounds : maxDiscussionRounds}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>系统设置</CardTitle>
                    <CardDescription>配置组会系统的参数</CardDescription>
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
                        选择适合组会讨论的模型
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">讨论设置</label>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">最大讨论轮数</label>
                          <Select value={maxDiscussionRounds.toString()} onValueChange={(value) => setMaxDiscussionRounds(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择轮数" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3轮</SelectItem>
                              <SelectItem value="5">5轮</SelectItem>
                              <SelectItem value="7">7轮</SelectItem>
                              <SelectItem value="10">10轮</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-2">
                            虚拟智能体之间的连续讨论最大轮数
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">智能体自主讨论轮数</label>
                          <Select value={maxAgentDiscussionRounds.toString()} onValueChange={(value) => setMaxAgentDiscussionRounds(Math.min(parseInt(value), 5))}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择轮数" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3轮</SelectItem>
                              <SelectItem value="5">5轮</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-2">
                            智能体自主讨论模式的最大轮数（最多5轮）
                          </p>
                        </div>
                      </div>
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

export default GroupMeeting;