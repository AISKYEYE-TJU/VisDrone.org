import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Shield, Trash2, Edit, Plus, Search, 
  MoreVertical, CheckCircle, XCircle, Clock, 
  LogActivity, Download, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  department?: string;
  studentId?: string;
  title?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

interface OperationLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details?: string;
  ip: string;
  timestamp: string;
}

const mockUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@lab.edu.cn', name: '管理员', role: 'admin', department: '系统管理', status: 'active', createdAt: '2025-01-01', lastLogin: '2026-03-03' },
  { id: '2', username: 'zhao', email: 'zhao@lab.edu.cn', name: '赵天娇', role: 'teacher', department: '艺术学院', title: '副教授', status: 'active', createdAt: '2025-01-15', lastLogin: '2026-03-02' },
  { id: '3', username: 'stu001', email: 'stu001@lab.edu.cn', name: '张三', role: 'student', department: '设计学', studentId: '2024001', status: 'active', createdAt: '2025-09-01', lastLogin: '2026-03-01' },
  { id: '4', username: 'stu002', email: 'stu002@lab.edu.cn', name: '李四', role: 'student', department: '计算机科学', studentId: '2024002', status: 'active', createdAt: '2025-09-01', lastLogin: '2026-02-28' },
  { id: '5', username: 'stu003', email: 'stu003@lab.edu.cn', name: '王五', role: 'student', department: '设计学', studentId: '2024003', status: 'inactive', createdAt: '2025-09-01', lastLogin: '2026-01-15' },
];

const mockLogs: OperationLog[] = [
  { id: '1', userId: '1', userName: '管理员', action: '登录', target: '系统', timestamp: '2026-03-03 10:30:00', ip: '192.168.1.100' },
  { id: '2', userId: '2', userName: '赵天娇', action: '修改', target: '用户信息', details: '更新了张三的权限', timestamp: '2026-03-03 09:15:00', ip: '192.168.1.101' },
  { id: '3', userId: '1', userName: '管理员', action: '删除', target: '新闻', details: '删除了过期活动通知', timestamp: '2026-03-02 16:45:00', ip: '192.168.1.100' },
  { id: '4', userId: '2', userName: '赵天娇', action: '创建', target: '新闻', details: '发布了新的招生信息', timestamp: '2026-03-02 14:20:00', ip: '192.168.1.101' },
  { id: '5', userId: '1', userName: '管理员', action: '审核', target: '用户', details: '通过了用户注册申请', timestamp: '2026-03-01 11:00:00', ip: '192.168.1.100' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    name: '',
    role: 'student' as const,
    department: '',
    studentId: '',
    title: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    const user: User = {
      id: String(users.length + 1),
      ...newUser,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, user]);
    setIsAddDialogOpen(false);
    setNewUser({ username: '', email: '', name: '', role: 'student', department: '', studentId: '', title: '' });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('确定要删除此用户吗？')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const roleConfig = {
    admin: { label: '管理员', color: 'bg-red-100 text-red-700' },
    teacher: { label: '教师', color: 'bg-blue-100 text-blue-700' },
    student: { label: '学生', color: 'bg-green-100 text-green-700' }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">总用户数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                <p className="text-xs text-muted-foreground">管理员</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'teacher').length}</p>
                <p className="text-xs text-muted-foreground">教师</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'student').length}</p>
                <p className="text-xs text-muted-foreground">学生</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="teacher">教师</SelectItem>
                <SelectItem value="student">学生</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  添加用户
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新用户</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>用户名</Label>
                      <Input 
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>邮箱</Label>
                      <Input 
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>姓名</Label>
                    <Input 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="真实姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>角色</Label>
                    <Select value={newUser.role} onValueChange={(v: any) => setNewUser({...newUser, role: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">学生</SelectItem>
                        <SelectItem value="teacher">教师</SelectItem>
                        <SelectItem value="admin">管理员</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>院系/部门</Label>
                    <Input 
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      placeholder="所属院系"
                    />
                  </div>
                  <Button onClick={handleAddUser} className="w-full">确认添加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>院系/部门</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleConfig[user.role].color}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status === 'active' ? '活跃' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{user.createdAt}</TableCell>
                  <TableCell className="text-sm">{user.lastLogin || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id)}>
                        {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const OperationLogs: React.FC = () => {
  const [logs] = useState<OperationLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const actionConfig: Record<string, { label: string; color: string }> = {
    登录: { label: '登录', color: 'bg-green-100 text-green-700' },
    创建: { label: '创建', color: 'bg-blue-100 text-blue-700' },
    修改: { label: '修改', color: 'bg-yellow-100 text-yellow-700' },
    删除: { label: '删除', color: 'bg-red-100 text-red-700' },
    审核: { label: '审核', color: 'bg-purple-100 text-purple-700' }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <LogActivity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-xs text-muted-foreground">总操作记录</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logs.filter(l => l.timestamp.includes('2026-03-03')).length}</p>
                <p className="text-xs text-muted-foreground">今日操作</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(logs.map(l => l.userId)).size}</p>
                <p className="text-xs text-muted-foreground">操作用户数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索操作记录..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="操作类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部操作</SelectItem>
                <SelectItem value="登录">登录</SelectItem>
                <SelectItem value="创建">创建</SelectItem>
                <SelectItem value="修改">修改</SelectItem>
                <SelectItem value="删除">删除</SelectItem>
                <SelectItem value="审核">审核</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出日志
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>操作日志</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>操作类型</TableHead>
                <TableHead>操作对象</TableHead>
                <TableHead>详情</TableHead>
                <TableHead>IP地址</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    <Badge className={actionConfig[log.action]?.color || 'bg-gray-100'}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {log.details || '-'}
                  </TableCell>
                  <TableCell className="text-sm">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminEnhancedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold mb-6">用户与日志管理</h1>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <LogActivity className="w-4 h-4" />
              操作日志
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="logs">
            <OperationLogs />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminEnhancedPage;
