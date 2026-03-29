import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Database, Code2, ChevronRight, TrendingUp, ExternalLink } from 'lucide-react';

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

const ResearchAreaDetail = () => {
  const { areaId, subAreaId } = useParams();
  const navigate = useNavigate();
  const [area, setArea] = useState(null);
  const [subArea, setSubArea] = useState(null);
  const [papers, setPapers] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted with areaId:', areaId, 'subAreaId:', subAreaId);
    const fetchData = async () => {
      try {
        // 从本地数据中获取研究方向
        const currentArea = researchAreasData.areas.find(a => a.id === areaId);
        console.log('Found area:', currentArea);
        setArea(currentArea);

        // 从本地数据中获取细分方向
        if (currentArea && subAreaId) {
          const currentSubArea = currentArea.subAreas.find(sa => sa.id === subAreaId);
          console.log('Found subArea:', currentSubArea);
          setSubArea(currentSubArea);
        }

        try {
          // 加载该方向的论文
          const papersResponse = await fetch('/knowledge_base/papers.json');
          const papersData = await papersResponse.json();
          console.log('Papers data loaded:', papersData.length);
          let filteredPapers = papersData.filter(p => p.researchArea === areaId);
          // 如果有subAreaId，进一步过滤
          if (subAreaId) {
            filteredPapers = filteredPapers.filter(p => p.subArea === subAreaId);
            console.log('Filtered papers by subArea:', filteredPapers.length);
          }
          setPapers(filteredPapers);
        } catch (error) {
          console.error('Error loading papers:', error);
          setPapers([]);
        }

        try {
          // 加载该方向的算法
          const algosResponse = await fetch('/knowledge_base/algorithms.json');
          const algosData = await algosResponse.json();
          console.log('Algorithms data loaded:', algosData.length);
          let filteredAlgos = algosData.filter(a => a.researchArea === areaId);
          // 如果有subAreaId，进一步过滤
          if (subAreaId) {
            filteredAlgos = filteredAlgos.filter(a => a.subArea === subAreaId);
            console.log('Filtered algorithms by subArea:', filteredAlgos.length);
          }
          setAlgorithms(filteredAlgos);
        } catch (error) {
          console.error('Error loading algorithms:', error);
          setAlgorithms([]);
        }

        try {
          // 加载该方向的数据集
          const datasetsResponse = await fetch('/knowledge_base/datasets.json');
          const datasetsData = await datasetsResponse.json();
          console.log('Datasets data loaded:', datasetsData.length);
          let filteredDatasets = datasetsData.filter(d => d.researchArea === areaId);
          // 如果有subAreaId，进一步过滤
          if (subAreaId) {
            filteredDatasets = filteredDatasets.filter(d => d.subArea === subAreaId);
            console.log('Filtered datasets by subArea:', filteredDatasets.length);
          }
          setDatasets(filteredDatasets);
        } catch (error) {
          console.error('Error loading datasets:', error);
          setDatasets([]);
        }

        try {
          // 加载该方向的leaderboard
          const leaderboardResponse = await fetch('/knowledge_base/leaderboard.json');
          const leaderboardData = await leaderboardResponse.json();
          console.log('Leaderboard data loaded:', leaderboardData.length);
          let filteredLeaderboard = leaderboardData.filter(l => l.researchArea === areaId);
          // 如果有subAreaId，进一步过滤
          if (subAreaId) {
            filteredLeaderboard = filteredLeaderboard.filter(l => l.subArea === subAreaId);
            console.log('Filtered leaderboard by subArea:', filteredLeaderboard.length);
          }
          setLeaderboard(filteredLeaderboard);
        } catch (error) {
          console.error('Error loading leaderboard:', error);
          setLeaderboard([]);
        }

      } catch (error) {
        console.error('Error loading research area:', error);
      } finally {
        console.log('Loading complete');
        setLoading(false);
      }
    };

    fetchData();
  }, [areaId, subAreaId]);

  if (loading) {
    return (
      <div className="research-area-detail min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">加载中...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="research-area-detail min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">研究方向不存在</h1>
          <Link to="/autosota/areas" className="text-blue-600 hover:underline">
            返回研究方向列表
          </Link>
        </div>
      </div>
    );
  }

  if (subAreaId && !subArea) {
    return (
      <div className="research-area-detail min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">细分方向不存在</h1>
          <Link to={`/autosota/areas/${areaId}`} className="text-blue-600 hover:underline">
            返回研究方向
          </Link>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const stats = {
    papers: papers.length,
    algorithms: algorithms.length,
    datasets: datasets.length,
    leaderboard: leaderboard.length,
    subAreas: area.subAreas.length
  };

  // 快捷链接处理
  const handleNavigate = (path) => {
    let url = `${path}?area=${areaId}`;
    if (subAreaId) {
      url += `&subArea=${subAreaId}`;
    }
    navigate(url);
  };

  // 生成细分方向的配图URL
  const getSubAreaImageUrl = (subAreaId) => {
    const promptMap = {
      'object-detection': 'low altitude object detection, small objects in complex background, aerial view, AI technology, professional visualization',
      'multi-modal-fusion': 'multi-modal fusion technology, infrared and visible light image fusion, AI sensor data integration, professional visualization',
      'anti-uav': 'anti-UAV system, drone detection and tracking, security technology, professional visualization',
      'object-tracking': 'low altitude object tracking, multiple objects, motion prediction, AI technology, professional visualization',
      'world-model': 'low altitude world model, environmental modeling, 3D scene reconstruction, AI technology, professional visualization',
      'vla': 'vision-language-action model, AI system for UAV control, multi-modal interaction, professional visualization',
      'vln': 'vision-language navigation, UAV path planning, semantic map, professional visualization',
      'end-to-end-uav': 'end-to-end UAV control system, autonomous flight, AI decision making, professional visualization',
      'air-ground-coordination': 'air-ground coordination system, UAV and ground robot collaboration, professional visualization',
      'multi-uav-coordination': 'multi-UAV coordination, drone swarm formation, collaborative mission, professional visualization',
      'swarm-embodied': 'swarm intelligence, UAV swarm behavior, emergent intelligence, professional visualization',
      'social-learning': 'social learning in UAV swarms, knowledge sharing, collective intelligence, professional visualization'
    };
    
    const prompt = promptMap[subAreaId] || 'low altitude AI technology, professional visualization';
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_16_9`;
  };

  return (
    <div className="research-area-detail min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-r ${area.color} py-16`}>
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="detail-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
            <rect width="100" height="100" fill="url(#detail-grid)" />
          </svg>
        </div>

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/80 mb-6">
            <Link to="/autosota/areas" className="hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              研究方向
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/autosota/areas/${areaId}`} className="hover:text-white">
              {area.name}
            </Link>
            {subArea && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>{subArea.name}</span>
              </>
            )}
          </div>

          {/* Title and Description */}
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              {subArea ? subArea.name : area.name}
            </h1>
            <p className="text-xl text-white/90 mb-4">
              {subArea ? subArea.nameEn : area.nameEn}
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              {subArea ? subArea.description : area.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section with Quick Links */}
      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigate('/papers')}
            className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-4xl font-bold text-foreground">{stats.papers}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span>论文</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigate('/datasets')}
            className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-4xl font-bold text-foreground">{stats.datasets}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span>数据集</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigate('/algorithms')}
            className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Code2 className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-4xl font-bold text-foreground">{stats.algorithms}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span>算法</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigate('/leaderboard')}
            className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-4xl font-bold text-foreground">{stats.leaderboard}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span>Leaderboard</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub Area Introduction Section */}
      {subArea && (
        <section className="container py-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-foreground">{subArea.name} 介绍</h2>
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  {subArea.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {subAreaId === 'object-detection' && '低空目标检测是低空环境感知的核心技术之一，主要解决低空小目标、弱小目标的检测与识别问题。该技术在复杂背景下的目标检测、多尺度目标检测等场景中发挥着重要作用，为低空飞行器提供实时的环境感知能力。'}
                  {subAreaId === 'multi-modal-fusion' && '多模态融合技术通过整合不同传感器的数据，如红外与可见光图像、多光谱图像等，提高了低空环境感知的准确性和鲁棒性。该技术在特征级融合、决策级融合等方面取得了显著进展，为低空飞行器提供了更全面的环境信息。'}
                  {subAreaId === 'anti-uav' && '反无人机系统是低空安全领域的重要技术，主要包括无人机检测与识别、追踪、反制等核心功能。该技术在低空安防、重要区域保护等场景中发挥着关键作用，保障了低空领域的安全。'}
                  {subAreaId === 'object-tracking' && '低空目标跟踪技术主要解决多目标跟踪、长时间跟踪、遮挡处理、运动预测等问题。该技术为低空飞行器提供了持续的目标监测能力，是实现自主导航和任务执行的重要基础。'}
                  {subAreaId === 'world-model' && '世界模型技术通过构建低空环境的数字化模型，实现了对动态场景的预测和模拟。该技术在低空环境建模、物理引擎、仿真环境等方面取得了重要进展，为低空飞行器的决策和规划提供了有力支持。'}
                  {subAreaId === 'vla' && '视觉-语言-动作(VLA)模型整合了视觉感知、语言理解和动作生成能力，实现了人机交互的自然化和智能化。该技术在多模态指令理解、动作生成与执行等方面取得了显著成果，为低空飞行器的操控提供了新的范式。'}
                  {subAreaId === 'vln' && '视觉语言导航(VLN)技术通过理解自然语言指令和视觉场景，实现了自主导航能力。该技术在指令跟随导航、语义地图构建与导航等方面取得了重要进展，为低空飞行器的自主任务执行提供了支持。'}
                  {subAreaId === 'end-to-end-uav' && '端到端飞行器技术通过深度学习等方法，实现了从感知到控制的端到端优化。该技术在端到端飞行控制、感知决策一体化、强化学习飞行控制等方面取得了显著成果，推动了低空飞行器的智能化发展。'}
                  {subAreaId === 'air-ground-coordination' && '空地协同技术通过整合空中和地面平台的优势，实现了更高效的任务执行。该技术在空地协同感知、协同作业、异构平台协同等方面取得了重要进展，为复杂任务的完成提供了新的思路。'}
                  {subAreaId === 'multi-uav-coordination' && '多机协同技术通过多无人机的编队控制、协同路径规划、分布式协同决策等方法，实现了群体智能的涌现。该技术在大规模任务执行、复杂环境适应等方面发挥着重要作用。'}
                  {subAreaId === 'swarm-embodied' && '群体具身智能技术通过多智能体的自组织协同，实现了群体行为的涌现和智能的提升。该技术在群体具身智能、自组织协同等方面取得了重要进展，为大规模无人机集群的应用提供了理论基础。'}
                  {subAreaId === 'social-learning' && '社会化学习技术通过群体知识共享、模仿学习、群体技能传递等方法，实现了群体智能的持续进化。该技术为无人机集群的知识积累和能力提升提供了新的途径。'}
                </p>
              </div>
              <div className="h-80 lg:h-auto relative">
                <img 
                  src={getSubAreaImageUrl(subAreaId)} 
                  alt={subArea.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sub Areas Section - Only show for main area pages, not sub-area pages */}
      {!subAreaId && (
        <section className="container py-12">
          <h2 className="text-3xl font-bold mb-8 text-foreground">细分方向</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {area.subAreas.map((subArea, index) => (
              <motion.div
                key={subArea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {subArea.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {subArea.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-blue-600">
                    <FileText className="w-4 h-4" />
                    {subArea.stats?.papers || 0}
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    <Code2 className="w-4 h-4" />
                    {subArea.stats?.algorithms || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Papers Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              论文列表
            </h2>
            <Link
              to={`/papers?area=${areaId}${subAreaId ? `&subArea=${subAreaId}` : ''}`}
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.slice(0, 6).map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-2">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {paper.authors || '未知'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{paper.year || '未知'}</span>
                    <span className="line-clamp-1">{paper.journal || '未知'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>暂无论文数据</p>
            </div>
          )}
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            算法列表
          </h2>
          <Link
            to={`/algorithms?area=${areaId}${subAreaId ? `&subArea=${subAreaId}` : ''}`}
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {algorithms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.slice(0, 6).map((algo, index) => (
              <motion.div
                key={algo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {algo.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {algo.paper}
                </p>
                <a
                  href={algo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                >
                  查看代码
                  <ChevronRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Code2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>暂无算法数据</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResearchAreaDetail;