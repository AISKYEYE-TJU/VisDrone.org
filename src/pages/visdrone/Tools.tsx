import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Brain, Globe, Network, Database, ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';
import { TOOLS_PLATFORMS } from '@/lib/visdrone-config';
import { getHeroImage, getToolImage } from '@/utils/aiImageGenerator';

const Tools: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-8 h-8" />;
      case 'Globe': return <Globe className="w-8 h-8" />;
      case 'Network': return <Network className="w-8 h-8" />;
      case 'Database': return <Database className="w-8 h-8" />;
      default: return <Brain className="w-8 h-8" />;
    }
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('tools')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>科研与应用平台</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">平台工具</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              打造低空智能科研与应用的开放平台，为研究人员和开发者提供全方位的技术支持
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '4', label: '核心平台', icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: '3', label: '已上线', icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: '1000+', label: '活跃用户', icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: '24/7', label: '技术支持', icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 justify-center"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">核心平台</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              为低空智能研究提供从数据、模型到应用的全链条支持
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {TOOLS_PLATFORMS.map((platform, index) => (
              <motion.a
                key={platform.id}
                href={platform.url}
                target={platform.url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group block rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={getToolImage(platform.id)}
                    alt={platform.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      platform.status === 'online'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {platform.status === 'online' ? '已上线' : '开发中'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {getIcon(platform.icon)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {platform.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {platform.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  {platform.features && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {platform.features.map(f => (
                        <span key={f} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <span>访问平台</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">平台特色</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              为低空智能研究提供全方位的技术支持和服务
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '数据-模型-场景联动',
                desc: '实现低空数据、模型和场景的深度联动，提供端到端的解决方案',
                icon: <Database className="w-6 h-6" />,
              },
              {
                title: '开放共享',
                desc: '所有平台均开源开放，支持社区贡献和协作开发',
                icon: <Globe className="w-6 h-6" />,
              },
              {
                title: '持续更新',
                desc: '平台功能持续迭代，紧跟学术前沿和技术发展',
                icon: <Sparkles className="w-6 h-6" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-12 text-center"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('tools')}')` }} />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">开始使用我们的平台</h2>
              <p className="text-white/80 mb-8">
                无论您是研究人员、开发者还是企业用户，我们的平台都能为您提供强大的支持
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://visdrone.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-colors"
                >
                  <Database className="w-4 h-4" />
                  访问数据平台
                </a>
                <a
                  href="mailto:zhupengfei@tju.edu.cn"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                >
                  联系我们
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
