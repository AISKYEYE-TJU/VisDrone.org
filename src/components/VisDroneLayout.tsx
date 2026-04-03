import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { VISDRONE_INFO, VISDRONE_ROUTES } from '@/lib/visdrone-config';

const VisDroneLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: VISDRONE_ROUTES.HOME, label: '首页' },
    { path: VISDRONE_ROUTES.RESEARCH, label: '研究方向' },
    { path: VISDRONE_ROUTES.TEAM, label: '团队成员' },
    { path: VISDRONE_ROUTES.PUBLICATIONS, label: '研究成果' },
    { path: VISDRONE_ROUTES.DATA_BASE, label: '数据基座' },
    { path: VISDRONE_ROUTES.MODEL_BASE, label: '模型基座' },
    { path: VISDRONE_ROUTES.KNOWLEDGE_BASE, label: '知识基座' },
    { path: VISDRONE_ROUTES.TOOLS, label: '平台工具' },
    { path: VISDRONE_ROUTES.SEMINAR, label: '学术活动' },
    { path: VISDRONE_ROUTES.NEWS, label: '新闻动态' },
    { path: VISDRONE_ROUTES.CONTACT, label: '联系我们' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-background/95 backdrop-blur-md border-b shadow-sm'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to={VISDRONE_ROUTES.HOME} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                <img
                  src="/visdrone-logo.png"
                  alt="VisDrone Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=V';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-base sm:text-lg leading-tight tracking-tight transition-colors ${
                  isScrolled || isMenuOpen ? 'text-foreground' : 'text-white'
                }`}>
                  {VISDRONE_INFO.name}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive(item.path)
                      ? isScrolled
                        ? 'text-primary bg-primary/10'
                        : 'text-white bg-white/20'
                      : isScrolled
                      ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isScrolled ? 'bg-primary' : 'bg-white'}`}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled || isMenuOpen ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t bg-background/95 backdrop-blur-md max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            >
              <nav className="container mx-auto px-4 py-3 sm:py-4 flex flex-col gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            {/* Logo & Description - 左侧 */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src="/visdrone-logo.png"
                    alt="VisDrone Logo"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=V';
                    }}
                  />
                </div>
                <span className="font-bold text-xl">{VISDRONE_INFO.name}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {VISDRONE_INFO.description}
              </p>
            </div>

            {/* Quick Links - 中间 */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-4">快速链接</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to={VISDRONE_ROUTES.RESEARCH} className="hover:text-white transition-colors">研究方向</Link></li>
                <li><Link to={VISDRONE_ROUTES.TEAM} className="hover:text-white transition-colors">团队成员</Link></li>
                <li><Link to={VISDRONE_ROUTES.PUBLICATIONS} className="hover:text-white transition-colors">研究成果</Link></li>
                <li><Link to={VISDRONE_ROUTES.DATA_BASE} className="hover:text-white transition-colors">数据基座</Link></li>
                <li><Link to={VISDRONE_ROUTES.MODEL_BASE} className="hover:text-white transition-colors">模型基座</Link></li>
                <li><Link to="/visdrone/admin/login" className="hover:text-white transition-colors">管理员登录</Link></li>
              </ul>
            </div>

            {/* Contact - 右侧 */}
            <div className="md:col-span-4">
              <h3 className="font-semibold mb-4">联系我们</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-16 shrink-0">东南大学</span>
                  <div>
                    <span className="text-slate-300">孙一铭 老师</span>
                    <a href="mailto:sunyiming@seu.edu.cn" className="text-slate-400 hover:text-white transition-colors block text-xs">
                      sunyiming@seu.edu.cn
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-16 shrink-0">天津大学</span>
                  <div>
                    <span className="text-slate-300">朱文成 老师</span>
                    <a href="mailto:zhu1992719@foxmail.com" className="text-slate-400 hover:text-white transition-colors block text-xs">
                      zhu1992719@foxmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-16 shrink-0">国防科大</span>
                  <div>
                    <span className="text-slate-300">范妍 老师</span>
                    <a href="mailto:fyan_0411@tju.edu.cn" className="text-slate-400 hover:text-white transition-colors block text-xs">
                      fyan_0411@tju.edu.cn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* WeChat QR Code - 最右侧 */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-4">微信公众号</h3>
              <div className="flex flex-col items-center">
                <img 
                  src="/qrcode_for_gh_d80f2d26792c_258.jpg" 
                  alt="VisDrone团队公众号" 
                  className="w-24 h-24 rounded-lg border border-slate-700 object-cover mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-slate-400 text-xs text-center">VisDrone团队</span>
                <span className="text-slate-500 text-xs text-center">扫码关注</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} {VISDRONE_INFO.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VisDroneLayout;
