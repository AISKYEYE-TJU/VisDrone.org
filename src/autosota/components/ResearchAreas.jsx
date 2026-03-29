import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Brain, Users, ArrowRight, FileText, Database, Code2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

// 直接导入研究方向数据
const researchAreasData = {
  "areas": [
    {
      "id": "low-altitude-perception",
      "name": "低空环境感知",
      "nameEn": "Low-Altitude Environmental Perception",
      "description": "面向低空复杂环境的目标感知与理解，包括低空目标检测、多模态融合、反无人机、低空目标跟踪等关键技术，为低空飞行器提供全方位的环境感知能力。",
      "icon": "eye",
      "color": "from-blue-500 to-cyan-500",
      "subAreas": [
        {
          "id": "object-detection",
          "name": "低空目标检测",
          "nameEn": "Low-Altitude Object Detection",
          "description": "低空小目标检测、弱小目标识别、多尺度目标检测、复杂背景下的目标检测等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "multi-modal-fusion",
          "name": "多模态融合",
          "nameEn": "Multi-Modal Fusion",
          "description": "红外与可见光图像融合、多光谱图像融合、多传感器数据融合、特征级融合等",
          "stats": {
            "papers": 207,
            "datasets": 14,
            "algorithms": 35
          }
        },
        {
          "id": "anti-uav",
          "name": "反无人机",
          "nameEn": "Anti-UAV Systems",
          "description": "无人机检测与识别、无人机追踪、反制技术、低空安防等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "object-tracking",
          "name": "低空目标跟踪",
          "nameEn": "Low-Altitude Object Tracking",
          "description": "多目标跟踪、长时间跟踪、遮挡处理、运动预测等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        }
      ]
    },
    {
      "id": "low-altitude-embodied-ai",
      "name": "低空具身智能",
      "nameEn": "Low-Altitude Embodied AI",
      "description": "面向低空飞行器的具身智能技术，包括世界模型、视觉 - 语言 - 动作模型、视觉语言导航、端到端飞行器等，实现飞行器的智能化和自主化。",
      "icon": "brain",
      "color": "from-purple-500 to-pink-500",
      "subAreas": [
        {
          "id": "world-model",
          "name": "世界模型",
          "nameEn": "World Models",
          "description": "低空环境建模、动态场景预测、物理引擎、仿真环境等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "vla",
          "name": "VLA(视觉 - 语言 - 动作)",
          "nameEn": "Vision-Language-Action Models",
          "description": "视觉语言动作模型、多模态指令理解、动作生成与执行等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "vln",
          "name": "VLN(视觉语言导航)",
          "nameEn": "Vision-Language Navigation",
          "description": "视觉语言导航、指令跟随导航、语义地图构建与导航等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "end-to-end-uav",
          "name": "端到端飞行器",
          "nameEn": "End-to-End UAV Control",
          "description": "端到端飞行控制、感知决策一体化、强化学习飞行控制等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        }
      ]
    },
    {
      "id": "low-altitude-swarm-intelligence",
      "name": "低空群体智能",
      "nameEn": "Low-Altitude Swarm Intelligence",
      "description": "低空飞行器群体智能协同技术，包括空地协同、多机协同、群体具身、社会化学习等，实现大规模无人机群体的高效协同与智能涌现。",
      "icon": "users",
      "color": "from-orange-500 to-red-500",
      "subAreas": [
        {
          "id": "air-ground-coordination",
          "name": "空地协同",
          "nameEn": "Air-Ground Coordination",
          "description": "空地协同感知、空地协同作业、异构平台协同等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "multi-uav-coordination",
          "name": "多机协同",
          "nameEn": "Multi-UAV Coordination",
          "description": "多机编队控制、协同路径规划、分布式协同决策等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "swarm-embodied",
          "name": "群体具身",
          "nameEn": "Swarm Embodiment",
          "description": "群体具身智能、群体行为涌现、自组织协同等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        },
        {
          "id": "social-learning",
          "name": "社会化学习",
          "nameEn": "Social Learning",
          "description": "群体知识共享、模仿学习、群体技能传递等",
          "stats": {
            "papers": 0,
            "datasets": 0,
            "algorithms": 0
          }
        }
      ]
    }
  ],
  "globalStats": {
    "totalPapers": 207,
    "totalDatasets": 14,
    "totalAlgorithms": 35,
    "totalSubAreas": 12
  }
};

const ResearchAreas = () => {
  const areas = researchAreasData.areas;

  const getIconComponent = (iconName) => {
    const icons = {
      eye: Eye,
      brain: Brain,
      users: Users
    };
    return icons[iconName] || Eye;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 py-24">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm mb-8"
            >
              <Layers className="w-4 h-4" />
              <span>低空智能实验室</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              研究方向
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              聚焦三大核心研究方向，涵盖低空环境感知、具身智能与群体智能，
              推动低空飞行器智能化技术发展
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Areas Grid */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {areas.map((area, index) => {
            const IconComponent = getIconComponent(area.icon);
            const totalPapers = area.subAreas.reduce((sum, sub) => sum + (sub.stats?.papers || 0), 0);
            const totalDatasets = area.subAreas.reduce((sum, sub) => sum + (sub.stats?.datasets || 0), 0);
            const totalAlgorithms = area.subAreas.reduce((sum, sub) => sum + (sub.stats?.algorithms || 0), 0);

            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group"
              >
                <Link to={`/autosota/areas/${area.id}`} className="block h-full">
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${area.color} p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full`}>
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {area.name}
                      </h3>
                      <p className="text-sm text-white/70 mb-4">
                        {area.nameEn}
                      </p>

                      {/* Description */}
                      <p className="text-white/90 text-sm leading-relaxed mb-6 line-clamp-3">
                        {area.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FileText className="w-4 h-4 text-white/70" />
                            <span className="text-2xl font-bold text-white">{totalPapers}</span>
                          </div>
                          <div className="text-xs text-white/60">论文</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Database className="w-4 h-4 text-white/70" />
                            <span className="text-2xl font-bold text-white">{totalDatasets}</span>
                          </div>
                          <div className="text-xs text-white/60">数据集</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Code2 className="w-4 h-4 text-white/70" />
                            <span className="text-2xl font-bold text-white">{totalAlgorithms}</span>
                          </div>
                          <div className="text-xs text-white/60">算法</div>
                        </div>
                      </div>

                      {/* Sub Areas Count */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/20">
                        <span className="text-sm text-white/80">
                          {area.subAreas.length} 个细分方向
                        </span>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Sub Areas Overview */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              细分方向总览
            </h2>
            <p className="text-muted-foreground text-lg">
              共 {areas.reduce((sum, area) => sum + area.subAreas.length, 0)} 个细分研究方向
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {areas.map((area, areaIndex) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: areaIndex * 0.2 }}
              >
                <h3 className={`text-xl font-bold bg-gradient-to-r ${area.color} bg-clip-text text-transparent mb-6`}>
                  {area.name}
                </h3>
                <ul className="space-y-4">
                  {area.subAreas.map((subArea, subIndex) => (
                    <Link to={`/autosota/areas/${area.id}/${subArea.id}`} key={subArea.id} className="block hover:no-underline">
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (areaIndex * 4 + subIndex) * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <h4 className="font-medium text-foreground mb-2">{subArea.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{subArea.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {subArea.stats?.papers || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            {subArea.stats?.algorithms || 0}
                          </span>
                        </div>
                      </motion.li>
                    </Link>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchAreas;