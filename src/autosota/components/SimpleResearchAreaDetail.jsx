import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
        }
      ]
    }
  ]
};

const SimpleResearchAreaDetail = () => {
  const { areaId, subAreaId } = useParams();
  const [area, setArea] = useState(null);
  const [subArea, setSubArea] = useState(null);
  const [papers, setPapers] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted with areaId:', areaId, 'subAreaId:', subAreaId);
    
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

    // 模拟数据加载
    setTimeout(() => {
      setPapers([{ id: 1, title: 'Test Paper' }]);
      setAlgorithms([{ id: 1, name: 'Test Algorithm' }]);
      setLoading(false);
    }, 1000);
  }, [areaId, subAreaId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!area) {
    return (
      <div>
        <h1>研究方向不存在</h1>
        <Link to="/autosota/areas">返回研究方向列表</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{subArea ? subArea.name : area.name}</h1>
      <p>{subArea ? subArea.description : area.description}</p>
      <h2>论文列表</h2>
      {papers.length > 0 ? (
        <ul>
          {papers.map(paper => (
            <li key={paper.id}>{paper.title}</li>
          ))}
        </ul>
      ) : (
        <p>暂无论文数据</p>
      )}
      <h2>算法列表</h2>
      {algorithms.length > 0 ? (
        <ul>
          {algorithms.map(algorithm => (
            <li key={algorithm.id}>{algorithm.name}</li>
          ))}
        </ul>
      ) : (
        <p>暂无算法数据</p>
      )}
    </div>
  );
};

export default SimpleResearchAreaDetail;