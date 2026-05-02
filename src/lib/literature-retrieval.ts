import { searchSemanticScholar, searchArxiv, SemanticScholarPaper, ArxivPaper } from '@/config/api';

interface LiteratureSearchOptions {
  query: string;
  sources?: ('semanticScholar' | 'arxiv')[];
  limits?: {
    semanticScholar?: number;
    arxiv?: number;
  };
  timeRange?: {
    startYear?: number;
    endYear?: number;
  };
  venues?: string[];
}

interface LiteratureSearchResult {
  query: string;
  semanticScholar: SemanticScholarPaper[];
  arxiv: ArxivPaper[];
  totalResults: number;
  responseTime: number;
  timestamp: Date;
}

interface ZoteroItem {
  itemKey: string;
  title: string;
  authors: string;
  year: number;
  doi?: string;
  url?: string;
}

class LiteratureRetrieval {
  /**
   * 搜索多个数据源的文献
   */
  static async search(options: LiteratureSearchOptions): Promise<LiteratureSearchResult> {
    const startTime = Date.now();
    const { 
      query, 
      sources = ['semanticScholar', 'arxiv'],
      limits = { semanticScholar: 20, arxiv: 15 }
    } = options;

    let semanticScholarResults: SemanticScholarPaper[] = [];
    let arxivResults: ArxivPaper[] = [];

    // 优化搜索策略：处理中文查询词
    let optimizedQuery = query;
    // 检查是否包含中文字符
    if (/[\u4e00-\u9fa5]/.test(query)) {
      console.log('检测到中文查询词，尝试优化搜索策略');
      // 简单的中文关键词提取和英文翻译提示
      // 实际项目中可以集成翻译API
    }

    // 串行搜索多个数据源，避免同时触发速率限制
    if (sources.includes('semanticScholar')) {
      try {
        console.log('开始搜索 Semantic Scholar:', optimizedQuery);
        semanticScholarResults = await searchSemanticScholar(optimizedQuery, limits.semanticScholar || 20);
        console.log('Semantic Scholar 搜索结果:', semanticScholarResults.length, '篇');
      } catch (error) {
        console.error('Semantic Scholar 搜索失败:', error);
        // 尝试使用更通用的关键词
        if (optimizedQuery.length > 50) {
          const simplifiedQuery = optimizedQuery.substring(0, 50);
          console.log('尝试使用简化关键词:', simplifiedQuery);
          try {
            semanticScholarResults = await searchSemanticScholar(simplifiedQuery, limits.semanticScholar || 10);
            console.log('简化关键词搜索结果:', semanticScholarResults.length, '篇');
          } catch (e) {
            console.error('简化关键词搜索也失败:', e);
          }
        }
      }
    }

    if (sources.includes('arxiv')) {
      try {
        console.log('开始搜索 arXiv:', optimizedQuery);
        arxivResults = await searchArxiv(optimizedQuery, limits.arxiv || 15);
        console.log('arXiv 搜索结果:', arxivResults.length, '篇');
      } catch (error) {
        console.error('arXiv 搜索失败:', error);
        // 尝试使用更通用的关键词
        if (optimizedQuery.length > 50) {
          const simplifiedQuery = optimizedQuery.substring(0, 50);
          console.log('尝试使用简化关键词:', simplifiedQuery);
          try {
            arxivResults = await searchArxiv(simplifiedQuery, limits.arxiv || 10);
            console.log('简化关键词搜索结果:', arxivResults.length, '篇');
          } catch (e) {
            console.error('简化关键词搜索也失败:', e);
          }
        }
      }
    }

    const endTime = Date.now();

    return {
      query,
      semanticScholar: semanticScholarResults,
      arxiv: arxivResults,
      totalResults: semanticScholarResults.length + arxivResults.length,
      responseTime: endTime - startTime,
      timestamp: new Date()
    };
  }

  /**
   * 从搜索结果中提取DOI
   */
  static extractDOIs(results: LiteratureSearchResult): string[] {
    const dois: string[] = [];

    // 从Semantic Scholar结果中提取DOI
    results.semanticScholar.forEach(paper => {
      // Semantic Scholar API通常不直接返回DOI，但可以从URL中提取
      if (paper.url) {
        const doiMatch = paper.url.match(/doi\/(10\.[^\/]+\/[^\/]+)/);
        if (doiMatch) {
          dois.push(doiMatch[1]);
        }
      }
    });

    return dois;
  }

  /**
   * 按引用数排序结果
   */
  static sortByCitations(results: LiteratureSearchResult): LiteratureSearchResult {
    return {
      ...results,
      semanticScholar: [...results.semanticScholar].sort((a, b) => 
        (b.citationCount || 0) - (a.citationCount || 0)
      ),
      arxiv: [...results.arxiv] // arXiv结果没有引用数
    };
  }

  /**
   * 按年份筛选结果
   */
  static filterByYear(results: LiteratureSearchResult, startYear: number, endYear: number): LiteratureSearchResult {
    return {
      ...results,
      semanticScholar: results.semanticScholar.filter(paper => {
        const year = paper.year;
        return year && year >= startYear && year <= endYear;
      }),
      arxiv: results.arxiv.filter(paper => {
        const publishedYear = new Date(paper.published).getFullYear();
        return publishedYear >= startYear && publishedYear <= endYear;
      })
    };
  }

  /**
   * 生成文献综述摘要
   */
  static generateSummary(results: any): string {
    const totalPapers = results.totalResults;
    const semanticScholarCount = results.semanticScholar.length;
    const arxivCount = results.arxiv.length;
    const topCited = results.semanticScholar
      .sort((a: any, b: any) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, 3);

    return `文献检索完成：
- 总检索结果：${totalPapers} 篇
- Semantic Scholar：${semanticScholarCount} 篇
- arXiv：${arxivCount} 篇
- 响应时间：${results.responseTime} ms

高引用论文：
${topCited.map((paper: any, index: number) => 
  `${index + 1}. ${paper.title} (${paper.citationCount || 0} 引用)`
).join('\n')}
`;
  }
}

export { LiteratureRetrieval };
export type { LiteratureSearchOptions, LiteratureSearchResult, ZoteroItem };