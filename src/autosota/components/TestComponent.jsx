import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TestComponent = () => {
  const { areaId, subAreaId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Area ID:', areaId);
        console.log('SubArea ID:', subAreaId);
        
        // 测试数据加载
        const papersResponse = await fetch('/knowledge_base/papers.json');
        const papersData = await papersResponse.json();
        console.log('Papers data loaded:', papersData.length);
        
        const algosResponse = await fetch('/knowledge_base/algorithms.json');
        const algosData = await algosResponse.json();
        console.log('Algorithms data loaded:', algosData.length);
        
        setData({ papers: papersData, algorithms: algosData });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [areaId, subAreaId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Test Component</h1>
      <p>Area ID: {areaId}</p>
      <p>SubArea ID: {subAreaId}</p>
      <p>Papers: {data.papers.length}</p>
      <p>Algorithms: {data.algorithms.length}</p>
    </div>
  );
};

export default TestComponent;