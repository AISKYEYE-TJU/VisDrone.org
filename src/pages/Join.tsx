import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, Send, MapPin, Users, Sparkles, GraduationCap, ChevronRight } from 'lucide-react';
import { IMAGES } from '@/assets/images';
import { LAB_INFO, cn } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const recruitmentPositions = [
  {
    title: '博士后 (Postdoc)',
    description: '长期招聘具有艺术设计、计算机科学、心理学或人机交互背景的博士。',
    requirements: [
      '已获得或即将获得相关学科博士学位',
      '在高水平国际会议或期刊发表过研究成果',
      '具备独立开展科学研究的能力与团队协作精神',
      '年龄一般不超过35周岁'
    ],
    tag: '长期有效'
  },
  {
    title: '硕士研究生',
    description: '欢迎对人机协同、情感计算、智能设计有浓厚兴趣的学生报考。',
    requirements: [
      '推免生或统考生（设计或相关交叉学科）',
      '具备扎实的专业基础，较强的学习能力',
      '拥有设计实践经验或编程能力者优先',
      '良好的英语读写能力'
    ],
    tag: '年度招生'
  },
  {
    title: '本科实习生',
    description: '面向校内外优秀本科生，提供参与前沿科研项目的机会。',
    requirements: [
      '设计或计算机、自动化等相关专业本科生',
      '能够保证每周至少15小时的投入时间',
      '对科研探索有热情，执行力强',
      '希望未来在相关领域深造'
    ],
    tag: '滚动招聘'
  }
];

const applicationSteps = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: '准备材料',
    content: '个人简历 (PDF)、作品集 (设计类)、成绩单、代表性论文或项目说明。'
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: '发送邮件',
    content: `邮件发送至 ${LAB_INFO.contactEmail}，标题注明：[申请-职位-姓名-学校]。`
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '面试交流',
    content: '通过初筛后，我们将邀请您进行线上或线下交流，了解双方契合度。'
  },
  {
    icon: <Send className="w-6 h-6" />,
    title: '正式加入',
    content: '确认意向后，协助办理相关入学或入职手续，开启协同创新之旅。'
  }
];

export default function Join() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.TEAM_WORK_1} 
            alt="Team Collaboration" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              RECRUITMENT
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              联系 <span className="text-primary">人机协同设计</span><br />
              实验室
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              我们正在寻找对设计创新、人工智能与人类创造力充满激情的你。在这里，我们将共同探索未来人机交互的无限可能。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="sticky top-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <GraduationCap className="text-primary" />
                开放职位
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                实验室提供一流的研究环境和学术支持。我们重视跨学科背景，鼓励多元思想的碰撞。
              </p>
              <div className="mt-8 p-6 bg-accent/30 rounded-xl border border-accent">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
                  为什么选择我们？
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• 跨学科的研究氛围 (艺术 × 科技)</li>
                  <li>• 丰富的国内外学术交流机会</li>
                  <li>• 先进的实验设备与充足的经费支持</li>
                  <li>• 赵天娇老师亲自指导与团队协作</li>
                </ul>
              </div>
            </div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:w-2/3 space-y-6"
          >
            {recruitmentPositions.map((pos, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-2xl">{pos.title}</CardTitle>
                      <CardDescription className="mt-2">{pos.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{pos.tag}</Badge>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-4" />
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">申请要求</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pos.requirements.map((req, ridx) => (
                        <li key={ridx} className="flex items-start gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">申请流程</h2>
            <p className="text-muted-foreground">
              我们力求流程的高效与透明，如有任何疑问欢迎邮件咨询。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {applicationSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="mb-6 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.content}
                </p>
                {idx < applicationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-16 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-12 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">联系我们</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">电子邮件</p>
                  <a href={`mailto:${LAB_INFO.contactEmail}`} className="text-lg font-medium hover:text-primary transition-colors">
                    {LAB_INFO.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">办公地点</p>
                  <p className="text-lg font-medium">{LAB_INFO.location}</p>
                  <p className="text-sm text-muted-foreground">{LAB_INFO.institution}</p>
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" className="rounded-full px-8 shadow-md" asChild>
                  <a href={`mailto:${LAB_INFO.contactEmail}`}>立即发送申请邮件</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 bg-muted relative min-h-[400px]">
            {/* 实验室位置 */}
            <div className="absolute inset-0 flex items-center justify-center bg-accent/10">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">{LAB_INFO.name}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{LAB_INFO.location}</p>
                <a 
                  href="https://map.baidu.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
                >
                  在百度地图中查看 <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
            {/* Visual decoration */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-card to-transparent" />
          </div>
        </div>
      </section>

      {/* Footer Info for Non-Tech maintainers */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© 2026 {LAB_INFO.name} | 如需更新招聘信息，请联系网站管理员更新 data/index.ts 对应内容</p>
        </div>
      </section>
    </div>
  );
}
