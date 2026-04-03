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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">联系我们</h2>
            <p className="text-muted-foreground">欢迎通过以下方式与我们联系</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Building2 className="w-6 h-6" />,
                title: '东南大学',
                name: '孙一铭 老师',
                email: 'sunyiming@seu.edu.cn',
                address: '东南大学四牌楼校区李文正楼',
                color: 'bg-blue-100 text-blue-700',
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: '天津大学',
                name: '朱文成 老师',
                email: 'zhu1992719@foxmail.com',
                address: '天津大学北洋园校区55号楼',
                color: 'bg-green-100 text-green-700',
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: '国防科技大学',
                name: '范妍 老师',
                email: 'fyan_0411@tju.edu.cn',
                address: '国防科技大学ATR实验室',
                color: 'bg-purple-100 text-purple-700',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-3 text-center">{item.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                      {item.email}
                    </a>
                  </div>
                  {item.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{item.address}</span>
                    </div>
                  )}
                </div>
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

      {/* 微信公众号 */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="p-6 rounded-2xl bg-card border text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <h3 className="font-semibold">微信公众号</h3>
              </div>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src="/qrcode_for_gh_d80f2d26792c_258.jpg" 
                  alt="VisDrone团队公众号" 
                  className="w-24 h-24 rounded-lg border object-cover"
                  onError={(e) => {
                    console.error('二维码加载失败');
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-left">
                  <p className="font-medium text-foreground">VisDrone团队</p>
                  <p className="text-sm text-muted-foreground mt-1">扫码关注公众号</p>
                  <p className="text-sm text-muted-foreground">获取最新动态</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
