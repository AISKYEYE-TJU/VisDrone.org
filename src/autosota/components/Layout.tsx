import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Mail, MapPin, Globe } from 'lucide-react';
import { ROUTE_PATHS, LAB_INFO, cn } from '../lib/index';
import { springPresets } from '../lib/motion';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and scroll to top when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    // 确保路由变化时滚动到顶部
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { label: '首页', path: '/autosota' },
    { label: '研究方向', path: '/autosota/areas' },
    { 
      label: '论文库', 
      path: '/autosota/papers',
      subItems: [
        { label: '实验室论文', path: '/autosota/papers' },
        { label: '通用论文检索', path: '/autosota/search' },
        { label: 'CCF A论文', path: '/autosota/ccf-search' }
      ]
    },
    { label: '数据集', path: '/autosota/datasets' },
    { label: '算法', path: '/autosota/algorithms' },
    { label: 'Leaderboard', path: '/autosota/leaderboard' },
    { label: 'AI4R 系统', path: '/autosota/ai4r' },
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
          <Link to="/autosota" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                AutoSota
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {LAB_INFO.institution}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                {item.subItems ? (
                  <>
                    <button className="text-sm font-medium transition-colors hover:text-primary relative py-2 flex items-center gap-1">
                      {item.label}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            cn(
                              "block px-4 py-2 text-sm transition-colors",
                              isActive ? "text-primary bg-muted" : "text-muted-foreground hover:text-primary hover:bg-muted"
                            )
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink
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
                )}
              </div>
            ))}
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
                  {item.subItems ? (
                    <div className="space-y-4">
                      <button className="text-2xl font-semibold flex items-center justify-between group w-full text-left">
                        {item.label}
                        <ChevronRight className="opacity-100 transition-transform" />
                      </button>
                      <div className="pl-4 space-y-3">
                        {item.subItems.map((subItem, subIndex) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              cn(
                                "text-xl font-medium flex items-center justify-between group",
                                isActive ? "text-primary" : "text-foreground"
                              )
                            }
                          >
                            {subItem.label}
                            <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
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
                  )}
                </motion.div>
              ))}
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
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">A</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">AutoSota</h3>
                  <p className="text-sm text-muted-foreground">{LAB_INFO.nameEn}</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                AutoSota 是 AI4R 系统的前端平台，集成七类核心智能体，实现从文献调研、假设生成、实验设计到论文生成的完整研究闭环。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6">快捷链接</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    {item.subItems ? (
                      <div className="space-y-2">
                        <Link 
                          to={item.path} 
                          className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                        >
                          {item.label}
                        </Link>
                        <ul className="pl-4 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.path}>
                              <Link 
                                to={subItem.path} 
                                className="text-muted-foreground hover:text-primary transition-colors text-xs"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link 
                        to={item.path} 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {item.label}
                      </Link>
                    )}
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
                  <span className="text-muted-foreground">低空智能实验室</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 AutoSota. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary">隐私政策</a>
              <a href="#" className="hover:text-primary">使用条款</a>
              <a href="#" className="hover:text-primary">低空智能实验室</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}