import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Award, Users, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/assets/images';

const PopularScience: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.AI_DESIGN_1} 
            alt="Design Popular Science" 
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
              DESIGN POPULAR SCIENCE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              设计科普
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              探索设计世界的奥秘，激发创意灵感，从设计大师的智慧中汲取营养
            </p>
          </motion.div>
        </div>
      </section>

      {/* Book Recommendation Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary">新书推荐</Badge>
            <h2 className="text-3xl font-bold mb-6">《影响世界的设计大师》：人人都能读懂的漫画设计史</h2>
            <div className="space-y-6 mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                想了解世界上有哪些设计大师吗？想知道大师有哪些影响时代的经典设计作品吗？想找到打开你设计灵感的钥匙吗？
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                《影响世界的设计大师》科普漫画将带你一起走进设计的世界，你会惊讶地发现：原来看似高深的设计史，竟然可以如此轻松有趣！
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <a href="https://item.jd.com/10208392197763.html?extension_id=eyJhZCI6IiIsImNoIjoiIiwic2hvcCI6IiIsInNrdSI6IiIsInRzIjoiIiwidW5pcWlkIjoie1wiY2xpY2tfaWRcIjpcIjk3ZDRjZjVkLTQwZmQtNDYwMy05OGM0LTY1ODA0NmY2OTg3M1wiLFwicG9zX2lkXCI6XCIyNjE3XCIsXCJzaWRcIjpcImQxNDZlZTBmLTBiZWUtNGRhZi1iZmE2LWEyMzliYzFmMTMwYVwiLFwic2t1X2lkXCI6XCIxMDIwODM5MjE5Nzc2M1wifSJ9&jd_pop=97d4cf5d-40fd-4603-98c4-658046f69873" target="_blank" rel="noreferrer">
                    立即购买 <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <span>国内首部以设计巨匠为主题的科普漫画力作</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span>由东南大学赵天娇副教授团队联合香港理工大学、天津大学设计专业人士共同打造</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-primary" />
                <span>受到湖南大学何人可教授、清华大学蔡军教授、香港理工大学邵健伟教授联名推荐</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/bookcover.png" 
              alt="《影响世界的设计大师》" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Book Details Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">书籍详情</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-muted-foreground leading-relaxed"
            >
              <p>
                《影响世界的设计大师》是国内首部以设计巨匠为主题的科普漫画力作，融汇生动的人物传记与深入浅出的设计科普小课堂，兼具专业深度与阅读趣味，是一部启迪审美、启迪思维的设计通识读本。
              </p>
              <p>
                对于设计从业者，它以新颖的叙事方式重构设计史脉络，让专业知识跃然纸上；对于热爱设计与美学的青少年，它则是通往设计世界的启蒙之钥，引领读者从大师的智慧中汲取灵感，学会以设计的视角重新感知生活。
              </p>
              <p>
                作品由东南大学赵天娇副教授团队联合香港理工大学、天津大学设计专业人士共同打造，具有一定的专业权威性，书籍数字资源包含现代设计史全套课件。该漫画受到了业内权威专家湖南大学何人可教授，清华大学蔡军教授，香港理工大学邵健伟教授联名推荐；也获得了来自阿里、莫高设计等企业设计人员的专业认可。
              </p>
              <p>
                当智能工具日益精进，人类最不可替代的，或许正是那感知美、鉴赏美、创造美的独特灵性。愿这本《影响世界的设计大师》，点燃你对美的感知，激发你对设计的热爱，在理性洪流中，守护那份属于人类的创造之光。
              </p>
            </motion.div>
            
            <div className="mt-12 flex justify-center">
              <Button asChild size="lg" className="rounded-full">
                <a href="https://mp.weixin.qq.com/s/a7Pj9HkQpXeHsGorvdCZ6g" target="_blank" rel="noreferrer">
                  了解更多 <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">书籍特色</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            独特的内容和形式，让设计史变得生动有趣
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>生动的漫画形式</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                以漫画为媒介，将设计大师的故事和作品以生动有趣的方式呈现，让设计史变得平易近人。
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>专业的内容</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                由东南大学赵天娇副教授团队联合香港理工大学、天津大学设计专业人士共同打造，具有专业权威性。
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>丰富的数字资源</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                书籍数字资源包含现代设计史全套课件，为读者提供更全面的学习资料。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">探索设计的魅力</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            通过《影响世界的设计大师》，开启你的设计之旅，从大师的智慧中汲取灵感，培养自己的设计思维。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" size="lg" className="rounded-full">
              <a href="https://item.jd.com/10208392197763.html?extension_id=eyJhZCI6IiIsImNoIjoiIiwic2hvcCI6IiIsInNrdSI6IiIsInRzIjoiIiwidW5pcWlkIjoie1wiY2xpY2tfaWRcIjpcIjk3ZDRjZjVkLTQwZmQtNDYwMy05OGM0LTY1ODA0NmY2OTg3M1wiLFwicG9zX2lkXCI6XCIyNjE3XCIsXCJzaWRcIjpcImQxNDZlZTBmLTBiZWUtNGRhZi1iZmE2LWEyMzliYzFmMTMwYVwiLFwic2t1X2lkXCI6XCIxMDIwODM5MjE5Nzc2M1wifSJ9&jd_pop=97d4cf5d-40fd-4603-98c4-658046f69873" target="_blank" rel="noreferrer">
                立即购买
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-primary-foreground/20 hover:bg-white/10">
              <a href="https://mp.weixin.qq.com/s/wEo3wy_HgYqZ4C2msc-1rQ" target="_blank" rel="noreferrer">
                了解更多
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

export default PopularScience;