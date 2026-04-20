import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

export interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 默认管理员账户（开发测试用）
// 生产环境请在 Supabase Dashboard → Authentication → Users 中创建真实用户
const DEFAULT_ADMIN = {
  email: 'admin@visdrone.org',
  password: 'visdrone',
};

class AuthService {
  private currentUser: AdminUser | null = null;
  private listeners: ((state: AuthState) => void)[] = [];

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // 开发模式：使用默认账户
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      this.currentUser = {
        id: 'dev-admin-001',
        email: DEFAULT_ADMIN.email,
        role: 'admin',
      };
      this.notifyListeners();
      toast.success('登录成功（开发模式）');
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`登录失败: ${error.message}`);
        return { success: false, error: error.message };
      }

      if (data.user) {
        this.currentUser = {
          id: data.user.id,
          email: data.user.email || email,
          role: 'admin',
        };
        this.notifyListeners();
        toast.success('登录成功');
        return { success: true };
      }

      return { success: false, error: '登录失败' };
    } catch (err) {
      console.error('Sign in error:', err);
      return { success: false, error: (err as Error).message };
    }
  }

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
      this.notifyListeners();
      toast.success('已退出登录');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        this.currentUser = {
          id: user.id,
          email: user.email || '',
          role: 'admin',
        };
        return this.currentUser;
      }
    } catch (err) {
      console.error('Get current user error:', err);
    }

    this.currentUser = null;
    return null;
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const state: AuthState = {
      user: this.currentUser,
      isLoading: false,
      isAuthenticated: !!this.currentUser,
    };
    this.listeners.forEach(listener => listener(state));
  }

  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      isLoading: false,
      isAuthenticated: !!this.currentUser,
    };
  }
}

export const authService = new AuthService();
export default authService;
