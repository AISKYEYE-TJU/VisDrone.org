// CHI论文下载配置
export const CHI_PAPERS_CONFIG = {
  // 存储路径
  storage: {
    basePath: 'chi-papers',
    pdfPath: 'chi-papers/pdf',
    metadataPath: 'chi-papers/metadata'
  },
  
  // 下载设置
  download: {
    timeout: 30000, // 30秒超时
    retryCount: 3,  // 重试次数
    batchSize: 10   // 批量下载大小
  },
  
  // CHI会议年份范围
  years: {
    start: 2010,    // 起始年份
    end: 2025      // 结束年份
  },
  
  // 人机协同领域关键词
  humanComputerInteraction: {
    keywords: [
      'human-computer interaction',
      'human-ai collaboration',
      'human-agent interaction',
      'collaborative systems',
      'mixed initiative',
      'human-robot interaction',
      'augmented intelligence',
      'human-centered AI'
    ]
  }
};
