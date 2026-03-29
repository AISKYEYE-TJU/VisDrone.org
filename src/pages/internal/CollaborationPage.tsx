import React from 'react';
import { Users, Folder, Calendar, MessageSquare, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CollaborationPage: React.FC = () => {
  const projects = [
    {
      title: 'AI辅助设计创意生成研究',
      members: 4,
      status: '进行中',
      progress: 65,
      deadline: '2025-04-15'
    },
    {
      title: '用户体验评估方法研究',
      members: 3,
      status: '进行中',
      progress: 40,
      deadline: '2025-05-01'
    },
    {
      title: 'CHI 2025 论文撰写',
      members: 5,
      status: '进行中',
      progress: 80,
      deadline: '2025-03-20'
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">团队协作</h1>
          <p className="text-muted-foreground">团队项目与任务管理</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新建项目
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              进行中的项目
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{project.title}</h4>
                  <Badge>{project.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.members} 人
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.deadline}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{project.progress}% 完成</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              最近讨论
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">研究方案讨论</p>
                <p className="text-xs text-muted-foreground mt-1">3条新消息</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaborationPage;
