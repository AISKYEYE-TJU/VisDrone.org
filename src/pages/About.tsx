import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/assets/images';
import { LAB_INFO, cn } from '@/lib/index';
import { Milestone, Target, Globe, Lightbulb, GraduationCap, Building2 } from 'lucide-react';

const history = [
  {
    year: '2016',
    title: '实验室创立',
    description: '赵天娇博士在天津大学软件学院视觉艺术系创立人机协同设计实验室，旨在探索艺术与人工智能的深度融合。'
  },
  {
    year: '2020',
    title: '学术晋升',
    description: '赵天娇晋升为天津大学副教授，实验室研究方向进一步聚焦智能创新设计与设计教育。'
  },
  {
    year: '2023',
    title: '科研突破',
    description: '获批国家自然科学基金面上项目，开始系统性研究设计大数据驱动的创意设计教育方法。'
  },
  {
    year: '2025',
    title: '实验室发展',
    description: '实验室进入新的发展阶段，扩大研究团队，拓展国际合作网络。'
  },
  {
    year: '2026',
    title: '未来展望',
    description: '致力于建立国际领先的人机协同设计实验室，推动智能创新设计的理论与实践发展。'
  }
];

const values = [
  {
    icon: <Target className="w-6 h-6" />,
    title: '学术前沿',
    text: '始终站在艺术与科技交叉的最前沿，探索未知的可能性。'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: '跨界融合',
    text: '打破学科壁垒，通过多元对话激发创新灵感。'
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: '育人为本',
    text: '培养具有国际视野和技术素养的新一代复合型设计人才。'
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: '社会责任',
    text: '关注AI伦理与人类价值，确保科技进步服务于人类文明。'
  }
];

const partners = [
  { name: '香港理工大学设计学院', icon: <Building2 className="w-8 h-8 opacity-40" /> },
  { name: '天津大学工业设计系', icon: <Building2 className="w-8 h-8 opacity-40" /> },
  { name: '蓝湖', icon: <Building2 className="w-8 h-8 opacity-40" /> },
  { name: '阿里云', icon: <Building2 className="w-8 h-8 opacity-40" /> },
  { name: '南京乾学教育', icon: <Building2 className="w-8 h-8 opacity-40" /> }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.ABOUT_HERO} 
            alt="Lab Interior" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase bg-primary/10 text-primary rounded-full">
              关于我们
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              连接艺术直觉与<br />
              <span className="text-primary">计算智能</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {LAB_INFO.name}致力于在人工智能浪潮下，重新定义设计与艺术的边界。我们相信技术与创意的融合将开启设计的新纪元。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif font-bold mb-6">我们的使命</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              在数字技术飞速发展的今天，我们不仅关注算法的效率，更关心人的主体性。实验室通过系统性的实验与理论建构，探索人类创意与生成式人工智能如何实现真正意义上的“协同”。我们相信，科技不应取代艺术，而应成为延伸人类想象力的全新介质。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group">
                  <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src={IMAGES.ABOUT_MISSION} 
              alt="Human-AI Collaboration" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">发展历程</h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12">
              {history.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-8",
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  )}
                >
                  <div className="flex-1 md:text-right w-full">
                    {index % 2 === 0 ? (
                      <div className="md:text-left">
                        <span className="text-primary font-mono font-bold text-2xl">{item.year}</span>
                        <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    ) : (
                      <div className="md:text-right">
                        <span className="text-primary font-mono font-bold text-2xl">{item.year}</span>
                        <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 hidden md:block" />
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold mb-4">合作伙伴</h2>
          <p className="text-muted-foreground">与卓越的研究机构和平台共同推动学术创新</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {partners.map((partner, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl bg-card border border-border/40 text-center"
            >
              <div className="mb-4">{partner.icon}</div>
              <span className="text-sm font-medium">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">加入我们的创新旅程</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            我们常年招收具有艺术设计、计算机科学、心理学或社会学背景的优秀学子加入。如果你对人机协同的未来充满热情，欢迎联系我们。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={`mailto:${LAB_INFO.contactEmail}`} 
              className="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              立即联系
            </a>
            <div className="flex items-center gap-2 text-sm opacity-60">
              <Milestone className="w-4 h-4" />
              <span>地址：{LAB_INFO.location}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
