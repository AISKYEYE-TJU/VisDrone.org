// 用户类型定义
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string; // 学号（仅学生）
  title?: string; // 职称（仅老师）
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  title?: string;
}

// 模拟用户数据（实际应该从后端获取）
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@seu.edu.cn',
    name: '系统管理员',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'teacher-1',
    username: 'zhao',
    email: 'zhaotianjiao@seu.edu.cn',
    name: '赵天娇',
    role: 'teacher',
    title: '创始人',
    department: '人机协同设计实验室',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'student-1',
    username: 'stu2024001',
    email: 'student1@seu.edu.cn',
    name: '张三',
    role: 'student',
    studentId: '2024001',
    department: '设计学',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'student-2',
    username: 'stu2024002',
    email: 'student2@seu.edu.cn',
    name: '李四',
    role: 'student',
    studentId: '2024002',
    department: '设计学',
    createdAt: new Date('2024-09-01'),
  },
];

// 模拟密码（实际应该加密存储）
const mockPasswords: Record<string, string> = {
  'admin': 'admin123',
  'zhao': 'teacher123',
  'stu2024001': 'student123',
  'stu2024002': 'student123',
};

// 认证服务
export const authService = {
  // 登录
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.username === credentials.username);
    if (!user) {
      throw new Error('用户名不存在');
    }
    
    const password = mockPasswords[credentials.username];
    if (password !== credentials.password) {
      throw new Error('密码错误');
    }
    
    // 更新最后登录时间
    user.lastLogin = new Date();
    
    return user;
  },

  // 注册
  register: async (data: RegisterData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查用户名是否已存在
    const existingUser = mockUsers.find(u => u.username === data.username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }
    
    // 检查邮箱是否已存在
    const existingEmail = mockUsers.find(u => u.email === data.email);
    if (existingEmail) {
      throw new Error('邮箱已被使用');
    }
    
    const newUser: User = {
      id: `${data.role}-${Date.now()}`,
      username: data.username,
      email: data.email,
      name: data.name,
      role: data.role,
      department: data.department,
      studentId: data.studentId,
      title: data.title,
      createdAt: new Date(),
    };
    
    mockUsers.push(newUser);
    mockPasswords[data.username] = data.password;
    
    return newUser;
  },

  // 登出
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // 清除本地存储
    localStorage.removeItem('currentUser');
  },

  // 获取当前用户
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      // 直接返回从localStorage中读取的用户信息
      return user;
    } catch {
      return null;
    }
  },

  // 保存用户到本地存储
  saveUser: (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
};

// 权限检查工具
export const permissionUtils = {
  // 检查是否为管理员
  isAdmin: (user: User | null): boolean => {
    return user?.role === 'admin';
  },

  // 检查是否为老师
  isTeacher: (user: User | null): boolean => {
    return user?.role === 'teacher';
  },

  // 检查是否为学生
  isStudent: (user: User | null): boolean => {
    return user?.role === 'student';
  },

  // 检查是否可以访问后台
  canAccessAdmin: (user: User | null): boolean => {
    return user?.role === 'admin';
  },


};
