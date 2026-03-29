import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Users, Send, Clock, Building2, Rocket, Target, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VISDRONE_INFO } from '@/lib/visdrone-config';
import { getHeroImage } from '@/utils/aiImageGenerator';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('contact')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">欢迎加入VisDrone团队</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              携手构建集大基建（世界模拟器）、大基座（数据平台）、大系统（具身智能体）、大社会（社会模拟器）于一体的新一代低空智能平台
            </p>
          </motion.div>
        </div>
      </section>

      {/* Low-Altitude Economy Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">低空经济国家战略</h2>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                低空经济自 <span className="font-bold text-yellow-300">2021 年</span>首次纳入国家顶层规划，
                <span className="font-bold text-yellow-300"> 2024—2026 年</span>连续三年被写入政府工作报告，
                战略定位从经济新增长引擎、战略性新兴产业逐步跃升为<span className="font-bold text-yellow-300">国民经济新兴支柱产业</span>。
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Recruitment Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                招生方向
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">招募优秀人才</h2>
              <p className="text-muted-foreground leading-relaxed">
                团队聚集低空智能感知、低空具身智能以及低空群体智能三大方向，招收对智能无人系统有着浓厚兴趣、有良好的编程、英文和数学基础的硕士和博士，研究低空智能前沿理论和方法，建立领域开源数据和算法平台，推进领域技术进步，服务国家重大战略需求。
              </p>
            </div>

            {/* Research Directions */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { title: '低空智能感知', desc: '无人机视角目标检测、追踪、计数等核心感知任务' },
                { title: '低空具身智能', desc: '空中具身机器人，自主导航、交互与作业能力' },
                { title: '低空群体智能', desc: '多无人机协同感知、决策与执行' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Culture Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 text-sm font-medium mb-4">
                <Heart className="w-4 h-4" />
                团队文化
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">做"可以用"的科研</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: '不做"躺平"的研究',
                  desc: '团队不崇尚"躺平"，倡导从工业界需求到落地的"端到端"的研究模式，做"可以用"的科研',
                  icon: <Sparkles className="w-6 h-6" />,
                  color: 'bg-blue-100 text-blue-600',
                },
                {
                  title: '学生自主管理',
                  desc: '团队由学生自主管理运行，倡导"贡献与激励"的团队文化，充分考虑团队需求和学生培养的平衡，实现共同进步',
                  icon: <Users className="w-6 h-6" />,
                  color: 'bg-green-100 text-green-600',
                },
                {
                  title: '鼓励走出去',
                  desc: '团队鼓励硕士研究生在完成两个高质量工作后出去"看一看"，进入头部企业和研究机构开展合作研究',
                  icon: <Rocket className="w-6 h-6" />,
                  color: 'bg-purple-100 text-purple-600',
                },
                {
                  title: '了解毕业生去向',
                  desc: '对团队需要深入了解的可通过该网站公布的联系方式与团队老师学生联系，毕业生去向可点击团队成员查看',
                  icon: <ArrowRight className="w-6 h-6" />,
                  color: 'bg-orange-100 text-orange-600',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-xl border bg-card"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: '电子邮件',
                content: VISDRONE_INFO.contactEmail,
                link: `mailto:${VISDRONE_INFO.contactEmail}`,
                color: 'bg-blue-100 text-blue-700',
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: '实验室地址',
                content: VISDRONE_INFO.location,
                color: 'bg-green-100 text-green-700',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: '团队负责人',
                content: VISDRONE_INFO.principal,
                color: 'bg-purple-100 text-purple-700',
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: '所属机构',
                content: VISDRONE_INFO.institution,
                color: 'bg-orange-100 text-orange-700',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                {item.link ? (
                  <a href={item.link} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-muted-foreground text-sm">{item.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">了解团队成员</h2>
            <p className="text-muted-foreground mb-8">
              点击下方按钮查看团队成员，了解毕业生去向，与团队成员直接联系
            </p>
            <Link
              to="/visdrone/team"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              <Users className="w-5 h-5" />
              查看团队成员
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form - Simplified */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border p-8"
            >
              <h2 className="text-2xl font-bold mb-6">联系我们</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  如果您有任何问题或合作意向，欢迎通过以下方式联系我们：
                </p>

                {/* Email Contact */}
                <a
                  href={`mailto:${VISDRONE_INFO.contactEmail}?subject=咨询VisDrone团队`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">发送邮件</h3>
                    <p className="text-sm text-muted-foreground">{VISDRONE_INFO.contactEmail}</p>
                  </div>
                </a>

                {/* Phone Contact */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">电话咨询</h3>
                    <p className="text-sm text-muted-foreground">请通过邮件预约</p>
                  </div>
                </div>

                {/* Address */}
                <a
                  href={VISDRONE_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                    <MapPin className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">实验室地址</h3>
                    <p className="text-sm text-muted-foreground">{VISDRONE_INFO.location}</p>
                  </div>
                </a>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    工作时间：周一至周五 9:00-18:00
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map - 静态地图图片 + 百度地图链接 */}
              <a
                href="https://map.baidu.com/search/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%9B%9B%E7%89%8C%E6%A5%BC%E6%A0%A1%E5%8C%BA%E6%9D%8E%E6%96%87%E6%AD%A3%E6%A5%BC"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden border bg-card aspect-[4/3] relative group cursor-pointer hover:border-primary transition-colors"
              >
                {/* 静态地图背景 - 使用渐变背景作为占位 */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
                  {/* 模拟地图的网格线 */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mapGrid)" />
                  </svg>
                  
                  {/* 中心位置标记 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" style={{animationDuration: '2s'}} />
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 点击提示 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-foreground">点击打开百度地图</span>
                  </div>
                </div>
              </a>
              
              {/* 地址信息 */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">东南大学四牌楼校区 · 李文正楼</p>
              </div>

              {/* 微信公众号 */}
              <div className="p-4 rounded-xl bg-card border">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                  <h3 className="font-semibold">微信公众号</h3>
                </div>
                <div className="flex items-center gap-4">
                  <img 
                    src="/qrcode_for_gh_d80f2d26792c_258.jpg" 
                    alt="VisDrone团队公众号" 
                    className="w-20 h-20 rounded-lg border object-cover"
                    onError={(e) => {
                      console.error('二维码加载失败');
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">VisDrone团队</p>
                    <p className="text-xs text-muted-foreground mt-1">扫码关注公众号</p>
                    <p className="text-xs text-muted-foreground">获取最新动态</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">工作时间</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">周一至周五 9:00-18:00</p>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">招生咨询</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">长期招收博士后、博士、硕士</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
