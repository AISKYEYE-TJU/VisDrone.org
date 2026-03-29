import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Bot, Server, Activity, 
  Zap, RefreshCw, CheckCircle, AlertCircle,
  Settings, Key, BarChart3, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

// 智能体数据 - 包含所有网站设计的智能体
const AGENTS_DATA = [
  // 系统级智能体
  {
    id: 'multi-agent',
    name: '多智能体协同设计系统',
    type: 'system',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 1234,
    avgResponseTime: 3611,
    successRate: 100,
    lastActive: '刚刚',
    description: '协调多个智能体完成设计任务'
  },
  {
    id: 'virtual-student',
    name: '团队成员智能体',
    type: 'agent',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 856,
    avgResponseTime: 2636,
    successRate: 100,
    lastActive: '刚刚',
    description: '提供专业知识和交互能力'
  },
  {
    id: 'group-meeting',
    name: '线上组会系统',
    type: 'system',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 432,
    avgResponseTime: 3921,
    successRate: 100,
    lastActive: '5 分钟前',
    description: '组织和管理线上学术讨论'
  },
  // 虚拟博士生智能体
  {
    id: 'phd-ai-1',
    name: '智绘',
    nameEn: 'Zhi Hui',
    type: 'virtual-member',
    role: 'PhD',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 234,
    avgResponseTime: 2890,
    successRate: 99.8,
    lastActive: '10 分钟前',
    description: '专注于生成式设计算法研究',
    researchInterests: ['生成式 AI', '创意算法', '设计自动化']
  },
  {
    id: 'phd-ai-2',
    name: '交互',
    nameEn: 'Jiao Hu',
    type: 'virtual-member',
    role: 'PhD',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 189,
    avgResponseTime: 3120,
    successRate: 99.5,
    lastActive: '15 分钟前',
    description: '研究多模态交互界面设计',
    researchInterests: ['多模态交互', '界面设计', '用户体验']
  },
  {
    id: 'phd-ai-3',
    name: '群智',
    nameEn: 'Qun Zhi',
    type: 'virtual-member',
    role: 'PhD',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 156,
    avgResponseTime: 3450,
    successRate: 99.9,
    lastActive: '20 分钟前',
    description: '研究集体智慧在设计过程中的应用',
    researchInterests: ['群智设计', '协作系统', '创新方法']
  },
  // 虚拟硕士生智能体
  {
    id: 'master-ai-1',
    name: '创想',
    nameEn: 'Chuang Xiang',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 178,
    avgResponseTime: 2750,
    successRate: 99.7,
    lastActive: '25 分钟前',
    description: '专注于 AI 辅助创意生成',
    researchInterests: ['创意生成', '设计思维', 'AI 辅助设计']
  },
  {
    id: 'master-ai-2',
    name: '视觉',
    nameEn: 'Shi Jue',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 145,
    avgResponseTime: 2980,
    successRate: 99.6,
    lastActive: '30 分钟前',
    description: '研究计算机视觉在设计中的应用',
    researchInterests: ['计算机视觉', '视觉设计', '风格迁移']
  },
  {
    id: 'master-ai-3',
    name: '体验',
    nameEn: 'Ti Yan',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 167,
    avgResponseTime: 3050,
    successRate: 99.4,
    lastActive: '35 分钟前',
    description: '专注于用户体验评估与优化',
    researchInterests: ['用户体验', '行为分析', '数据可视化']
  },
  {
    id: 'master-ai-4',
    name: '代码',
    nameEn: 'Dai Ma',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 198,
    avgResponseTime: 2850,
    successRate: 99.8,
    lastActive: '40 分钟前',
    description: '研究创意编程与生成艺术',
    researchInterests: ['创意编程', '生成艺术', '交互装置']
  },
  {
    id: 'master-ai-5',
    name: '语言',
    nameEn: 'Yu Yan',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 134,
    avgResponseTime: 3100,
    successRate: 99.3,
    lastActive: '45 分钟前',
    description: '研究自然语言处理在设计中的应用',
    researchInterests: ['NLP', '对话系统', '设计助手']
  },
  {
    id: 'master-ai-6',
    name: '伦理',
    nameEn: 'Lun Li',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 112,
    avgResponseTime: 2950,
    successRate: 99.9,
    lastActive: '50 分钟前',
    description: '研究 AI 设计工具的伦理问题',
    researchInterests: ['AI 伦理', '设计伦理', '负责任创新']
  },
  {
    id: 'master-ai-7',
    name: '教育',
    nameEn: 'Jiao Yu',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 156,
    avgResponseTime: 3200,
    successRate: 99.5,
    lastActive: '55 分钟前',
    description: '研究 AI 在设计教育中的应用',
    researchInterests: ['设计教育', '智能教学', '教育技术']
  },
  {
    id: 'master-ai-8',
    name: '未来',
    nameEn: 'Wei Lai',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 123,
    avgResponseTime: 3080,
    successRate: 99.6,
    lastActive: '1 小时前',
    description: '探索未来设计趋势',
    researchInterests: ['未来设计', '技术趋势', '设计预见']
  },
  {
    id: 'master-ai-9',
    name: '对齐',
    nameEn: 'Dui Qi',
    type: 'virtual-member',
    role: 'Master',
    status: 'active',
    model: 'qwen3.5-flash',
    apiCalls: 145,
    avgResponseTime: 3150,
    successRate: 99.7,
    lastActive: '1 小时前',
    description: '研究人的设计价值如何和机器对齐，如何让机器掌握人的审美、刺激人的审美、提高人的审美',
    researchInterests: ['价值对齐', '审美计算', '设计美学', '人机协同设计']
  }
];

// 模拟 API 使用统计
const API_STATS = {
  totalCalls: 12567,
  successRate: 99.8,
  avgResponseTime: 3200,
  quotaUsed: 8500,
  quotaTotal: 10000,
  dailyUsage: [
    { date: '2024-02-24', calls: 1234 },
    { date: '2024-02-25', calls: 1456 },
    { date: '2024-02-26', calls: 1678 },
    { date: '2024-02-27', calls: 1890 },
    { date: '2024-02-28', calls: 2012 },
    { date: '2024-02-29', calls: 2234 },
    { date: '2024-03-01', calls: 2063 }
  ]
};

const AgentManager: React.FC = () => {
  const [apiKey, setApiKey] = useState('sk-8c277633f58644eab6f4fe91f2d8e53f');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // 刷新状态
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // 测试智能体
  const handleTestAgent = (agentId: string) => {
    console.log('测试智能体:', agentId);
    alert('智能体测试已启动，请查看测试结果页面');
  };

  // 保存配置
  const handleSaveConfig = () => {
    console.log('保存 API 配置:', apiKey);
    alert('配置已保存');
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">智能体与 API 管理</h2>
          <p className="text-muted-foreground">管理 AI 智能体配置和 API 调用</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新状态
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API 调用总数</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{API_STATS.totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              成功率 {API_STATS.successRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均响应时间</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{API_STATS.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              优于目标值
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API 配额使用</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((API_STATS.quotaUsed / API_STATS.quotaTotal) * 100)}%
            </div>
            <Progress value={(API_STATS.quotaUsed / API_STATS.quotaTotal) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {API_STATS.quotaUsed.toLocaleString()} / {API_STATS.quotaTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃智能体</CardTitle>
            <Brain className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AGENTS_DATA.filter(a => a.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              共 {AGENTS_DATA.length} 个智能体
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">
            <Brain className="w-4 h-4 mr-2" />
            智能体列表
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="w-4 h-4 mr-2" />
            API 配置
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="w-4 h-4 mr-2" />
            使用统计
          </TabsTrigger>
        </TabsList>

        {/* 智能体列表 */}
        <TabsContent value="agents" className="space-y-4">
          {/* 智能体分类统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">系统级智能体</CardTitle>
                <Server className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{AGENTS_DATA.filter(a => a.type === 'system').length}</div>
                <p className="text-xs text-muted-foreground">
                  {AGENTS_DATA.filter(a => a.type === 'system' && a.status === 'active').length} 个运行中
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">博士生智能体</CardTitle>
                <Brain className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{AGENTS_DATA.filter(a => a.role === 'PhD').length}</div>
                <p className="text-xs text-muted-foreground">
                  {AGENTS_DATA.filter(a => a.role === 'PhD' && a.status === 'active').length} 个运行中
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">硕士生智能体</CardTitle>
                <Bot className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{AGENTS_DATA.filter(a => a.role === 'Master').length}</div>
                <p className="text-xs text-muted-foreground">
                  {AGENTS_DATA.filter(a => a.role === 'Master' && a.status === 'active').length} 个运行中
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 智能体列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS_DATA.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {agent.type === 'system' && <Server className="w-5 h-5 text-blue-600" />}
                      {agent.role === 'PhD' && <Brain className="w-5 h-5 text-purple-600" />}
                      {agent.role === 'Master' && <Bot className="w-5 h-5 text-green-600" />}
                      {agent.type === 'agent' && <Bot className="w-5 h-5 text-green-600" />}
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {agent.nameEn && <span className="mr-2">{agent.nameEn}</span>}
                          {agent.role && <Badge variant="outline" className="text-xs ml-1">{agent.role}</Badge>}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {agent.status === 'active' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          运行中
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          离线
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{agent.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agent.researchInterests && agent.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {agent.researchInterests.slice(0, 3).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">模型:</span>
                      <span className="ml-1 font-medium">{agent.model}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">调用:</span>
                      <span className="ml-1 font-medium">{agent.apiCalls}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">响应:</span>
                      <span className="ml-1 font-medium">{agent.avgResponseTime}ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">成功率:</span>
                      <span className="ml-1 font-medium">{agent.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleTestAgent(agent.id)}
                    >
                      测试
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      配置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API 配置 */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通义千问 API 配置</CardTitle>
              <CardDescription>配置阿里云 DashScope API 访问密钥</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveConfig}>
                    <Settings className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  API Key 用于访问通义千问大模型服务，请妥善保管
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">API 使用提示</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 当前模型：qwen3.5-flash（最新优化版本）</li>
                  <li>• 基础超时：10 秒（第一次尝试）</li>
                  <li>• 重试机制：3 次递增超时（10s → 20s → 30s）</li>
                  <li>• 平均响应时间：3200ms</li>
                </ul>
              </div>

              <div>
                <Label>高级设置</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="maxTokens" className="text-xs">最大 Token 数</Label>
                    <Input id="maxTokens" type="number" defaultValue={2000} />
                  </div>
                  <div>
                    <Label htmlFor="temperature" className="text-xs">Temperature</Label>
                    <Input id="temperature" type="number" step="0.1" min="0" max="1" defaultValue={0.7} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 使用统计 */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API 调用趋势</CardTitle>
              <CardDescription>最近 7 天的 API 调用统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {API_STATS.dailyUsage.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">{day.date}</span>
                    <div className="flex-1">
                      <div 
                        className="h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${(day.calls / 2500) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{day.calls}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">性能指标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">平均响应时间</span>
                  <span className="text-sm font-medium">{API_STATS.avgResponseTime}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">成功率</span>
                  <span className="text-sm font-medium text-green-600">{API_STATS.successRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">超时率</span>
                  <span className="text-sm font-medium text-green-600">0%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">配额使用</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">已用配额</span>
                  <span className="text-sm font-medium">{API_STATS.quotaUsed.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">总配额</span>
                  <span className="text-sm font-medium">{API_STATS.quotaTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">剩余配额</span>
                  <span className="text-sm font-medium text-green-600">
                    {(API_STATS.quotaTotal - API_STATS.quotaUsed).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentManager;
