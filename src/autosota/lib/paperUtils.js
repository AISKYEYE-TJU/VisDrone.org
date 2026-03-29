// 读取所有论文JSON文件
export const loadAllPapers = async () => {
  try {
    // 从知识库目录读取papers.json文件，包含所有论文信息
    const response = await fetch('/knowledge_base/papers.json');
    if (response.ok) {
      const papers = await response.json();
      return papers;
    }
    
    // 如果读取失败，返回空数组
    return [];
  } catch (error) {
    console.error('Error loading papers:', error);
    return [];
  }
};

// 读取所有CVF论文数据（优化版本）
export const loadAllCVFPapers = async (filters = {}) => {
  try {
    let papers = [];
    
    // 加载合并后的CVF论文文件（只加载CCF A论文，不包含实验室论文）
    const response = await fetch('/cvf-papers/all-cvf-papers.json');
    if (response.ok) {
      papers = await response.json();
    }
    
    // 如果是NeurIPS论文，额外加载NeurIPS论文文件（带PDF链接）
    if (!filters.conference || filters.conference === 'NeurIPS' || filters.conference === 'all') {
      // 加载nips_all_papers_with_pdf.json文件（带PDF链接）
      try {
        const nipsResponse = await fetch('/cvf-papers/nips_all_papers_with_pdf.json');
        if (nipsResponse.ok) {
          const nipsPapers = await nipsResponse.json();
          // 去重后添加
          const existingIds = new Set(papers.map(p => p.id));
          const newNipsPapers = nipsPapers.filter(p => !existingIds.has(p.id));
          papers = papers.concat(newNipsPapers);
        }
      } catch (nipsError) {
        console.error('Error loading NeurIPS papers with PDF links:', nipsError);
      }
    }
    
    // 应用筛选条件
    if (Object.keys(filters).length > 0) {
      return papers.filter(paper => {
        let match = true;
        
        if (filters.conference && filters.conference !== 'all') {
          match = match && paper.conference === filters.conference;
        }
        
        if (filters.year && filters.year !== 'all') {
          match = match && paper.year === filters.year;
        }
        
        if (filters.query) {
          const lowerQuery = filters.query.toLowerCase();
          match = match && (
            paper.title.toLowerCase().includes(lowerQuery) ||
            (Array.isArray(paper.authors) 
              ? paper.authors.some(author => author.toLowerCase().includes(lowerQuery))
              : (paper.authors && paper.authors.toLowerCase().includes(lowerQuery)))
            ||
            (paper.summary && paper.summary.toLowerCase().includes(lowerQuery))
          );
        }
        
        return match;
      });
    }
    
    return papers;
  } catch (error) {
    console.error('Error loading CVF papers:', error);
    return [];
  }
};

// 按需加载论文数据（按会议和年份）
export const loadCVFPapersByFilter = async (conference = 'all', year = 'all') => {
  try {
    // 对于NeurIPS和ICML，直接加载所有数据并筛选
    if (conference === 'NeurIPS' || conference === 'ICML') {
      return loadAllCVFPapers({ conference, year });
    }
    
    // 对于其他会议，尝试加载对应的文件
    if (conference !== 'all' && year !== 'all') {
      try {
        const response = await fetch(`/cvf-papers/${conference}/${year}.json`);
        if (response.ok) {
          const papers = await response.json();
          return papers;
        }
      } catch (error) {
        console.error(`Error loading ${conference} ${year} papers:`, error);
      }
    }
    
    // 如果加载失败或没有指定具体筛选条件，加载所有数据
    return loadAllCVFPapers({ conference, year });
  } catch (error) {
    console.error('Error loading CVF papers by filter:', error);
    return [];
  }
};

// 读取数据集信息
export const loadDatasets = async () => {
  try {
    // 数据集信息，包含准确的下载链接
    const datasets = [
      // 红外和可见光图像融合数据集
      { name: "TNO", paper: "The TNO multiband image data collection", note: "红外和可见光图像融合数据集", downloadUrl: "https://figshare.com/articles/dataset/TNO_Image_Fusion_Dataset/1008029" },
      { name: "INO", paper: "INO Video Analytics Dataset", note: "红外和可见光图像融合数据集", downloadUrl: "https://www.ino.ca/en/technologies/video-analytics-dataset/videos/" },
      { name: "RoadScene", paper: "U2Fusion: A unified unsupervised image fusion network", note: "红外和可见光图像融合数据集", downloadUrl: "https://github.com/hanna-xu/RoadScene" },
      { name: "MSRS", paper: "PIAFusion: A progressive infrared and visible image fusion network based on illumination aware", note: "红外和可见光图像融合数据集", downloadUrl: "https://github.com/Linfeng-Tang/MSRS" },
      { name: "LLVIP", paper: "LLVIP: A visible-infrared paired dataset for low-light vision", note: "红外和可见光图像融合数据集", downloadUrl: "https://bupt-ai-cz.github.io/LLVIP/" },
      { name: "M3FD", paper: "Target-aware dual adversarial learning and a multi-scenario multi-modality benchmark to fuse infrared and visible for object detection", note: "红外和可见光图像融合数据集", downloadUrl: "https://github.com/JinyuanLiu-CV/TarDAL" },
      // 医学图像融合数据集
      { name: "Harvard", paper: "Harvard Medical School MRI-CT Dataset", note: "医学图像融合数据集", downloadUrl: "http://www.med.harvard.edu/AANLIB/home.html" },
      // 多曝光图像融合数据集
      { name: "MEF", paper: "Multi-Exposure Image Fusion Dataset", note: "多曝光图像融合数据集", downloadUrl: "https://github.com/csjcai/SICE" },
      { name: "MEFB", paper: "MEFB: A New Dataset for Multi-Exposure Image Fusion", note: "多曝光图像融合数据集", downloadUrl: "https://github.com/xingchenzhang/MEFB" },
      // 多聚焦图像融合数据集
      { name: "Lytro", paper: "Fusion from Decomposition: A Self-Supervised Decomposition Approach for Image Fusion", note: "多聚焦图像融合数据集", downloadUrl: "https://mansournejati.ece.iut.ac.ir/content/lytro-multi-focus-dataset" },
      { name: "MFI-WHU", paper: "Multi-focus image fusion: A survey of the state of the art", note: "多聚焦图像融合数据集", downloadUrl: "https://github.com/HaoZhang1018/MFI-WHU" },
      { name: "MFFW", paper: "MFFW: A new dataset for multi-focus image fusion", note: "多聚焦图像融合数据集", downloadUrl: "https://www.semanticscholar.org/paper/MFFW%3A-A-new-dataset-for-multi-focus-image-fusion-Xu-Wei/4c0658f338849284ee4251a69b3c323908e62b45" },
      // 全色图像锐化数据集
      { name: "GaoFen", paper: "GaoFen Satellite Imagery", note: "全色图像锐化数据集", downloadUrl: "https://directory.eoportal.org/web/eoportal/satellite-missions/g" },
      { name: "WorldView", paper: "NASA WorldView Satellite Imagery", note: "全色图像锐化数据集", downloadUrl: "https://worldview.earthdata.nasa.gov/" },
      { name: "GeoEye", paper: "GeoEye-1 Satellite Imagery", note: "全色图像锐化数据集", downloadUrl: "https://earth.esa.int/eogateway/missions/geoeye-1" },
      { name: "QuickBird", paper: "QuickBird Satellite Imagery", note: "全色图像锐化数据集", downloadUrl: "https://www.satimagingcorp.com/satellite-sensors/quickbird/" }
    ];
    
    return datasets;
  } catch (error) {
    console.error('Error loading datasets:', error);
    return [];
  }
};

// 读取算法信息
export const loadAlgorithms = async () => {
  try {
    // 从知识库目录读取algorithms.json文件
    const response = await fetch('/knowledge_base/algorithms.json');
    if (response.ok) {
      const algorithms = await response.json();
      return algorithms;
    }
    
    // 如果读取失败，返回空数组
    return [];
  } catch (error) {
    console.error('Error loading algorithms:', error);
    return [];
  }
};