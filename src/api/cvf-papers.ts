// 论文数据类型定义
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  conference: string;
  year: string;
  venue: string;
  summary?: string;
  url?: string;
  pdfLink?: string;
  arxivLink?: string;
  suppLink?: string;
  bibtex?: string;
  pages?: string;
  paperUrl?: string;
}

// 从公共目录获取CVF论文数据
export async function getLocalCVFPapers(conference: string, year: string): Promise<Paper[]> {
  try {
    // 构建数据文件URL（使用相对路径）
    const dataUrl = `cvf-papers/${conference}/${year}.json`;
    console.log(`尝试获取数据: ${dataUrl}`);
    
    // 发送请求
    const response = await fetch(dataUrl);
    console.log(`响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.log(`文件不存在: ${dataUrl}`);
      return [];
    }
    
    // 解析响应
    const papers: Paper[] = await response.json();
    console.log(`获取到 ${papers.length} 篇论文`);
    
    // 为每篇论文生成唯一ID
    return papers.map((paper, index) => ({
      ...paper,
      id: paper.id || `${conference}-${year}-${index}`,
      summary: paper.summary || paper.abstract || 'No abstract available',
      venue: paper.venue || conference,
      url: paper.url || paper.paperUrl
    }));
  } catch (error) {
    console.error('获取本地CVF论文数据失败:', error);
    return [];
  }
}

// 搜索本地CVFPapers
export async function searchLocalCVFPapers(query: string, conference: string = 'all', year: string = 'all', limit: number = 10000): Promise<Paper[]> {
  try {
    let allPapers: Paper[] = [];
    
    // 支持的会议列表
    const conferences = conference === 'all' ? ['CVPR', 'ICCV'] : [conference];
    
    // 支持的年份列表（动态获取）
    const allYears = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013'];
    const years = year === 'all' ? allYears : [year];
    
    // 读取所有符合条件的论文
    for (const conf of conferences) {
      for (const yr of years) {
        const papers = await getLocalCVFPapers(conf, yr);
        allPapers = [...allPapers, ...papers];
      }
    }
    
    // 搜索关键词
    if (query) {
      const lowerQuery = query.toLowerCase();
      allPapers = allPapers.filter(paper => 
        paper.title.toLowerCase().includes(lowerQuery) ||
        paper.authors.some(author => author.toLowerCase().includes(lowerQuery)) ||
        (paper.summary && paper.summary.toLowerCase().includes(lowerQuery))
      );
    }
    
    // 限制结果数量（默认不限制）
    return allPapers.slice(0, limit);
  } catch (error) {
    console.error('搜索本地CVF论文失败:', error);
    return [];
  }
}

// 获取会议年份列表
export async function getCVFConferenceYears(conference: string): Promise<string[]> {
  // 支持的年份列表
  const allYears = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013'];
  
  // 测试哪些年份有数据
  const availableYears: string[] = [];
  for (const year of allYears) {
    try {
      const papers = await getLocalCVFPapers(conference, year);
      if (papers.length > 0) {
        availableYears.push(year);
      }
    } catch (error) {
      // 忽略错误，继续测试下一个年份
    }
  }
  
  return availableYears;
}

// 获取所有本地CVF论文统计信息
export async function getCVFPapersStats(): Promise<{
  totalPapers: number;
  conferences: {
    [key: string]: {
      totalPapers: number;
      years: string[];
    }
  };
}> {
  try {
    const stats = {
      totalPapers: 0,
      conferences: {} as {
        [key: string]: {
          totalPapers: number;
          years: string[];
        }
      }
    };
    
    // 支持的会议和年份
    const conferences = ['ICCV', 'CVPR'];
    const allYears = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013'];
    
    for (const conference of conferences) {
      let conferenceTotal = 0;
      const availableYears: string[] = [];
      
      for (const year of allYears) {
        try {
          // 直接从公共目录获取JSON文件
          const dataUrl = `cvf-papers/${conference}/${year}.json`;
          const response = await fetch(dataUrl);
          
          if (response.ok) {
            const papers = await response.json();
            conferenceTotal += papers.length;
            availableYears.push(year);
          }
        } catch (error) {
          // 忽略错误，继续测试下一个年份
        }
      }
      
      if (conferenceTotal > 0) {
        stats.totalPapers += conferenceTotal;
        stats.conferences[conference] = {
          totalPapers: conferenceTotal,
          years: availableYears
        };
      }
    }
    
    return stats;
  } catch (error) {
    console.error('获取CVF论文统计信息失败:', error);
    return {
      totalPapers: 0,
      conferences: {}
    };
  }
}