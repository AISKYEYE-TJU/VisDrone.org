import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Folder, Award, TrendingUp, Calendar,
  Activity, Globe, Clock, ArrowUp, ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const DashboardStats: React.FC = () => {
  const stats: StatCard[] = [
    { title: '总访问量', value: '12,580', change: 12.5, icon: Globe, color: 'bg-blue-500' },
    { title: '注册用户', value: '856', change: 8.2, icon: Users, color: 'bg-green-500' },
    { title: '论文总数', value: '156', change: 5.3, icon: FileText, color: 'bg-purple-500' },
    { title: '在研项目', value: '28', change: -2.1, icon: Folder, color: 'bg-orange-500' },
  ];

  const monthlyData = [
    { month: '1月', visits: 1200, users: 45, papers: 8 },
    { month: '2月', visits: 1350, users: 52, papers: 12 },
    { month: '3月', visits: 1100, users: 38, papers: 6 },
    { month: '4月', visits: 1600, users: 68, papers: 15 },
    { month: '5月', visits: 1800, users: 75, papers: 18 },
    { month: '6月', visits: 2100, users: 92, papers: 22 },
  ];

  const topPages = [
    { name: '首页', views: 4520, percentage: 35.9 },
    { name: '团队介绍', views: 2150, percentage: 17.1 },
    { name: '研究成果', views: 1890, percentage: 15.0 },
    { name: '招生信息', views: 1560, percentage: 12.4 },
    { name: '关于我们', views: 1240, percentage: 9.9 },
  ];

  const recentActivities = [
    { type: 'user', message: '新用户注册: zhangsan@email.com', time: '5分钟前' },
    { type: 'paper', message: '新论文发布: 基于深度学习的用户体验研究', time: '1小时前' },
    { type: 'application', message: '新的招生申请来自: 李四', time: '2小时前' },
    { type: 'message', message: '收到新的联系消息: 王五', time: '3小时前' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} {...fadeInUp} transition={{ delay: index * 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change !== undefined && (
                    <Badge variant={stat.change > 0 ? 'default' : 'destructive'} className="flex items-center gap-1">
                      {stat.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              月度趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-muted-foreground">{data.month}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.visits / 2500) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{data.visits}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              热门页面
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.name} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1">{page.name}</span>
                  <span className="text-sm text-muted-foreground">{page.views}</span>
                  <Badge variant="secondary">{page.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            最近动态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'paper' ? 'bg-green-500' :
                  activity.type === 'application' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
