import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Network, Lightbulb, Database, Cpu, Share2, 
  Search, FileText, Sparkles, Bot, Send, User, Loader2,
  Plane, Eye, Brain, Users, MapPin, Shield, Zap, Camera,
  BarChart3, Route, Cloud, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHeroImage } from '@/utils/aiImageGenerator';

// 智能体类型定义
interface Agent {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  systemPrompt: string;
}

// 10个低空相关智能体
const agents: Agent[] = [
  {
    id: 'low-altitude-perception',
    name: '低空智能感知专家',
    icon: <Eye className="w-5 h-5" />,
    description: '低空环境下的目标检测、跟踪、场景理解与环境感知',
    color: 'from-blue-500 to-cyan-500',
    systemPrompt: '你是低空智能感知专家，专注于低空环境下的智能感知技术。包括：无人机视角目标检测与跟踪、低空场景理解、多模态传感器融合、视觉-激光雷达融合感知、动态障碍物识别、地形地貌感知等。你可以提供感知算法选型、模型优化、数据集构建和评测方案。'
  },
  {
    id: 'embodied-intelligence',
    name: '低空具身智能顾问',
    icon: <Brain className="w-5 h-5" />,
    description: '空中具身机器人、自主导航、环境交互与智能决策',
    color: 'from-purple-500 to-pink-500',
    systemPrompt: '你是低空具身智能顾问，专注于空中具身智能技术。包括：无人机自主导航与定位、环境交互与学习、视觉伺服控制、灵巧操作、任务规划与决策、强化学习在无人机控制中的应用等。你可以帮助设计智能无人系统的感知-决策-控制闭环。'
  },
  {
    id: 'swarm-intelligence',
    name: '低空群体智能协调员',
    icon: <Users className="w-5 h-5" />,
    description: '多无人机协同、集群控制、分布式智能与协同决策',
    color: 'from-green-500 to-emerald-500',
    systemPrompt: '你是低空群体智能协调员，专注于多无人机群体智能技术。包括：集群编队控制、分布式协同感知、协同任务分配、群体决策机制、蜂群算法、一致性协议、容错协同等。你可以设计大规模无人机集群的协同方案和智能涌现策略。'
  },
  {
    id: 'world-simulator',
    name: '世界模拟器专家',
    icon: <Cloud className="w-5 h-5" />,
    description: '低空环境仿真、场景生成、数字孪生与虚拟训练',
    color: 'from-indigo-500 to-violet-500',
    systemPrompt: '你是世界模拟器专家，专注于低空环境仿真与数字孪生技术。包括：高保真低空场景仿真、物理引擎建模、传感器仿真、天气与环境模拟、数字孪生城市、虚拟训练环境构建、Sim2Real迁移等。你可以帮助构建逼真的低空仿真环境和训练平台。'
  },
  {
    id: 'social-simulator',
    name: '社会模拟器专家',
    icon: <Network className="w-5 h-5" />,
    description: '低空社会经济仿真、应用场景模拟与政策评估',
    color: 'from-orange-500 to-amber-500',
    systemPrompt: '你是社会模拟器专家，专注于低空社会经济仿真技术。包括：低空经济生态建模、无人机应用场景仿真、城市交通流模拟、物流配送优化、政策影响评估、人机社会交互、公众接受度分析等。你可以模拟和评估低空技术在社会经济层面的影响。'
  },
  {
    id: 'low-altitude-security',
    name: '低空安全卫士',
    icon: <Shield className="w-5 h-5" />,
    description: '低空安全防护、隐私保护、反无人机与风险评估',
    color: 'from-red-500 to-rose-500',
    systemPrompt: '你是低空安全卫士，专注于低空安全防护技术。包括：无人机威胁检测与识别、反无人机系统、电子围栏技术、通信安全、数据隐私保护、空域入侵监测、安全风险评估与预警、应急响应机制等。你可以提供全面的低空安全防护方案。'
  },
  {
    id: 'airspace-management',
    name: '低空空域管理专家',
    icon: <MapPin className="w-5 h-5" />,
    description: '低空空域规划、动态管理、法规标准与监管技术',
    color: 'from-teal-500 to-cyan-500',
    systemPrompt: '你是低空空域管理专家，专注于低空空域管理与监管技术。包括：低空空域分类与规划、动态空域分配、UTM（无人机交通管理系统）、空域冲突检测与消解、法规标准解读、飞行审批流程、监管技术平台等。你可以帮助理解和应用低空空域管理政策与技术。'
  },
  {
    id: 'route-planning',
    name: '低空航路规划师',
    icon: <Route className="w-5 h-5" />,
    description: '智能航路规划、避障算法、动态路径优化与4D航迹',
    color: 'from-cyan-500 to-blue-500',
    systemPrompt: '你是低空航路规划师，专注于低空智能航路规划技术。包括：三维航路网络设计、实时避障算法、动态路径重规划、4D航迹预测、多约束优化（能耗、时间、安全）、城市峡谷导航、GPS拒止环境导航等。你可以为各类低空飞行任务设计最优航路方案。'
  },
  {
    id: 'low-altitude-traffic',
    name: '低空交通管理专家',
    icon: <Plane className="w-5 h-5" />,
    description: '低空交通流管理、冲突消解、协同调度与流量控制',
    color: 'from-violet-500 to-purple-500',
    systemPrompt: '你是低空交通管理专家，专注于低空交通管理技术。包括：低空交通流建模与预测、多机冲突检测与消解、协同调度算法、流量控制策略、优先级管理、紧急情况处理、空地一体化交通管理等。你可以设计高效的低空交通管理系统和算法。'
  },
  {
    id: 'low-altitude-logistics',
    name: '低空物流专家',
    icon: <Zap className="w-5 h-5" />,
    description: '无人机物流配送、末端配送、仓储管理与供应链优化',
    color: 'from-yellow-500 to-orange-500',
    systemPrompt: '你是低空物流专家，专注于无人机物流配送技术。包括：末端配送路径优化、配送网络设计、仓储自动化、货物装载优化、配送时效预测、成本效益分析、医药物流、应急物资配送等。你可以帮助设计和优化无人机物流配送方案。'
  }
];

