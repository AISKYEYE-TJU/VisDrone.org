import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS, LAB_INFO } from '@/lib/index';
import { researchProjects, publications } from '@/data/index';
import { ResearchCard, PublicationCard } from '@/components/Cards';
import { Button } from '@/components/ui/button';
import { IMAGES } from '@/assets/images';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const Home: React.FC = () => {
  // 选取精选研究项目和出版物展示在首页
  const featuredProjects = researchProjects.slice(0, 3);
  const featuredPublications = publications.filter(p => p.isSelected).slice(0, 3);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src={IMAGES.HOME_HERO} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>{LAB_INFO.institution}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {LAB_INFO.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              人机协同设计实验室致力于在人工智能浪潮下，重新定义设计与艺术的边界。我们相信技术与创意的融合将开启设计的新纪元。
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to={ROUTE_PATHS.RESEARCH}>
                  了解研究项目 <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur">
                <Link to={ROUTE_PATHS.ABOUT}>
                  实验室简介
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-6">使命与愿景</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              人机协同设计实验室（HAI Lab）由赵天娇发起。我们相信，AI 不仅是工具，更是共同创造的伙伴。我们的研究横跨计算机科学、心理学与艺术设计，旨在构建能够增强人类创造力、提升交互体验并遵循伦理规范的智能系统。
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-primary font-bold text-3xl">10+</div>
                <div className="text-sm text-muted-foreground">核心科研项目</div>
              </div>
              <div className="space-y-2">
                <div className="text-primary font-bold text-3xl">20+</div>
                <div className="text-sm text-muted-foreground">学术出版成果</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src={IMAGES.AI_DESIGN_1} alt="Lab Mission" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Core Research Directions */}
      <section className="bg-secondary/50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">核心研究方向</h2>
              <p className="text-muted-foreground">
                我们通过跨学科的实验方法，探索设计创新教育、群智创新设计、人机交互设计及生成式设计等前沿课题。
              </p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link to={ROUTE_PATHS.RESEARCH} className="flex items-center">
                查看全部项目 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredProjects.map((project) => (
              <motion.div key={project.id} variants={staggerItem}>
                <ResearchCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Selected Publications */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">精选成果</h2>
            <p className="text-muted-foreground">我们在国际顶级期刊与会议上发表的代表性研究成果。</p>
          </div>
          <Button asChild variant="ghost" className="group">
            <Link to={ROUTE_PATHS.PUBLICATIONS} className="flex items-center">
              浏览出版物库 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="space-y-4"
        >
          {featuredPublications.map((pub) => (
            <motion.div key={pub.id} variants={fadeInUp}>
              <PublicationCard publication={pub} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Join Us CTA */}
      <section className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-6">加入我们的研究团队</h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              我们长期招收具有艺术、设计、计算机或心理学背景的博士生及硕士生。如果你对人机协同、生成式 AI 或艺术科技交叉领域充满热情，欢迎联系我们。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="secondary" size="lg" className="rounded-full">
                <Link to={ROUTE_PATHS.JOIN}>招生简章</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-primary-foreground/20 hover:bg-white/10">
                <a href={`mailto:${LAB_INFO.contactEmail}`}>发送邮件联系</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer-like Navigation links */}
      <section className="container mx-auto px-4 border-t pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h4 className="font-bold flex items-center gap-2">
            <Users className="w-4 h-4" /> 实验室
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to={ROUTE_PATHS.ABOUT} className="hover:text-primary transition-colors">关于我们</Link></li>
            <li><Link to={ROUTE_PATHS.TEAM} className="hover:text-primary transition-colors">研究团队</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> 研究
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to={ROUTE_PATHS.RESEARCH} className="hover:text-primary transition-colors">科研项目</Link></li>
            <li><Link to={ROUTE_PATHS.PUBLICATIONS} className="hover:text-primary transition-colors">学术出版</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> 资源
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to={ROUTE_PATHS.JOIN} className="hover:text-primary transition-colors">加入我们</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">开源代码</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold">联系我们</h4>
          <p className="text-sm text-muted-foreground">
            {LAB_INFO.location}<br />
            {LAB_INFO.contactEmail}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;