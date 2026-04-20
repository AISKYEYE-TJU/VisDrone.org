import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { VISDRONE_ROUTES } from '@/lib/visdrone-config';

interface ChapterSection {
  title: string;
}

interface Chapter {
  num: string;
  title: string;
  sections: ChapterSection[];
}

interface TextbookVersion {
  title: string;
  subtitle: string;
  target: string;
  description: string;
  chapters: Chapter[];
}

const textbookVersions: Record<string, TextbookVersion> = {
  general: {
    title: '通识版',
    subtitle: '普及专业认知，夯实应用基础',
    target: '跨专业学习者及行业初学者',
    description: '面向跨专业学习者及行业初学者，聚焦低空感知的基础知识普及与核心技能实操演练。旨在帮助学生快速建立从硬件认知、数据工程到系统集成的完整概念框架，为社会输送具备系统化感知概念与入门实用技能的复合型后备人才。',
    chapters: [
      { num: '第1章', title: '低空无人机结构与感知系统', sections: [
        { title: '低空无人机概述' },
        { title: '低空无人机主体结构' },
        { title: '低空无人机常见载荷类型' },
        { title: '低空无人机感知系统' },
      ]},
      { num: '第2章', title: '低空无人机感知数据采集方法', sections: [
        { title: '低空感知数据采集概述' },
        { title: '低空无人机实飞数据采集方法' },
        { title: '互联网网络爬虫数据采集方法' },
        { title: '低空感知实飞数据集构建实战' },
        { title: '基于网络爬虫的低空感知数据集构建' },
      ]},
      { num: '第3章', title: '低空场景虚拟数据合成方法', sections: [
        { title: '低空虚拟数据生成概述' },
        { title: '低空虚拟数据生成的技术体系' },
        { title: '低空虚拟数据生成的验证与效能评估' },
        { title: '低空虚拟数据生成案例——利用Z-Image生成虚拟低空图像' },
      ]},
      { num: '第4章', title: '低空感知数据平台', sections: [
        { title: '低空感知数据平台发展现状' },
        { title: '典型低空感知数据基准' },
        { title: '"百城百景"低空智能感知平台' },
        { title: '低空智能感知平台未来展望' },
      ]},
      { num: '第5章', title: '低空数据标注方法', sections: [
        { title: '数据标注概述' },
        { title: '数据标注的价值与意义' },
        { title: '典型图像标注任务概述' },
        { title: '典型图像标注工具介绍与实战案例' },
        { title: '点云3D标注任务概述及实战' },
        { title: '自动化标注工具及实战' },
        { title: '人机协同标注工具及实战' },
        { title: '标注问题评估与质量提升策略' },
      ]},
      { num: '第6章', title: '低空智能感知典型技术——目标检测', sections: [
        { title: '目标检测概述' },
        { title: '经典目标检测模型' },
        { title: '无人机目标检测典型方法' },
        { title: 'YOLO11原生开发实战' },
        { title: 'MMDetection框架开发' },
      ]},
      { num: '第7章', title: '无人机感知模型端侧部署方法', sections: [
        { title: '无人机端侧部署概述' },
        { title: '无人机典型端侧算力平台' },
        { title: '低空智能感知模型部署流程' },
        { title: '无人机感知模型端侧部署实战案例' },
      ]},
      { num: '第8章', title: '实战案例', sections: [
        { title: '无人机计数项目介绍' },
        { title: '典型低空目标计数方法' },
        { title: '无人机检测项目介绍' },
        { title: '检测案例实战' },
        { title: '计数案例实战' },
      ]},
      { num: '第9章', title: '无人机低空感控一体化', sections: [
        { title: '低空感控一体化概述' },
        { title: '无人机飞行控制平台' },
        { title: '无人机感知控制操作系统（ROS、ROS2）' },
      ]},
    ],
  },
  undergraduate: {
    title: '本科版',
    subtitle: '强化理实交融，塑造卓越工程师',
    target: '计算机、自动化、机器人等相关专业本科生',
    description: '在夯实学生专业基础上，着重强化理论与实践的衔接，全方位满足"基础理论+技术应用+实践能力"的综合培养需求。教材通过完整的综合项目，引导学生完成从0到1的工程全流程，赋予其解决实际工程问题的能力，全面对接低空经济产业的工程人才需求。',
    chapters: [
      { num: '第1章', title: '低空无人机结构与感知系统', sections: [
        { title: '低空无人机概述' },
        { title: '低空无人机主体结构' },
        { title: '低空无人机常见载荷类型' },
        { title: '低空无人机感知系统' },
      ]},
      { num: '第2章', title: '低空无人机感知数据采集方法', sections: [
        { title: '低空感知数据采集概述' },
        { title: '低空无人机实飞数据采集方法' },
        { title: '互联网网络爬虫数据采集方法' },
        { title: '低空感知实飞数据集构建实战' },
        { title: '基于网络爬虫的低空感知数据集构建' },
      ]},
      { num: '第3章', title: '低空场景虚拟数据合成方法', sections: [
        { title: '低空虚拟数据生成概述' },
        { title: '低空虚拟数据生成的技术体系' },
        { title: '低空虚拟数据生成的验证与效能评估' },
        { title: '低空虚拟数据生成的挑战、局限与未来展望' },
      ]},
      { num: '第4章', title: '低空感知数据平台', sections: [
        { title: '低空感知数据平台发展现状' },
        { title: '典型低空感知数据基准' },
        { title: '"百城百景"低空智能感知平台' },
        { title: '低空智能感知平台未来展望' },
      ]},
      { num: '第5章', title: '低空数据标注方法', sections: [
        { title: '典型图像标注任务概述' },
        { title: '典型图像标注工具介绍' },
        { title: '自动化标注方法' },
        { title: '具身数据标注方法' },
        { title: '人机协同标注工具案例' },
      ]},
      { num: '第6章', title: '低空智能感知典型技术——目标检测', sections: [
        { title: '目标检测概述' },
        { title: '经典目标检测模型' },
        { title: '无人机目标检测典型方法' },
        { title: 'YOLO11原生开发实战' },
      ]},
      { num: '第7章', title: '低空智能感知典型技术——多模态大模型', sections: [
        { title: '多模态大模型发展背景' },
        { title: '多模态大模型架构基础' },
        { title: '典型多模态大模型' },
        { title: '多模态大模型应用场景' },
      ]},
      { num: '第8章', title: '低空小模型轻量化训练', sections: [
        { title: '低空小模型概述' },
        { title: '模型轻量化方法' },
        { title: '低空小模型训练实战案例' },
      ]},
      { num: '第9章', title: '无人机感知模型端侧部署方法', sections: [
        { title: '无人机端侧部署概述' },
        { title: '无人机典型端侧算力平台' },
        { title: '低空智能感知模型部署流程' },
        { title: '无人机感知模型端侧部署实战案例' },
      ]},
      { num: '第10章', title: '无人机感控一体化技术', sections: [
        { title: '低空感控一体化概述' },
        { title: '典型感控一体化技术' },
        { title: '无人机飞行控制平台' },
        { title: '无人机感知控制操作系统（ROS、ROS2）' },
      ]},
      { num: '实战案例', title: '综合项目实战', sections: [
        { title: '无人机计数项目介绍' },
        { title: '无人机检测项目介绍' },
        { title: '检测案例实战' },
        { title: '计数案例实战' },
      ]},
    ],
  },
  graduate: {
    title: '研究生版',
    subtitle: '深研前沿理论，孵化高层次拔尖人才',
    target: '计算机、机器人、自动化等相关专业研究生',
    description: '贯穿数据采集到模型创新、复杂场景应用到技术前沿探索的完整科研链条。注重核心算法的理论推导与前沿进展剖析，系统解析大模型微调范式与"云-边-端"协同部署体系，旨在培养具备独立科研创新能力、复杂系统设计与集成能力的高层次专门人才。',
    chapters: [
      { num: '第1章', title: '低空无人机结构与感知系统', sections: [
        { title: '低空无人机典型结构' },
        { title: '低空无人机主要感知载荷' },
        { title: '低空无人机感知系统' },
        { title: '低空感知数据采集概述' },
        { title: '基于网络爬虫的低空感知数据采集方法' },
      ]},
      { num: '第2章', title: '低空场景数据虚拟合成方法', sections: [
        { title: '低空虚拟数据生成概述' },
        { title: '低空虚拟数据生成的技术体系' },
        { title: '低空虚拟数据生成的验证与效能评估' },
        { title: '低空虚拟数据生成的挑战、局限与未来展望' },
      ]},
      { num: '第3章', title: '感知数据基座及标注平台', sections: [
        { title: '低空感知数据基座及标注平台概述' },
        { title: '典型低空感知数据基准' },
        { title: '典型标注任务及标注工具概述' },
        { title: '标注问题评估与质量提升策略' },
        { title: '"百城百景"低空智能感知平台' },
        { title: '低空智能感知基座及标注平台未来展望' },
      ]},
      { num: '第4章', title: '低空智能感知典型技术——目标检测', sections: [
        { title: '目标检测概述' },
        { title: '典型无人机目标检测模型' },
        { title: '基于大模型的目标检测方法' },
        { title: '基于大模型的目标检测项目实战' },
      ]},
      { num: '第5章', title: '低空智能感知典型技术——多模态大模型', sections: [
        { title: '多模态大模型发展背景' },
        { title: '多模态大模型架构基础' },
        { title: '典型多模态大模型' },
        { title: '多模态大模型案例实战' },
      ]},
      { num: '第6章', title: '低空大模型微调方法', sections: [
        { title: '大模型微调概述' },
        { title: '通用大模型与低空垂直领域大模型' },
        { title: '大模型微调的低空典型应用' },
        { title: '大模型微调典型方法' },
        { title: '低空大模型微调技术实践介绍' },
      ]},
      { num: '第7章', title: '低空感知云平台部署', sections: [
        { title: '云平台模型部署概述' },
        { title: '云端部署技术栈' },
        { title: '云端推理服务部署流程' },
        { title: '性能优化与监控' },
        { title: 'YOLO算法云端部署案例详解' },
      ]},
      { num: '第8章', title: '低空小模型轻量化训练', sections: [
        { title: '低空小模型概述' },
        { title: '模型轻量化方法' },
        { title: '低空小模型训练实战案例' },
      ]},
      { num: '第9章', title: '无人机感知模型端侧部署方法', sections: [
        { title: '无人机端侧部署概述' },
        { title: '端侧算力的技术框架' },
        { title: '无人机典型端侧算力平台' },
        { title: '无人机感知模型端侧部署实战案例' },
      ]},
      { num: '第10章', title: '无人机低空具身智能', sections: [
        { title: '低空具身智能发展概述' },
        { title: '低空具身智能典型框架' },
        { title: '无人机视觉语言导航模型' },
        { title: '无人机视觉语言动作模型' },
        { title: '无人机具身智能操作系统（ROS、ROS2）' },
      ]},
      { num: '实战案例', title: '综合项目实战', sections: [
        { title: '项目任务介绍' },
        { title: '基于大模型的目标检测模型介绍' },
        { title: '检测与计数实战' },
      ]},
    ],
  },
};

const TextbookDetail: React.FC = () => {
  const { version } = useParams<{ version: string }>();

  const versionData = version ? textbookVersions[version as keyof typeof textbookVersions] : null;

  if (!versionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">教材版本不存在</h2>
          <Link to={VISDRONE_ROUTES.EDUCATION} className="text-primary hover:underline">
            返回低空教育页面
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            to={VISDRONE_ROUTES.EDUCATION}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回低空教育
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              《低空智能感知》系列教材
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{versionData.title}</h1>
            <p className="text-xl text-white/70">{versionData.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">教材简介</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{versionData.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">适用对象：</span>
                  <span className="font-medium">{versionData.target}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-6">教材目录</h2>
              <div className="space-y-4">
                {versionData.chapters.map((chapter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-3">
                          {chapter.num} {chapter.title}
                        </h3>
                        <div className="space-y-2">
                          {chapter.sections.map((section, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                              <span>{section.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-8">
              <h3 className="text-lg font-bold mb-4">教材特色</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">全链路技术体系</h4>
                    <p className="text-sm text-muted-foreground">从数据到底层算法到端侧部署</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">场景驱动教学</h4>
                    <p className="text-sm text-muted-foreground">理论与实践深度融合</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">综合实战案例</h4>
                    <p className="text-sm text-muted-foreground">从0到1的工程实践范例</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">产教融合</h4>
                    <p className="text-sm text-muted-foreground">对接产业工程人才需求</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TextbookDetail;