import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, CheckCircle, XCircle, Loader2, 
  Brain, Users, Bot, AlertCircle, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// 预设测试提示词
const TEST_PROMPTS = {
  multiAgent: '设计一款融入中医文化的儿童辅助推拿仪，外观亲和，缓解儿童的医疗恐惧',
  virtualStudent: '请解释什么是生成式 AI，以及它在设计领域的应用',
  groupMeeting: '讨论 AI 如何改变未来的设计教育'
};

// 智能体系统提示词
const SYSTEM_PROMPTS = {
  multiAgent: `你是多智能体协同设计系统的主控官。请分析以下设计需求，并说明你将如何协调各智能体（需求分析师、概念设计师、细节设计师、评估专家）来完成这个设计任务。请给出详细的工作流程和各阶段的输出。

设计需求：`,

  virtualStudent: `你是东南大学人机协同设计实验室的虚拟学生，专注于生成式 AI 和设计创新领域。请专业而详细地回答以下问题，提供具体的例子和应用场景。

问题：`,

  groupMeeting: `你是线上组会的主持人，正在组织一场关于设计教育的讨论。请引导讨论，提出有深度的观点，并邀请其他参与者（设计师、教育者、技术专家）分享他们的看法。请营造积极、建设性的讨论氛围。

讨论主题：`
};

// 测试结果类型
interface TestResult {
  id: string;
  agentType: 'multiAgent' | 'virtualStudent' | 'groupMeeting';
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  response?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  prompt?: string;
}

const AgentTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('sk-8c277633f58644eab6f4fe91f2d8e53f');

  // 初始化测试结果
  useEffect(() => {
    setTestResults([
      {
        id: 'multiAgent',
        agentType: 'multiAgent',
        status: 'pending',
        message: '等待测试'
      },
      {
        id: 'virtualStudent',
        agentType: 'virtualStudent',
        status: 'pending',
        message: '等待测试'
      },
      {
        id: 'groupMeeting',
        agentType: 'groupMeeting',
        status: 'pending',
        message: '等待测试'
      }
    ]);
  }, []);

  // 测试智能体系统
  const testAgentSystem = async (agentType: 'multiAgent' | 'virtualStudent' | 'groupMeeting') => {
    if (!apiKey) {
      updateTestResult(agentType, 'error', 'API 密钥不能为空', '');
      return;
    }

    updateTestResult(agentType, 'running', '正在调用智能体系统...', '');
    setCurrentTest(agentType);

    try {
      const startTime = new Date();
      const prompt = TEST_PROMPTS[agentType];
      const systemPrompt = SYSTEM_PROMPTS[agentType] + prompt;
      
      // 真实调用 API
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen3.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: '请开始执行任务' }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          // 超时设置：10 秒基础 + 重试次数 * 10 秒
          timeout: 10000
        })
      });

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      if (response.ok) {
        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content || '无响应内容';
        updateTestResult(
          agentType, 
          'success', 
          `智能体响应正常 (${duration}ms)`, 
          responseText,
          startTime,
          endTime,
          duration,
          prompt
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || `HTTP 错误：${response.status}`;
        updateTestResult(agentType, 'error', `API 调用失败：${errorMessage}`, '');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      updateTestResult(agentType, 'error', `调用失败：${errorMessage}`, '');
    } finally {
      setCurrentTest(null);
    }
  };

  // 更新测试结果
  const updateTestResult = (
    agentType: 'multiAgent' | 'virtualStudent' | 'groupMeeting',
    status: 'pending' | 'running' | 'success' | 'error',
    message: string,
    response: string,
    startTime?: Date,
    endTime?: Date,
    duration?: number,
    prompt?: string
  ) => {
    setTestResults(prev => prev.map(result => 
      result.agentType === agentType 
        ? { ...result, status, message, response, startTime, endTime, duration, prompt } 
        : result
    ));
  };

  // 运行所有测试
  const runAllTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    // 重置所有测试结果
    setTestResults(prev => prev.map(result => ({
      ...result,
      status: 'pending',
      message: '等待测试',
      response: undefined,
      startTime: undefined,
      endTime: undefined,
      duration: undefined,
      prompt: undefined
    })));

    // 依次运行测试
    await testAgentSystem('multiAgent');
    await new Promise(resolve => setTimeout(resolve, 500));
    await testAgentSystem('virtualStudent');
    await new Promise(resolve => setTimeout(resolve, 500));
    await testAgentSystem('groupMeeting');
    
    setIsRunning(false);
  };

  // 获取测试状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <TestTube className="w-5 h-5 text-gray-400" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <TestTube className="w-5 h-5 text-gray-400" />;
    }
  };

  // 获取测试状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-400';
      case 'running':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
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
          <h1 className="text-3xl font-bold mb-2">智能体系统真实交互测试</h1>
          <p className="text-muted-foreground">Agent System Real Interaction Test</p>
        </motion.div>

        {/* API 密钥设置 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API 设置</CardTitle>
            <CardDescription>配置通义千问 API 密钥进行真实测试</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入通义千问 API 密钥"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <Button onClick={runAllTests} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    运行所有测试
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              注：测试将真实调用通义千问 API，展示智能体的完整交互内容
            </p>
          </CardContent>
        </Card>

        {/* 测试结果 */}
        <div className="space-y-6">
          {/* 多智能体协同设计系统测试 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  多智能体协同设计系统测试
                </CardTitle>
                <CardDescription>
                  测试智能体如何协调多智能体系统完成设计任务
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">测试输入</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      {TEST_PROMPTS.multiAgent}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">测试状态</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(testResults.find(r => r.agentType === 'multiAgent')?.status || 'pending')}
                      <span className={getStatusColor(testResults.find(r => r.agentType === 'multiAgent')?.status || 'pending')}>
                        {testResults.find(r => r.agentType === 'multiAgent')?.message}
                      </span>
                      {testResults.find(r => r.agentType === 'multiAgent')?.duration && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({testResults.find(r => r.agentType === 'multiAgent')?.duration}ms)
                        </span>
                      )}
                    </div>
                    
                    {testResults.find(r => r.agentType === 'multiAgent')?.status === 'success' && (
                      <div className="mt-3 border rounded-md">
                        <div className="bg-green-50 px-4 py-2 border-b flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">智能体响应</span>
                        </div>
                        <ScrollArea className="max-h-[600px]">
                          <div className="p-4 whitespace-pre-wrap text-sm">
                            {testResults.find(r => r.agentType === 'multiAgent')?.response}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    
                    {testResults.find(r => r.agentType === 'multiAgent')?.status === 'error' && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md text-sm text-red-600">
                        <p>{testResults.find(r => r.agentType === 'multiAgent')?.message}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => testAgentSystem('multiAgent')}
                    disabled={isRunning || currentTest === 'multiAgent'}
                    className="w-full"
                  >
                    单独测试
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 团队成员智能体测试 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  团队成员智能体测试
                </CardTitle>
                <CardDescription>
                  测试虚拟学生的专业知识和交互能力
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">测试输入</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      {TEST_PROMPTS.virtualStudent}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">测试状态</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(testResults.find(r => r.agentType === 'virtualStudent')?.status || 'pending')}
                      <span className={getStatusColor(testResults.find(r => r.agentType === 'virtualStudent')?.status || 'pending')}>
                        {testResults.find(r => r.agentType === 'virtualStudent')?.message}
                      </span>
                      {testResults.find(r => r.agentType === 'virtualStudent')?.duration && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({testResults.find(r => r.agentType === 'virtualStudent')?.duration}ms)
                        </span>
                      )}
                    </div>
                    
                    {testResults.find(r => r.agentType === 'virtualStudent')?.status === 'success' && (
                      <div className="mt-3 border rounded-md">
                        <div className="bg-blue-50 px-4 py-2 border-b flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">智能体响应</span>
                        </div>
                        <ScrollArea className="max-h-[600px]">
                          <div className="p-4 whitespace-pre-wrap text-sm">
                            {testResults.find(r => r.agentType === 'virtualStudent')?.response}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    
                    {testResults.find(r => r.agentType === 'virtualStudent')?.status === 'error' && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md text-sm text-red-600">
                        <p>{testResults.find(r => r.agentType === 'virtualStudent')?.message}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => testAgentSystem('virtualStudent')}
                    disabled={isRunning || currentTest === 'virtualStudent'}
                    className="w-full"
                  >
                    单独测试
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 线上组会系统测试 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  线上组会系统测试
                </CardTitle>
                <CardDescription>
                  测试组会主持人的引导和讨论能力
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">测试输入</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      {TEST_PROMPTS.groupMeeting}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">测试状态</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(testResults.find(r => r.agentType === 'groupMeeting')?.status || 'pending')}
                      <span className={getStatusColor(testResults.find(r => r.agentType === 'groupMeeting')?.status || 'pending')}>
                        {testResults.find(r => r.agentType === 'groupMeeting')?.message}
                      </span>
                      {testResults.find(r => r.agentType === 'groupMeeting')?.duration && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({testResults.find(r => r.agentType === 'groupMeeting')?.duration}ms)
                        </span>
                      )}
                    </div>
                    
                    {testResults.find(r => r.agentType === 'groupMeeting')?.status === 'success' && (
                      <div className="mt-3 border rounded-md">
                        <div className="bg-purple-50 px-4 py-2 border-b flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">智能体响应</span>
                        </div>
                        <ScrollArea className="max-h-[600px]">
                          <div className="p-4 whitespace-pre-wrap text-sm">
                            {testResults.find(r => r.agentType === 'groupMeeting')?.response}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    
                    {testResults.find(r => r.agentType === 'groupMeeting')?.status === 'error' && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md text-sm text-red-600">
                        <p>{testResults.find(r => r.agentType === 'groupMeeting')?.message}</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => testAgentSystem('groupMeeting')}
                    disabled={isRunning || currentTest === 'groupMeeting'}
                    className="w-full"
                  >
                    单独测试
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 测试总结 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>测试总结</CardTitle>
              <CardDescription>
                智能体系统真实交互测试结果汇总
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">测试总数</h4>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">成功测试</h4>
                    <p className="text-2xl font-bold text-green-500">
                      {testResults.filter(r => r.status === 'success').length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-md">
                    <h4 className="text-sm font-medium mb-1">失败测试</h4>
                    <p className="text-2xl font-bold text-red-500">
                      {testResults.filter(r => r.status === 'error').length}
                    </p>
                  </div>
                </div>
                
                {testResults.every(r => r.status === 'success') && (
                  <Alert variant="default">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      所有智能体系统真实交互测试通过！系统运行正常，智能体能够正确响应并生成专业内容。
                    </AlertDescription>
                  </Alert>
                )}
                
                {testResults.some(r => r.status === 'error') && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      部分智能体系统测试失败，请检查 API 密钥是否正确，以及网络连接是否正常。
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-center">
                  <Button 
                    onClick={runAllTests} 
                    disabled={isRunning}
                    size="lg"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        测试中...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        重新运行所有测试
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentTestPage;
