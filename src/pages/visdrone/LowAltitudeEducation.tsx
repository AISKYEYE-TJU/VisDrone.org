import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plane, Users, Target, BrainCircuit, ChevronRight, GraduationCap, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHeroImage, generateAIImage } from '@/utils/aiImageGenerator';
import { VISDRONE_ROUTES } from '@/lib/visdrone-config';

const LowAltitudeEducation: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${getHeroImage('research')}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">低空教育</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              面向低空经济国家战略需求，构建多层次教学体系，培养低空智能领域复合型人才
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">《低空智能感知》系列教材</h2>
            
            <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
              <p className="text-base leading-relaxed text-foreground/90 mb-3">
                低空经济自<span className="font-semibold">2021年</span>首次纳入国家顶层规划，<span className="font-semibold">2024—2026年</span>连续三年被写入政府工作报告，战略定位从经济新增长引擎、战略性新兴产业逐步跃升为<span className="font-semibold text-primary">国民经济新兴支柱产业</span>。
              </p>
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              以无人机为核心载体，涵盖物流配送、城市空中交通、精准农业、应急救援等多元场景的新型经济形态正加速崛起。面对相关领域教学体系构建及人才培养的迫切需求，团队精心编撰了《低空智能感知》系列教材。
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              本系列教材包含<strong>通识版、本科版、研究生版</strong>三个版本，深度解析了低空感知技术，构建多层次教学体系。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {[
              {
                version: 'general',
                icon: BookOpen,
                title: '通识版',
                subtitle: '普及专业认知，夯实应用基础',
                target: '跨专业学习者及行业初学者',
                desc: '聚焦低空感知的基础知识普及与核心技能实操演练'
              },
              {
                version: 'undergraduate',
                icon: GraduationCap,
                title: '本科版',
                subtitle: '强化理实交融，塑造卓越工程师',
                target: '计算机、自动化、机器人等相关专业本科生',
                desc: '引导完成从0到1的工程全流程'
              },
              {
                version: 'graduate',
                icon: Award,
                title: '研究生版',
                subtitle: '深研前沿理论，孵化高层次拔尖人才',
                target: '计算机、机器人、自动化等相关专业研究生',
                desc: '系统解析大模型微调与云边端协同部署'
              }
            ].map((item, index) => (
              <Link key={item.version} to={`${VISDRONE_ROUTES.EDUCATION}/${item.version}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group h-full p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{item.subtitle}</p>
                    <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                    
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{item.target}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid lg:grid-cols-2 gap-8 items-start"
          >
            <div>
              <h3 className="text-xl font-bold mb-6">教材特色</h3>
              <div className="space-y-4">
                {[
                  { icon: Target, title: '感知系统基础与数据基石', desc: '构建融合实飞、网络挖掘与虚拟合成的多维数据供给体系' },
                  { icon: BrainCircuit, title: '核心智能感知算法与模型', desc: '系统构建完备算法体系，深度剖析主流算法模型' },
                  { icon: Plane, title: '工程实现与系统集成', desc: '采用场景驱动的教学范式，覆盖从端侧部署到感策控一体化' },
                  { icon: Users, title: '多层次教学体系', desc: '设置通识-本科-研究生三阶教学体系' }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
              <img
                src={generateAIImage({ prompt: '大学教材书籍堆叠展示，人工智能与无人机主题教材，学术图书馆场景，蓝色调温馨光线，教育氛围', width: 600, height: 450 })}
                alt="教材展示"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-medium">《低空智能感知》系列教材</p>
                <p className="text-white/70 text-sm mt-1">通识版 · 本科版 · 研究生版</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">《智能无人机》课程</h2>
            <p className="text-muted-foreground mb-8">东南大学未来技术学院本科生专业方向课程</p>

            <div className="bg-card rounded-xl border p-6 mb-8">
              <div className="grid grid-cols-4 gap-4 pb-6 border-b">
                {[
                  { value: '2', label: '学分' },
                  { value: '32', label: '总学时' },
                  { value: '24', label: '理论学时' },
                  { value: '16', label: '实验学时' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 text-sm">
                <div><span className="text-muted-foreground">课程类别：</span>专业方向课程</div>
                <div><span className="text-muted-foreground">开课学期：</span>秋季</div>
                <div><span className="text-muted-foreground">适用对象：</span>东南大学未来技术学院本科生</div>
                <div><span className="text-muted-foreground">课程负责人：</span>朱鹏飞</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">课程目标</h3>
              <div className="bg-card rounded-xl border p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  《智能无人机》课程旨在培养学生在低空无人机平台下，面向实际应用场景的智能感知与数据处理能力。课程以"数据采集—数据标注—模型训练—部署应用"为主线，系统讲授低空无人机感知的基本概念、数据获取方法、虚拟数据合成、数据平台构建、模型训练与部署等关键技术与工程实践。
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">教学内容</h3>
              <div className="space-y-3">
                {[
                  { num: '01', title: '背景介绍', desc: '介绍课程背景、目标及总体项目方案；分组，明确项目任务' },
                  { num: '02', title: '低空感知数据获取与处理', desc: '低空无人机结构与感知系统、实飞数据采集方法、网络爬虫数据采集方法、典型低空感知数据平台、数据标注方法' },
                  { num: '03', title: '低空虚拟数据合成与模型训练', desc: '虚拟数据合成方法、无人机目标检测模型与方法、模型轻量化方法' },
                  { num: '04', title: '低空多模态大模型与感控一体化', desc: '多模态大模型架构、无人机端侧算力平台、感知模型端侧部署流程、TensorRT加速方法、ROS系统' }
                ].map((module) => (
                  <div key={module.num} className="bg-card rounded-xl border p-5 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-mono font-semibold text-muted-foreground shrink-0 w-8">{module.num}</span>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{module.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{module.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">实验环节</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { title: '低空数据合成与标注', desc: '利用AirSim、Unity等仿真平台进行低空虚拟场景数据生成，并进行数据标注实操' },
                  { title: '低空目标检测模型训练', desc: '学习并训练YOLO系列目标检测模型，在VisDrone或自建数据集上完成目标识别任务' },
                  { title: '低空模型部署与感控集成', desc: '部署训练好的感知模型，与ROS控制节点联动，实现基于视觉反馈的感控一体化演示' }
                ].map((exp) => (
                  <div key={exp.title} className="bg-card rounded-xl border p-5 hover:border-primary/30 transition-colors">
                    <h4 className="font-medium text-sm mb-2">{exp.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 relative rounded-2xl overflow-hidden border aspect-video">
              <img
                src={generateAIImage({ prompt: '大学课堂学生上课学习场景，无人机智能教学演示，大学生在实验室操作无人机，现代科技教室环境，蓝色调学术氛围', width: 1200, height: 675 })}
                alt="课程教学"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-semibold text-lg">《智能无人机》课程</p>
                <p className="text-white/80 text-sm mt-1">东南大学未来技术学院 · 实践驱动教学</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LowAltitudeEducation;