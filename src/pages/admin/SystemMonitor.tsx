import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Server, Clock, AlertCircle, 
  CheckCircle, TrendingUp, Zap, Eye,
  RefreshCw, Wifi, Database, HardDrive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 模拟系统状态数据
const SYSTEM_STATUS = {
  website: { status: 'online', uptime: '99.9%', lastCheck: '刚刚' },
  api: { status: 'online', uptime: '99.8%', lastCheck: '1 分钟前' },
  database: { status: 'online', uptime: '100%', lastCheck: '刚刚' },
  storage: { status: 'normal', used: 23, total: 100 }
};

// 模拟错误日志
const ERROR_LOGS = [
  {
    id: 1,
    time: '2024-03-01 10:23:45',
    level: 'warning',
    module: 'API',
    message: 'API 响应超时，已自动重试'
  },
  {
    id: 2,
    time: '2024-02-29 15:12:33',
    level: 'info',
    module: 'System',
    message: '系统自动更新完成'
  },
  {
    id: 3,
    time: '2024-02-28 09:45:21',
    level: 'error',
    module: 'Database',
    message: '数据库连接失败，已自动重连'
  }
];

// 模拟性能数据
const PERFORMANCE_DATA = {
  pageLoad: 1.2,
  apiResponse: 3.2,
  resourceUsage: {
    cpu: 35,
    memory: 62,
    storage: 23
  }
};

const SystemMonitor: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState(ERROR_LOGS);
  const [performanceData, setPerformanceData] = useState(PERFORMANCE_DATA);

  // 模拟刷新数据
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => ({
        ...prev,
        resourceUsage: {
          cpu: Math.min(100, Math.max(20, prev.resourceUsage.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.min(100, Math.max(40, prev.resourceUsage.memory + (Math.random() - 0.5) * 5)),
          storage: prev.resourceUsage.storage
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  // 获取日志级别样式
  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">系统监控</h2>
          <p className="text-muted-foreground">实时监控系统性能和运行状态</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {/* 系统状态 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">网站状态</CardTitle>
            <Wifi className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(SYSTEM_STATUS.website.status)}
              <span className="text-2xl font-bold">{SYSTEM_STATUS.website.uptime}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              最后检查：{SYSTEM_STATUS.website.lastCheck}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API 服务</CardTitle>
            <Server className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(SYSTEM_STATUS.api.status)}
              <span className="text-2xl font-bold">{SYSTEM_STATUS.api.uptime}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              最后检查：{SYSTEM_STATUS.api.lastCheck}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据库</CardTitle>
            <Database className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(SYSTEM_STATUS.database.status)}
              <span className="text-2xl font-bold">{SYSTEM_STATUS.database.uptime}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              最后检查：{SYSTEM_STATUS.database.lastCheck}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">存储空间</CardTitle>
            <HardDrive className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SYSTEM_STATUS.storage.used}GB</div>
            <Progress value={SYSTEM_STATUS.storage.used} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              总共 {SYSTEM_STATUS.storage.total}GB
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <TrendingUp className="w-4 h-4 mr-2" />
            性能监控
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="w-4 h-4 mr-2" />
            系统日志
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Zap className="w-4 h-4 mr-2" />
            资源使用
          </TabsTrigger>
        </TabsList>

        {/* 性能监控 */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  页面加载性能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">首页加载时间</span>
                      <span className="text-sm font-medium">{performanceData.pageLoad}s</span>
                    </div>
                    <Progress value={(performanceData.pageLoad / 3) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">API 响应时间</span>
                      <span className="text-sm font-medium">{performanceData.apiResponse}s</span>
                    </div>
                    <Progress value={(performanceData.apiResponse / 5) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">性能指标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <span className="text-sm">页面性能评分</span>
                  <Badge variant="default">95/100</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                  <span className="text-sm">SEO 评分</span>
                  <Badge variant="default">98/100</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                  <span className="text-sm">可访问性评分</span>
                  <Badge variant="default">92/100</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>性能趋势</CardTitle>
              <CardDescription>最近 7 天的平均响应时间</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['02-24', '02-25', '02-26', '02-27', '02-28', '02-29', '03-01'].map((date, index) => {
                  const responseTime = 2.8 + Math.random() * 0.8;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-16">{date}</span>
                      <div className="flex-1">
                        <div 
                          className="h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${(responseTime / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {responseTime.toFixed(2)}s
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统日志 */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>错误日志</CardTitle>
              <CardDescription>最近的系统错误和警告信息</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div 
                      key={log.id}
                      className={`p-3 rounded-md border ${getLevelStyle(log.level)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {log.level === 'error' && <AlertCircle className="w-4 h-4" />}
                          {log.level === 'warning' && <AlertCircle className="w-4 h-4" />}
                          {log.level === 'info' && <CheckCircle className="w-4 h-4" />}
                          <Badge variant="outline" className="text-xs">
                            {log.module}
                          </Badge>
                        </div>
                        <span className="text-xs opacity-70">{log.time}</span>
                      </div>
                      <p className="text-sm mt-2">{log.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 资源使用 */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CPU 使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {performanceData.resourceUsage.cpu.toFixed(1)}%
                </div>
                <Progress value={performanceData.resourceUsage.cpu} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  服务器 CPU 使用率
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">内存使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {performanceData.resourceUsage.memory.toFixed(1)}%
                </div>
                <Progress value={performanceData.resourceUsage.memory} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  系统内存使用率
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">存储使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {performanceData.resourceUsage.storage}%
                </div>
                <Progress value={performanceData.resourceUsage.storage} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  磁盘存储空间
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>资源使用建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-md border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800">资源使用正常</h4>
                    <p className="text-sm text-green-700 mt-1">
                      当前系统资源使用率在正常范围内，无需优化
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">优化建议</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 定期清理缓存文件，释放存储空间</li>
                    <li>• 监控 API 调用频率，避免配额超限</li>
                    <li>• 定期检查错误日志，及时修复问题</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitor;
