import React, { useState, useEffect } from 'react';
import { loadDatasets } from '../lib/paperUtils';

const Data = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 加载数据集数据
    const fetchDatasets = async () => {
      try {
        const loadedDatasets = await loadDatasets();
        setDatasets(loadedDatasets);
      } catch (error) {
        console.error('Error loading datasets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  if (loading) {
    return (
      <div className="data">
        <section className="container py-16">
          <h1 className="text-4xl font-bold mb-6 text-foreground">数据集</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="data">
      <section className="container py-16">
        <h1 className="text-4xl font-bold mb-6 text-foreground">数据集</h1>
        <p className="text-lg text-muted-foreground mb-12">
          AI4R 系统提供丰富的图像融合数据集，支持 Benchmark 管理模块自动评测与 SOTA 追踪。
        </p>

        <h2 className="text-3xl font-bold mb-8 text-foreground">图像融合数据集</h2>
        <div className="table-container mb-8">
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>数据集名称</th>
                <th>论文名</th>
                <th>备注</th>
                <th>下载链接</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{dataset.name}</td>
                  <td>{dataset.paper}</td>
                  <td>{dataset.note}</td>
                  <td><a href={dataset.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">下载</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
};

export default Data;