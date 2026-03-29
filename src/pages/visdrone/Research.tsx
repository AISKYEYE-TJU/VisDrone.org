import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Plane, Users, ChevronRight, Target, Navigation, BrainCircuit } from 'lucide-react';
import { RESEARCH_AREAS } from '@/lib/visdrone-config';
import { getHeroImage, getResearchImage } from '@/utils/aiImageGenerator';

const iconMap: Record<string, React.ReactNode> = {
  'Eye': <Eye className="w-8 h-8" />,
  'Plane': <Plane className="w-8 h-8" />,
  'Users': <Users className="w-8 h-8" />,
};

const Research: React.FC = () => {
  const researchDetails = [
    {
      ...RESEARCH_AREAS[0],
      icon: <Target className="w-12 h-12" />,
      features: [
        { title: '目标检测', desc: '无人机视角下的高效目标检测算法' },
        { title: '目标追踪', desc: '复杂场景下的多目标跟踪技术' },
        { title: '人群计数', desc: '大规模人群密度估计与计数' },
        { title: '多模态融合', desc: '可见光与红外等多模态数据融合' },
      ],
      datasets: ['VisDrone', 'DroneVehicle', 'DroneCrowd', 'MDMT'],
    },
    {
      ...RESEARCH_AREAS[1],
      icon: <Navigation className="w-12 h-12" />,
      features: [
        { title: '具身智能', desc: '面向无人机的具身智能算法研究' },
        { title: '自主导航', desc: '复杂环境下的自主路径规划与导航' },
        { title: '空中机器人', desc: '空中机器人系统设计与控制' },
        { title: '环境交互', desc: '无人机与环境的智能交互技术' },
      ],
      datasets: ['VisDrone-Nav', 'AirSim-Dataset'],
    },
    {
      ...RESEARCH_AREAS[2],
      icon: <BrainCircuit className="w-12 h-12" />,
      features: [
        { title: '多机协同', desc: '多无人机协同感知与决策' },
        { title: '群体智能', desc: '无人机集群智能涌现机制' },
        { title: '分布式决策', desc: '去中心化的群体决策算法' },
        { title: '任务分配', desc: '动态任务分配与调度优化' },
      ],
      datasets: ['VisDrone-Swarm', 'MDMT'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('research')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">研究方向</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              聚焦低空智能三大核心技术方向，攻关低空智能感知、低空具身智能和低空群体智能技术难题，
              研发低空智巡平台和空中具身机器人，推动低空经济与智能治理创新发展
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Areas Detail */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-24">
            {researchDetails.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {area.titleEn}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{area.title}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {area.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {area.features.map((feature, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Related Datasets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">相关数据集:</span>
                    {area.datasets.map((dataset, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                      >
                        {dataset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative">
                    <div className="aspect-square rounded-3xl overflow-hidden">
                      <img
                        src={getResearchImage(area.id)}
                        alt={area.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="text-primary bg-white/90 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center">
                          {area.icon}
                        </div>
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Impact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">研究影响力</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              VisDrone团队在低空智能领域取得了国际领先的研究成果
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '10+', label: '公开数据集', desc: '世界最大规模低空视觉数据集' },
              { value: '56+', label: '开源模型', desc: '覆盖检测、跟踪、计数等任务' },
              { value: '97+', label: '学术论文', desc: '发表于顶级期刊和会议' },
              { value: '2000万+', label: '数据标注', desc: '图像/视频帧与目标标注' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">应用场景</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              研究成果已在雄安新区等地开展应用示范
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: '低空智巡平台',
                desc: '基于无人机智能巡检的自动化平台，应用于基础设施检测、环境监测等领域',
                icon: <Plane className="w-6 h-6" />,
              },
              {
                title: '空中具身机器人',
                desc: '具备自主导航和环境交互能力的空中机器人系统',
                icon: <Navigation className="w-6 h-6" />,
              },
              {
                title: '群体协同系统',
                desc: '多无人机协同感知与决策系统，实现复杂任务的群体智能',
                icon: <Users className="w-6 h-6" />,
              },
            ].map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {app.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{app.title}</h3>
                <p className="text-muted-foreground">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;
