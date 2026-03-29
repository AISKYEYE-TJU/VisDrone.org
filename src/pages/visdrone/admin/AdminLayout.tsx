import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Database,
  Brain,
  Users,
  Award,
  Lightbulb,
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight,
  Image,
  RefreshCw,
  Upload,
  Download,
  LogOut,
  Calendar,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/visdrone/admin', icon: LayoutDashboard, label: '概览', exact: true },
  { path: '/visdrone/admin/news', icon: Newspaper, label: '新闻管理' },
  { path: '/visdrone/admin/datasets', icon: Database, label: '数据集' },
  { path: '/visdrone/admin/models', icon: Brain, label: '模型' },
  { path: '/visdrone/admin/papers', icon: FileText, label: '论文' },
  { path: '/visdrone/admin/patents', icon: Lightbulb, label: '专利' },
  { path: '/visdrone/admin/awards', icon: Award, label: '奖项' },
  { path: '/visdrone/admin/team', icon: Users, label: '团队成员' },
  { path: '/visdrone/admin/seminars', icon: Calendar, label: '学术活动' },
  { path: '/visdrone/admin/sync', icon: RefreshCw, label: '数据同步' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/visdrone/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 240 }}
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col"
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <span className="font-bold text-lg text-primary">VisDrone</span>
          )}
          {collapsed && <span className="font-bold text-lg text-primary">V</span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          {user && (
            <div className={`mb-2 px-3 py-2 text-xs text-slate-500 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? (
                <span className="block truncate">{user.email?.[0] || 'A'}</span>
              ) : (
                <span className="block truncate">{user.email}</span>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
