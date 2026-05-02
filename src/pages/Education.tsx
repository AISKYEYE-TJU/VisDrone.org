import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Users, ArrowRight, Calendar, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/assets/images';

const Education: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.AI_DESIGN_1} 
            alt="Education Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              DESIGN EDUCATION
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              设计教育
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              探索设计思维与用户体验的创新教育方法，培养具有创造力和技术素养的设计人才。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Course Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">用户体验与设计思维</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              《用户体验设计与设计思维》课程以“设计思维”为引擎，以服务用户需求为目标，展示从洞察问题到原型设计的创新全流程。这门课源自IDEO所倡导的可学习、可推导的创新方法论，采用斯坦福D.School的经典设计思维课程模式，我们将一起学习如何深入倾听用户、精准定义问题、大胆构思创意，并通过快速原型与测试，让想法落地。
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span>2026-02-01 至 2026-07-31</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span>32学时</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span>162个AI生成资源数，925个知识切片数，198个知识点数</span>
              </div>
            </div>
            <Button asChild size="lg" className="rounded-full">
              <a href="https://www.xueyinonline.com/detail/206146573" target="_blank" rel="noreferrer">
                立即选课 <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src={IMAGES.HCI_RESEARCH_1} 
              alt="Design Education" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Teaching Philosophy Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">教学理念</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              本项目以校通识课《用户体验与设计思维》为实践载体，在该课程基础上，进行AI赋能课程模式、课堂教学和课程内容三个方面的创新
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">理论实践融合</h3>
              <p className="text-sm text-muted-foreground">
                推行"学-做-创"一体化教学路径，融入十个经典设计工作坊，形成工作坊卡片工具
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">校企融合</h3>
              <p className="text-sm text-muted-foreground">
                与Master Go和阿里建立校企合作关系，引入企业原创优质AIGC工具
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">跨学科融合</h3>
              <p className="text-sm text-muted-foreground">
                邀请人工智能专家加入，对AI与设计相结合的技术点进行拆解剖析
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">教研融合</h3>
              <p className="text-sm text-muted-foreground">
                嵌入设计研究介绍，引入教学团队老师的研究内容作为案例讲解
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">人机共教融合</h3>
              <p className="text-sm text-muted-foreground">
                引入AI智能体作为教学助手与学习伙伴，提升教学质量与创作效率
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">课程特色</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            独特的教学方法和资源，帮助学生全面掌握设计思维和用户体验设计技能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <h3 className="text-xl font-semibold">五维共生课程模式</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                创新提出多维共融的创意设计课程教学模式，包括理论实践融合、跨学科融合、校企融合、教研融合和人机共教融合。
              </p>
              <Badge className="bg-primary/10 text-primary">课程模式创新</Badge>
              <Badge className="ml-2 bg-primary/10 text-primary">五维融合</Badge>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <h3 className="text-xl font-semibold">AI Agent协同教学</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                基于超星智慧平台，构建多层次、角色化的教学智能体生态，包括AIGC个性化预习助手、小组协作外脑智能体和设计评价智能体。
              </p>
              <Badge className="bg-primary/10 text-primary">智能教学</Badge>
              <Badge className="ml-2 bg-primary/10 text-primary">AI Agent</Badge>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <h3 className="text-xl font-semibold">AIGC使用机制</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                聚焦设计思维核心环节，进行AIGC介入路径的实证探索，在真实教学环境中设置实验组与对照组，量化分析AIGC对创意生成的影响。
              </p>
              <Badge className="bg-primary/10 text-primary">AIGC应用</Badge>
              <Badge className="ml-2 bg-primary/10 text-primary">实证研究</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">加入我们的设计教育之旅</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            无论你是设计专业学生还是对设计感兴趣的爱好者，都欢迎加入我们的课程，一起探索设计思维的魅力。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" size="lg" className="rounded-full">
              <a href="https://www.xueyinonline.com/detail/206146573" target="_blank" rel="noreferrer">
                立即选课
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-primary-foreground/20 hover:bg-white/10">
              <a href="mailto:zhaotianjiao@seu.edu.cn">
                联系我们
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-10 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2026 人机协同设计实验室 | 东南大学艺术学院</p>
      </div>
    </div>
  );
};

export default Education;