// 消息类型
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId?: string;
  timestamp: Date;
}

// 智能体卡片组件
const AgentCard: React.FC<{ 
  agent: Agent; 
  isSelected: boolean; 
  onClick: () => void;
}> = ({ agent, isSelected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white`}>
          {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{agent.name}</h4>
          <p className="text-xs text-gray-500 truncate">{agent.description}</p>
        </div>
      </div>
    </motion.button>
  );
};

// 逐行显示文本的 Hook
const useTypewriter = (text: string, speed: number = 30, isNew: boolean = false) => {
  const [displayText, setDisplayText] = useState(isNew ? '' : text);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isNew) {
      setDisplayText(text);
      return;
    }

    setIsTyping(true);
    setDisplayText('');
    
    const lines = text.split('\n');
    let currentLine = 0;
    let currentChar = 0;
    let result = '';
    let cancelled = false;

    const typeLine = () => {
      if (cancelled || currentLine >= lines.length) {
        setIsTyping(false);
        return;
      }

      const line = lines[currentLine];
      
      if (currentChar < line.length) {
        result += line[currentChar];
        currentChar++;
        setDisplayText(result);
        setTimeout(typeLine, speed);
      } else {
        result += '\n';
        currentLine++;
        currentChar = 0;
        setDisplayText(result);
        setTimeout(typeLine, speed * 2);
      }
    };

    const timer = setTimeout(typeLine, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, speed, isNew]);

  return { displayText, isTyping };
};

// 聊天消息组件
const ChatMessage: React.FC<{ message: Message; isNew?: boolean }> = ({ 
  message, 
  isNew = false
}) => {
  const isUser = message.role === 'user';
  const agent = message.agentId ? agents.find(a => a.id === message.agentId) : null;
  const { displayText, isTyping } = useTypewriter(message.content, 25, isNew);
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary text-white' 
          : agent 
            ? `bg-gradient-to-br ${agent.color} text-white`
            : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : agent?.icon || <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-primary text-white rounded-tr-sm' 
          : 'bg-gray-100 text-gray-800 rounded-tl-sm'
      }`}>
        {!isUser && agent && (
          <div className="text-xs font-medium text-gray-500 mb-1">{agent.name}</div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {displayText}
          {isTyping && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

const KnowledgeBase: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_KEY = 'sk-8c277633f58644eab6f4fe91f2d8e53f';

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 自动滚动到底部 - 直接操作 DOM
  const scrollToBottom = useCallback(() => {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // 消息变化时滚动
  useEffect(() => {
    // 延迟执行确保 DOM 已更新
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages, scrollToBottom]);

  // 加载状态变化时滚动
  useEffect(() => {
    if (isLoading) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [isLoading, scrollToBottom]);

  // 发送消息（支持传入指定内容）
  const sendMessage = async (content?: string) => {
    const messageContent = content || inputMessage.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      agentId: selectedAgent.id,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          messages: [
            { role: 'system', content: selectedAgent.systemPrompt },
            ...messages.filter(m => m.agentId === selectedAgent.id).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: messageContent }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API错误:', response.status, errorData);
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('API响应:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          agentId: selectedAgent.id,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('API返回格式错误');
      }
    } catch (error) {
      console.error('API调用失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，服务暂时不可用。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        agentId: selectedAgent.id,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('knowledge')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Cloud className="w-4 h-4" />
              <span>低空智能知识中心</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">知识基座</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              VisDrone团队面向低空经济国家战略需求，构建低空数据基座和知识基座，
              攻关低空环境感知、低空具身智能和低空群体智能技术难题
            </p>
          </motion.div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              低空智能助手
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              10个专业智能体，为您提供全方位的低空技术咨询服务
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* 智能体列表 */}
            <div className="lg:col-span-1 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">选择智能体</h3>
                <span className="text-xs text-gray-500">{agents.length}个可用</span>
              </div>
              <div className="space-y-2 max-h-[200px] lg:max-h-[500px] overflow-y-auto pr-2">
                {agents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                  />
                ))}
              </div>
            </div>

            {/* 聊天界面 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border shadow-sm h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
                {/* 聊天头部 */}
                <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-white`}>
                      {selectedAgent.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedAgent.name}</h4>
                      <p className="text-xs text-gray-500">{selectedAgent.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                    className="text-xs text-gray-500 hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-gray-100"
                  >
                    清空对话
                  </button>
                </div>

                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages-container">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">开始与{selectedAgent.name}对话</p>
                        <p className="text-xs mt-1">{selectedAgent.description}</p>
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const filteredMessages = messages.filter(m => m.agentId === selectedAgent.id);
                      const lastAssistantIndex = filteredMessages
                        .map((m, i) => ({ ...m, index: i }))
                        .filter(m => m.role === 'assistant')
                        .pop()?.index ?? -1;
                      
                      return filteredMessages.map((message, index) => (
                        <ChatMessage 
                          key={message.id} 
                          message={message} 
                          isNew={message.role === 'assistant' && index === lastAssistantIndex}
                        />
                      ));
                    })()
                  )}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">思考中...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入框 */}
                <div className="p-4 border-t">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      sendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`询问${selectedAgent.name}...`}
                      className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">知识库</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              提供领域知识快速检索、知识图谱构建、科学假设生成、知识推理等智能服务
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: '低空经济知识库',
                description: '低空经济政策、产业、市场等全方位知识',
                icon: <Database className="w-6 h-6" />,
                services: ['知识检索', '知识图谱', '假设生成', '知识推理'],
                color: 'bg-blue-500'
              },
              {
                title: '低空智能知识库',
                description: '低空感知、智能控制、群体智能等技术知识',
                icon: <Brain className="w-6 h-6" />,
                services: ['知识检索', '知识图谱', '假设生成', '知识推理'],
                color: 'bg-purple-500'
              },
              {
                title: 'AI4R知识库',
                description: 'AI4Research 科学研究智能相关知识',
                icon: <Cpu className="w-6 h-6" />,
                services: ['知识检索', '知识图谱', '假设生成', '知识推理'],
                color: 'bg-orange-500',
                link: 'https://haiseu.com/autosota'
              },
              {
                title: '人机交互知识库',
                description: '人机交互设计、评估、优化等专业知识',
                icon: <Users className="w-6 h-6" />,
                services: ['知识检索', '知识图谱', '假设生成', '知识推理'],
                color: 'bg-green-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 rounded-2xl border hover:shadow-lg transition-all bg-white h-full"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      {item.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.services.map((service, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </a>
                ) : (
                  <div className="group block p-6 rounded-2xl border hover:shadow-lg transition-all bg-white h-full">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.services.map((service, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: '知识图谱',
                description: '构建低空智能领域的结构化知识网络',
                icon: <Network className="w-6 h-6" />
              },
              {
                title: '开放共享',
                description: '所有知识资源开放共享，支持社区贡献',
                icon: <Share2 className="w-6 h-6" />
              },
              {
                title: '持续更新',
                description: '紧跟学术前沿，持续扩充知识库内容',
                icon: <Sparkles className="w-6 h-6" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeBase;
