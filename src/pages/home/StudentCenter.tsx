import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, BookOpen, Folder, FileText, Calendar, 
  MessageSquare, Bell, Settings, LogOut, ChevronRight,
  Award, Users, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser, UserRole } from '@/lib/auth';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

interface StudentData {
  profile: {
    name: string;
    email: string;
    role: string;
    year: string;
    major: string;
    avatar?: string;
  };
  projects: {
    id: string;
    name: string;
    role: string;
    status: 'ongoing' | 'completed';
    startDate: string;
  }[];
  publications: {
    id: string;
    title: string;
    role: string;
    year: number;
    venue: string;
  }[];
  applications: {
    id: string;
    type: string;
    status: 'pending' | 'interview' | 'approved' | 'rejected';
    date: string;
  }[];
}

const defaultStudentData: StudentData = {
  profile: {
    name: '学生用户',
    email: 'student@lab.edu.cn',
    role: '硕士研究生',
    year: '2024级',
    major: '设计学'
  },
  projects: [
    {
      id: 'proj-1',
      name: '智能产品设计系统研究',
      role: '主要成员',
      status: 'ongoing',
      startDate: '2025-09'
    }
  ],
  publications: [
    {
      id: 'pub-1',
      title: '基于深度学习的用户体验研究',
      role: '第一作者',
      year: 2025,
      venue: 'CHI 2025'
    }
  ],
  applications: []
};

const StudentCenter: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(currentUser);
  const [studentData, setStudentData] = useState<StudentData>(defaultStudentData);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (parsedUser.role === 'student') {
        const storedData = localStorage.getItem('studentData');
        if (storedData) {
          setStudentData(JSON.parse(storedData));
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const stats = [
    { label: '参与项目', value: studentData.projects.length, icon: Folder, color: 'text-blue-500' },
    { label: '发表论文', value: studentData.publications.length, icon: FileText, color: 'text-green-500' },
    { label: '申请记录', value: studentData.applications.length, icon: Award, color: 'text-purple-500' }
  ];

  const statusConfig = {
    pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    interview: { label: '面试中', color: 'bg-blue-100 text-blue-700', icon: Users },
    approved: { label: '已通过', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              人机协同设计实验室
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div {...fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10">
                        {user?.name?.charAt(0) || '学'}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user?.name || studentData.profile.name}</h2>
                    <p className="text-muted-foreground">{user?.email || studentData.profile.email}</p>
                    <Badge className="mt-2" variant="secondary">
                      {studentData.profile.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student">
                        <User className="w-4 h-4 mr-2" />
                        个人中心
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student/projects">
                        <Folder className="w-4 h-4 mr-2" />
                        我的项目
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student/publications">
                        <FileText className="w-4 h-4 mr-2" />
                        我的论文
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student/applications">
                        <Award className="w-4 h-4 mr-2" />
                        申请记录
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome & Stats */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">欢迎回来，{user?.name || studentData.profile.name}！</h2>
                      <p className="text-white/80">
                        {studentData.profile.year} · {studentData.profile.major}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-white/70">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Folder className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">参与项目</h3>
                      <p className="text-sm text-muted-foreground">{studentData.projects.filter(p => p.status === 'ongoing').length}个进行中</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">学术成果</h3>
                      <p className="text-sm text-muted-foreground">{studentData.publications.length}篇论文</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">消息通知</h3>
                      <p className="text-sm text-muted-foreground">0条未读</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Ongoing Projects */}
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="w-5 h-5" />
                    进行中的项目
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {studentData.projects.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">暂无参与项目</p>
                      <Button className="mt-4" variant="outline">
                        申请加入项目
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentData.projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {project.role} · 开始于 {project.startDate}
                            </p>
                          </div>
                          <Badge variant={project.status === 'ongoing' ? 'default' : 'secondary'}>
                            {project.status === 'ongoing' ? '进行中' : '已完成'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Applications */}
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    申请记录
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {studentData.applications.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">暂无申请记录</p>
                      <Button className="mt-4" asChild>
                        <Link to="/join">申请加入实验室</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentData.applications.map((app) => {
                        const config = statusConfig[app.status];
                        const StatusIcon = config.icon;
                        return (
                          <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-semibold">{app.type}</h4>
                              <p className="text-sm text-muted-foreground">申请时间: {app.date}</p>
                            </div>
                            <Badge className={config.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCenter;
