import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Mail, MapPin, Globe, User, LogOut, Settings } from 'lucide-react';
import { ROUTE_PATHS, LAB_INFO, cn } from '@/lib/index';
import { springPresets } from '@/lib/motion';
import { authService, permissionUtils } from '@/lib/auth';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 处理登出
  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    navigate(ROUTE_PATHS.LOGIN);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 监听localStorage变化，更新用户状态
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close mobile menu and scroll to top when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    // 确保路由变化时滚动到顶部
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { label: '首页', path: ROUTE_PATHS.HOME },
    { label: '关于实验室', path: ROUTE_PATHS.ABOUT },
    { label: '研究方向', path: ROUTE_PATHS.RESEARCH },
    { label: '学术成果', path: ROUTE_PATHS.PUBLICATIONS },
    { label: '设计教育', path: ROUTE_PATHS.EDUCATION },
    { label: '设计科普', path: ROUTE_PATHS.POPULAR_SCIENCE },
    { label: '群智创新', path: ROUTE_PATHS.MULTI_AGENT },
    { label: 'AI科研工具', path: ROUTE_PATHS.AI4RESEARCH },
    { label: 'AutoSota', path: ROUTE_PATHS.AUTO_SOTA },
    { label: '团队成员', path: ROUTE_PATHS.TEAM },
    { label: '联系我们', path: ROUTE_PATHS.JOIN },
  ];

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
          <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-3 group">
            <img src="/lab-logo.svg" alt="人机协同设计实验室" className="w-10 h-10 object-contain transition-transform group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                {LAB_INFO.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {LAB_INFO.institution}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-2",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
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
            
            {/* 登录/注册和用户菜单 */}
            <div className="flex items-center gap-4 ml-4">
              {!currentUser ? (
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  登录/注册
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  {permissionUtils.canAccessAdmin(currentUser) && (
                    <Link
                      to={ROUTE_PATHS.ADMIN}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Settings className="w-4 h-4" />
                      后台管理
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <LogOut className="w-4 h-4" />
                      登出
                    </button>
                  </div>
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
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "text-2xl font-semibold flex items-center justify-between group",
                        isActive ? "text-primary" : "text-foreground"
                      )
                    }
                  >
                    {item.label}
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                </motion.div>
              ))}
              
              {/* 登录/注册和用户菜单 */}
              <div className="mt-8 pt-8 border-t border-border">
                {!currentUser ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                  >
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      className="text-2xl font-semibold flex items-center justify-between group text-foreground hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        登录/注册
                      </div>
                      <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {permissionUtils.canAccessAdmin(currentUser) && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.05 }}
                      >
                        <Link
                          to={ROUTE_PATHS.ADMIN}
                          className="text-2xl font-semibold flex items-center justify-between group text-foreground hover:text-primary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            后台管理
                          </div>
                          <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + 1) * 0.05 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-foreground">{currentUser.name}</span>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          登出
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </nav>
            
            <div className="absolute bottom-12 left-6 right-6">
              <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-4">联系我们</p>
                <div className="space-y-3">
                  <a href={`mailto:${LAB_INFO.contactEmail}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Mail size={16} /> {LAB_INFO.contactEmail}
                  </a>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} /> {LAB_INFO.location}
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
            className="min-h-screen"
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
                <img src="/lab-logo.svg" alt="人机协同设计实验室" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="font-bold text-xl">{LAB_INFO.name}</h3>
                  <p className="text-sm text-muted-foreground">{LAB_INFO.nameEn}</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                致力于探索人工智能与人类智慧的深度协同，通过跨学科的设计创新，为未来的智能生活提供美学与技术并重的解决方案。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6">快捷链接</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.label}
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
                  <span className="text-muted-foreground">{LAB_INFO.location}</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <Mail className="text-primary shrink-0" size={18} />
                  <a href={`mailto:${LAB_INFO.contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {LAB_INFO.contactEmail}
                  </a>
                </li>
                <li className="flex gap-3 text-sm">
                  <Globe className="text-primary shrink-0" size={18} />
                  <span className="text-muted-foreground">{LAB_INFO.nameEn}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 {LAB_INFO.name}. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary">隐私政策</a>
              <a href="#" className="hover:text-primary">使用条款</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
