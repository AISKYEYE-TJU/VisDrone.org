import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Folder, Award, Bell, Settings, LogOut,
  Calendar, MessageSquare, TrendingUp, UserPlus, CheckCircle,
  XCircle, Clock, ChevronRight, Mail, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser } from '@/lib/auth';
import { contactService } from '@/services/newsService';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

interface StudentApplication {
  id: string;
  student_name: string;
  student_email: string;
  position: string;
  education: string;
  school: string;
  research_interest: string;
  status: 'pending' | 'interview' | 'approved' | 'rejected';
  created_at: string;
}

const defaultApplications: StudentApplication[] = [
  {
    id: 'app-1',
    student_name: '张三',
    student_email: 'zhangsan@email.com',
    position: '博士研究生',
    education: '本科 - 清华大学',
    school: '清华大学',
    research_interest: '人机交互、人工智能设计',
    status: 'pending',
    created_at: '2026-02-20'
  },
  {
    id: 'app-2',
    student_name: '李四',
    student_email: 'lisi@email.com',
    position: '硕士研究生',
    education: '本科 - 浙江大学',
    school: '浙江大学',
    research_interest: '智能产品设计',
    status: 'interview',
    created_at: '2026-02-18'
  }
];

const defaultMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: '王五',
    email: 'wangwu@email.com',
    subject: '招生咨询',
    message: '老师您好，我想咨询一下实验室今年是否招收硕士研究生？',
    status: 'unread',
    created_at: '2026-02-25'
  },
  {
    id: 'msg-2',
    name: '赵六',
    email: 'zhaoliu@email.com',
    subject: '学术合作',
    message: '您好，我是XX大学的教授，希望探讨合作研究的可能性。',
    status: 'read',
    created_at: '2026-02-24'
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(currentUser);
  const [applications, setApplications] = useState<StudentApplication[]>(defaultApplications);
  const [messages, setMessages] = useState<ContactMessage[]>(defaultMessages);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    const loadData = async () => {
      const msgs = await contactService.getMessages();
      if (msgs.length > 0) {
        setMessages(msgs);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleUpdateApplication = (id: string, status: StudentApplication['status']) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const handleReplyMessage = async (id: string) => {
    await contactService.markAsRead(id);
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status: 'replied' } : msg
    ));
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const stats = [
    { label: '学生申请', value: pendingCount, icon: UserPlus, color: 'bg-blue-100 text-blue-600' },
    { label: '未读消息', value: unreadCount, icon: Mail, color: 'bg-red-100 text-red-600' },
    { label: '在读学生', value: 8, icon: Users, color: 'bg-green-100 text-green-600' },
    { label: '今年论文', value: 5, icon: FileText, color: 'bg-purple-100 text-purple-600' }
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
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-primary">
                人机协同设计实验室
              </Link>
              <Badge variant="outline">教师后台</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <Settings className="w-5 h-5 mr-1" />
                  管理后台
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{unreadCount}</Badge>
                )}
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
                        {user?.name?.charAt(0) || '教'}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user?.name || '教师'}</h2>
                    <p className="text-muted-foreground">{user?.email || 'teacher@lab.edu.cn'}</p>
                    <Badge className="mt-2">实验室负责人</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      数据概览
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <UserPlus className="w-4 h-4 mr-2" />
                      招生管理
                      {pendingCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center">{pendingCount}</Badge>
                      )}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      消息中心
                      {unreadCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center">{unreadCount}</Badge>
                      )}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Folder className="w-4 h-4 mr-2" />
                      项目管理
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      论文管理
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Applications & Messages */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Tabs defaultValue="applications">
                <TabsList className="mb-4">
                  <TabsTrigger value="applications" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    招生申请
                    {pendingCount > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {pendingCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    消息中心
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Applications Tab */}
                <TabsContent value="applications">
                  <Card>
                    <CardHeader>
                      <CardTitle>学生申请</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {applications.map((app) => {
                          const config = statusConfig[app.status];
                          const StatusIcon = config.icon;
                          return (
                            <div key={app.id} className="flex items-start justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{app.student_name}</h4>
                                  <Badge className={config.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {config.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{app.position}</p>
                                <p className="text-sm text-muted-foreground">{app.school} · {app.education}</p>
                                <p className="text-sm mt-1"><strong>研究兴趣：</strong>{app.research_interest}</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                {app.status === 'pending' && (
                                  <>
                                    <Button size="sm" onClick={() => handleUpdateApplication(app.id, 'interview')}>
                                      安排面试
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleUpdateApplication(app.id, 'rejected')}>
                                      拒绝
                                    </Button>
                                  </>
                                )}
                                {app.status === 'interview' && (
                                  <Button size="sm" onClick={() => handleUpdateApplication(app.id, 'approved')}>
                                    录取
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages">
                  <Card>
                    <CardHeader>
                      <CardTitle>联系消息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div key={msg.id} className={`p-4 border rounded-lg ${msg.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{msg.name}</h4>
                                  {msg.status === 'unread' && (
                                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center">新</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{msg.email}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{msg.created_at}</span>
                            </div>
                            <p className="text-sm font-medium mb-1">{msg.subject}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={`mailto:${msg.email}`}>回复邮件</a>
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReplyMessage(msg.id)}>
                                标记已读
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
