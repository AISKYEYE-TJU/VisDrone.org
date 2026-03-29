import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

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

const ResearchAreaFilter = ({ onFilterChange, initialArea = '', initialSub = '' }) => {
  const [researchAreas] = useState(researchAreasData.areas);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedSub, setSelectedSub] = useState(initialSub);
  const [subAreas, setSubAreas] = useState([]);

  useEffect(() => {
    if (initialArea) {
      const area = researchAreas.find(a => a.id === initialArea);
      if (area) {
        setSubAreas(area.subAreas);
      }
    }
  }, [initialArea, researchAreas]);

  useEffect(() => {
    if (selectedArea) {
      const area = researchAreas.find(a => a.id === selectedArea);
      if (area) {
        setSubAreas(area.subAreas);
        if (!initialSub) {
          setSelectedSub('');
        }
      }
    } else {
      setSubAreas([]);
      setSelectedSub('');
    }
  }, [selectedArea, researchAreas, initialSub]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        researchArea: selectedArea,
        subArea: selectedSub
      });
    }
  }, [selectedArea, selectedSub, onFilterChange]);

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);
    setSelectedSub('');
  };

  const handleSubChange = (e) => {
    setSelectedSub(e.target.value);
  };

  const handleClear = () => {
    setSelectedArea('');
    setSelectedSub('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
          <Filter className="w-5 h-5" />
          <span>按研究方向筛选：</span>
        </div>

        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedArea}
            onChange={handleAreaChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">所有研究方向</option>
            {researchAreas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedSub}
            onChange={handleSubChange}
            disabled={!selectedArea}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">所有细分方向</option>
            {subAreas.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {(selectedArea || selectedSub) && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            清除筛选
          </button>
        )}
      </div>

      {(selectedArea || selectedSub) && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>当前筛选：</span>
          {selectedArea && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {researchAreas.find(a => a.id === selectedArea)?.name}
            </span>
          )}
          {selectedSub && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
              {subAreas.find(s => s.id === selectedSub)?.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchAreaFilter;