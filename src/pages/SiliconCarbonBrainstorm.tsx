import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Sparkles, Users, MessageSquare, Send, Loader2,
  User, Bot, Lightbulb, Clock, Calendar, ChevronDown,
  ChevronUp, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ==================== 类型定义 ====================

interface BrainstormMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    type: 'human' | 'ai' | 'system';
  };
  timestamp: Date;
  isError?: boolean;
}

interface BrainstormProps {
  initialTopic?: string;
}

// ==================== 智能体配置 ====================

const AI_AGENTS = [
  {
    id: 'ai-creative',
    name: '创想助手',
    role: '创意生成',
    description: '专注于激发创新思维和创意生成',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'ai-analyzer',
    name: '分析专家',
    role: '逻辑分析',
    description: '擅长分析问题和提供理性建议',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'ai-practical',
    name: '实践顾问',
    role: '可行性评估',
    description: '评估创意的可行性和实施路径',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'ai-futuristic',
    name: '未来视角',
    role: '趋势预测',
    description: '从未来趋势角度提供见解',
    color: 'bg-orange-100 text-orange-600'
  }
];

// ==================== 主组件 ====================

const SiliconCarbonBrainstorm: React.FC<BrainstormProps> = ({ initialTopic = '如何利用AI推动可持续发展' }) => {
  // 基础状态
  const [brainstormTopic, setBrainstormTopic] = useState(initialTopic);
  const [messages, setMessages] = useState<BrainstormMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{id: string; name: string; type: 'human'}>({id: 'user', name: '我', type: 'human'});
  const [isBrainstormActive, setIsBrainstormActive] = useState(false);
  const [brainstormPhase, setBrainstormPhase] = useState<'preparation' | 'ideation' | 'evaluation' | 'conclusion'>('preparation');
  const [participants, setParticipants] = useState<Array<{id: string; name: string; type: 'human' | 'ai'; role: string}>>([]);
  const [selectedAI, setSelectedAI] = useState<string>('');
  
  // 引用
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
  
  // 当消息变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 延迟函数
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // 添加消息
  const addMessage = (content: string, sender: {
    id: string;
    name: string;
    role: string;
    type: 'human' | 'ai' | 'system';
  }) => {
    const newMessage: BrainstormMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  // 逐步显示消息内容
  const typeMessage = async (content: string, sender: {
    id: string;
    name: string;
    role: string;
    type: 'human' | 'ai' | 'system';
  }) => {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 先添加一个空消息
    const newMessage: BrainstormMessage = {
      id: messageId,
      content: '',
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // 逐字显示内容
    let typedContent = '';
    const typingSpeed = 30;
    
    for (let i = 0; i < content.length; i++) {
      typedContent += content[i];
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, content: typedContent } : msg
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    
    return newMessage;
  };
  
  // 模拟AI回复
  const simulateAIResponse = async (agentId: string, topic: string, context: string) => {
    const agent = AI_AGENTS.find(a => a.id === agentId);
    if (!agent) return;
    
    const responses = {
      'ai-creative': `基于"${topic}"这个主题，我有几个创新想法：\n1. 利用AI优化能源使用，通过智能算法预测和调节能源需求\n2. 开发AI驱动的可持续材料发现系统，加速绿色材料的研发\n3. 构建智能交通系统，减少碳排放和交通拥堵\n4. 利用AI进行精准农业，减少资源浪费\n5. 开发AI辅助的可持续生活方式推荐系统，帮助人们做出环保选择`,
      'ai-analyzer': `从分析角度看，"${topic}"需要考虑以下几个关键因素：\n1. 技术可行性：当前AI技术在可持续发展领域的应用成熟度\n2. 经济成本：实施AI解决方案的成本与收益分析\n3. 社会接受度：公众对AI在可持续发展中角色的认知和接受程度\n4. 政策支持：相关政策法规对AI应用的支持程度\n5. 长期影响：AI解决方案的长期可持续性和潜在副作用`,
      'ai-practical': `关于"${topic}"的实践建议：\n1. 从小规模试点项目开始，逐步扩大应用范围\n2. 建立跨学科团队，确保技术、政策和社会因素的综合考虑\n3. 注重数据质量和隐私保护，确保AI系统的可靠性和安全性\n4. 开发易于使用的界面，提高用户 adoption\n5. 建立评估机制，持续监测和改进AI解决方案的效果`,
      'ai-futuristic': `未来视角下，"${topic}"的发展趋势：\n1. 通用人工智能将在可持续发展中发挥更核心的作用\n2. 量子计算与AI结合，解决复杂的环境问题\n3. 数字孪生技术将被广泛应用于环境监测和预测\n4. 去中心化AI系统将增强社区级别的可持续发展能力\n5. AI将成为全球可持续发展治理的重要工具，促进国际合作`
    };
    
    await delay(2000);
    await typeMessage(responses[agentId as keyof typeof responses] || '我对这个主题有很多想法...', {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      type: 'ai'
    });
  };
  
  // 开始头脑风暴
  const startBrainstorm = () => {
    setIsBrainstormActive(true);
    setBrainstormPhase('ideation');
    setMessages([]);
    
    // 添加系统消息
    addMessage(`硅基-碳基头脑风暴开始！今天的主题是：${brainstormTopic}`, {
      id: 'system',
      name: '系统',
      role: '系统',
      type: 'system'
    });
    
    // 添加参与者
    const initialParticipants = [
      { id: 'user', name: '我', type: 'human' as const, role: '参与者' },
      ...AI_AGENTS.map(agent => ({ 
        id: agent.id, 
        name: agent.name, 
        type: 'ai' as const, 
        role: agent.role 
      }))
    ];
    setParticipants(initialParticipants);
  };
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue;
    addMessage(userContent, {
      id: currentUser.id,
      name: currentUser.name,
      role: '参与者',
      type: 'human'
    });
    
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // 如果选择了AI，让AI回复
      if (selectedAI) {
        await simulateAIResponse(selectedAI, brainstormTopic, userContent);
      } else {
        // 随机选择一个AI回复
        const randomAI = AI_AGENTS[Math.floor(Math.random() * AI_AGENTS.length)];
        await simulateAIResponse(randomAI.id, brainstormTopic, userContent);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '发送消息失败';
      setError(errorMsg);
      addMessage(`❌ ${errorMsg}`, {
        id: 'system',
        name: '系统',
        role: '系统',
        type: 'system'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 结束头脑风暴
  const endBrainstorm = () => {
    setIsBrainstormActive(false);
    setBrainstormPhase('conclusion');
    addMessage('头脑风暴已结束，感谢大家的参与！', {
      id: 'system',
      name: '系统',
      role: '系统',
      type: 'system'
    });
  };
  
  // 重置头脑风暴
  const resetBrainstorm = () => {
    setIsBrainstormActive(false);
    setBrainstormPhase('preparation');
    setMessages([]);
    setParticipants([]);
    setSelectedAI('');
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
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8" />
            硅基-碳基头脑风暴系统
          </h1>
          <p className="text-muted-foreground">Silicon-Carbon Brainstorming System</p>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：头脑风暴信息和参与者 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* 头脑风暴信息卡片 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  头脑风暴信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">头脑风暴主题</label>
                    <Input
                      value={brainstormTopic}
                      onChange={(e) => setBrainstormTopic(e.target.value)}
                      placeholder="输入头脑风暴主题"
                      className="w-full"
                      disabled={isBrainstormActive}
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
                    <label className="text-sm font-medium mb-2 block">当前阶段</label>
                    <Badge variant="secondary" className="text-sm">
                      {brainstormPhase === 'preparation' && '准备阶段'}
                      {brainstormPhase === 'ideation' && '创意生成'}
                      {brainstormPhase === 'evaluation' && '评估阶段'}
                      {brainstormPhase === 'conclusion' && '总结阶段'}
                    </Badge>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    {!isBrainstormActive ? (
                      <Button 
                        onClick={startBrainstorm}
                        disabled={!brainstormTopic.trim()}
                        className="w-full"
                      >
                        开始头脑风暴
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          onClick={endBrainstorm}
                          className="w-full"
                        >
                          结束头脑风暴
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={resetBrainstorm}
                          className="w-full"
                        >
                          重置
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-3">参与者</h4>
                    <ScrollArea className="max-h-80">
                      <div className="space-y-3 py-2">
                        {participants.map((participant) => (
                          <div key={participant.id} className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={
                                participant.type === 'ai' 
                                  ? AI_AGENTS.find(a => a.id === participant.id)?.color || 'bg-purple-100 text-purple-600'
                                  : 'bg-blue-100 text-blue-600'
                              }>
                                {participant.type === 'ai' ? (
                                  <Bot className="w-4 h-4" />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-sm font-medium">{participant.name}</span>
                              <span className="text-xs text-muted-foreground block">{participant.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
            <Card className="min-h-[600px] h-[calc(100vh-180px)] flex flex-col overflow-hidden">
              {/* 头部信息 */}
              <CardHeader className="flex flex-row items-center justify-between py-4 shrink-0 border-b">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    头脑风暴讨论
                  </CardTitle>
                  <CardDescription>
                    主题：{brainstormTopic}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {isBrainstormActive && (
                    <Select value={selectedAI} onValueChange={setSelectedAI}>
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="选择AI助手" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_AGENTS.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} ({agent.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              
              {/* 功能说明 */}
              {!isBrainstormActive && (
                <div className="px-4 py-6 bg-primary/5 border-b">
                  <div className="text-center space-y-4">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-medium">欢迎使用硅基-碳基头脑风暴系统</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      这是一个融合人类创意和AI智能的头脑风暴平台，通过硅基（AI）和碳基（人类）的协同，激发更多创新想法。
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          碳基参与者
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          提供创意灵感和人类视角
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          <Bot className="w-4 h-4" />
                          硅基助手
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          提供数据分析和创新思路
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 消息列表区域 */}
              <ScrollArea ref={messagesContainerRef} className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {messages.length === 0 && isBrainstormActive && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        开始头脑风暴
                      </p>
                      <p className="text-sm max-w-md mx-auto">
                        输入您的想法，与AI助手一起 brainstorm 创意
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender.type === 'human' && message.sender.id === currentUser.id ? 'flex-row-reverse' : ''} items-start gap-3`}
                    >
                      <Avatar className="w-10 h-10 shrink-0 mt-1">
                        <AvatarFallback className={
                          message.sender.type === 'ai' 
                            ? AI_AGENTS.find(a => a.id === message.sender.id)?.color || 'bg-purple-100 text-purple-600'
                            : message.sender.id === currentUser.id 
                              ? 'bg-blue-100 text-blue-600'
                              : message.sender.type === 'system'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-green-100 text-green-600'
                        }>
                          {message.sender.type === 'ai' ? (
                            <Bot className="w-5 h-5" />
                          ) : message.sender.type === 'system' ? (
                            <span className="text-xs">系统</span>
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <span className="font-medium">{message.sender.name}</span>
                          {message.sender.role && message.sender.type !== 'system' && (
                            <Badge variant="secondary" className="text-xs">
                              {message.sender.role}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div 
                          className={`p-4 rounded-2xl ${message.sender.id === currentUser.id
                            ? 'bg-blue-500 text-white'
                            : message.sender.type === 'ai'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : message.sender.type === 'system'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden' }}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* 输入区域 */}
              {isBrainstormActive && (
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        ref={inputRef}
                        placeholder="输入您的想法..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 resize-none"
                        rows={2}
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    提示：选择不同的AI助手可以获得不同角度的创意和分析
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SiliconCarbonBrainstorm;