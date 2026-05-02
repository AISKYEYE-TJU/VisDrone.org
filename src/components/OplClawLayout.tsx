import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronRight, Mail, MapPin, Globe, User as UserIcon, LogOut, Settings,
  Brain, Rocket, Store, Cloud, Users, Bell, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/index';
import { springPresets } from '@/lib/motion';
import { authService, type User } from '@/lib/auth';

const mainNavigation = [
  {
    title: '首页',
    icon: <Brain className="w-4 h-4" />,
    href: '/oplclaw',
    description: '平台首页'
  },
  {
    title: '自动化科研系统',
    icon: <Rocket className="w-4 h-4" />,
    href: '/oplclaw/automation',
    description: '端到端科研工作流'
  },
  {
    title: '科研智能体广场',
    icon: <Store className="w-4 h-4" />,
    href: '/oplclaw/market',
    description: '单任务科研智能体'
  },
  {
    title: '科研 Skills',
    icon: <Brain className="w-4 h-4" />,
    href: '/oplclaw/skills',
    description: '科研技能市场'
  },
  {
    title: 'OPL 社区',
    icon: <Users className="w-4 h-4" />,
    href: '/oplclaw/community',
    description: '开放实验室社区'
  },
  {
    title: 'AutoDL 服务',
    icon: <Cloud className="w-4 h-4" />,
    href: '/oplclaw/autodl',
    description: '大模型 API 服务'
  }
];

const OplClawLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 加载用户信息
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // 处理登录
  const handleLogin = () => {
    navigate('/login');
  };

  // 处理登出
  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    navigate('/oplclaw');
  };

  // 处理用户菜单切换
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    document.title = 'OplClaw - AI4R开放创新平台';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (item: typeof mainNavigation[0]) => {
    if (location.pathname === item.href) return true;
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-border py-3 shadow-sm" 
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/oplclaw" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                OplClaw
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                AI4R开放创新平台
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {mainNavigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive: active }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center gap-2",
                    active ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive: active }) => (
                  <>
                    {item.icon}
                    {item.title}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={springPresets.gentle}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            
            {/* User Actions */}
            <div className="flex items-center gap-4 ml-4">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
                <Bell size={20} />
              </button>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
                <MessageSquare size={20} />
              </button>
              {currentUser ? (
                <div className="relative">
                  <button 
                    className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted flex items-center gap-2"
                    onClick={toggleUserMenu}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{currentUser.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <div className="text-sm font-medium">{currentUser.name}</div>
                        <div className="text-xs text-muted-foreground">{currentUser.email}</div>
                      </div>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        onClick={() => navigate('/oplclaw/admin')}
                      >
                        <Settings size={16} />
                        <span>平台管理</span>
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        onClick={() => navigate('/admin')}
                      >
                        <Settings size={16} />
                        <span>个人设置</span>
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>退出登录</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted flex items-center gap-1"
                    onClick={handleLogin}
                  >
                    <UserIcon size={20} />
                    <span className="text-sm font-medium">登录</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-background pt-24 px-6"
          >
            <nav className="flex flex-col gap-6">
              {mainNavigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive: active }) =>
                      cn(
                        "text-2xl font-semibold flex items-center justify-between group",
                        active ? "text-primary" : "text-foreground"
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.title}
                    </div>
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                </motion.div>
              ))}
              
              {/* User Actions */}
              <div className="mt-8 pt-8 border-t border-border">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mainNavigation.length * 0.05 }}
                >
                  {currentUser ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-medium">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{currentUser.name}</div>
                          <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                        </div>
                      </div>
                      <button 
                        className="text-2xl font-semibold flex items-center justify-between group text-foreground hover:text-primary transition-colors"
                        onClick={() => navigate('/oplclaw/admin')}
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          平台管理
                        </div>
                        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button 
                        className="text-2xl font-semibold flex items-center justify-between group text-foreground hover:text-primary transition-colors"
                        onClick={() => navigate('/admin')}
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          个人设置
                        </div>
                        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button 
                        className="text-2xl font-semibold flex items-center justify-between group text-foreground hover:text-primary transition-colors"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-5 h-5" />
                          退出登录
                        </div>
                        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="text-2xl font-semibold flex items-center justify-between group text-foreground hover:text-primary transition-colors"
                      onClick={handleLogin}
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        登录/注册
                      </div>
                      <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </motion.div>
              </div>
            </nav>
            
            <div className="absolute bottom-12 left-6 right-6">
              <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-4">联系我们</p>
                <div className="space-y-3">
                  <a href="mailto:contact@oplclaw.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Mail size={16} /> contact@oplclaw.com
                  </a>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} /> 全球AI4R创新中心
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-24">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">OplClaw</h3>
                  <p className="text-sm text-muted-foreground">AI4R开放创新平台</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                OplClaw 是面向全球科研工作者的 AI4R 开放平台，通过先进的自动化科研系统和科研智能体，将科研人员从繁琐的重复劳动中解放出来，让科学家和研究人员能够聚焦于更具科学价值的研究问题，以更高效率和质量推动人类科技进步。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6">快捷链接</h4>
              <ul className="space-y-3">
                {mainNavigation.map((item) => (
                  <li key={item.href}>
                    <Link 
                      to={item.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-6">联系信息</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <MapPin className="text-primary shrink-0" size={18} />
                  <span className="text-muted-foreground">全球AI4R创新中心</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <Mail className="text-primary shrink-0" size={18} />
                  <a href="mailto:contact@oplclaw.com" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@oplclaw.com
                  </a>
                </li>
                <li className="flex gap-3 text-sm">
                  <Globe className="text-primary shrink-0" size={18} />
                  <span className="text-muted-foreground">www.oplclaw.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 OplClaw. AI4R开放创新平台. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary">隐私政策</a>
              <a href="#" className="hover:text-primary">使用条款</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OplClawLayout;
