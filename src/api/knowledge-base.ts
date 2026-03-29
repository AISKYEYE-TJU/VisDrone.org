import { KnowledgeBaseService } from '../services/knowledge-base';
import { SearchResult, Paper, PaperStatistics } from '../types/chi-papers';

// 知识库API服务
export class KnowledgeBaseApi {
  private kbService: KnowledgeBaseService;

  constructor() {
    this.kbService = new KnowledgeBaseService();
  }

  // 初始化知识库
  async initialize() {
    await this.kbService.loadKnowledgeBase();
    console.log('知识库API初始化完成');
  }

  // 搜索论文
  async search(query: string, options?: {
    year?: number;
    category?: string;
    author?: string;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResult> {
    try {
      await this.initialize();
      return this.kbService.searchPapers(query, options);
    } catch (error) {
      console.error('搜索失败:', error);
      return { papers: [], total: 0, page: 1, pageSize: 10 };
    }
  }

  // 获取论文详情
  async getPaper(id: string): Promise<Paper | null> {
    try {
      await this.initialize();
      return this.kbService.getPaperById(id);
    } catch (error) {
      console.error('获取论文详情失败:', error);
      return null;
    }
  }

  // 获取所有论文
  async getAllPapers(options?: {
    page?: number;
    pageSize?: number;
    sortBy?: 'year' | 'title' | 'author';
    sortOrder?: 'asc' | 'desc';
  }): Promise<SearchResult> {
    try {
      await this.initialize();
      const papers = this.kbService.getAllPapers();
      
      // 排序
      if (options?.sortBy) {
        papers.sort((a, b) => {
          let comparison = 0;
          switch (options.sortBy) {
            case 'year':
              comparison = a.year - b.year;
              break;
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'author':
              comparison = a.authors[0].localeCompare(b.authors[0]);
              break;
          }
          return options.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // 分页
      const page = options?.page || 1;
      const pageSize = options?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedPapers = papers.slice(start, end);

      return {
        papers: paginatedPapers,
        total: papers.length,
        page,
        pageSize
      };
    } catch (error) {
      console.error('获取所有论文失败:', error);
      return { papers: [], total: 0, page: 1, pageSize: 10 };
    }
  }

  // 获取统计信息
  async getStatistics(): Promise<PaperStatistics> {
    try {
      await this.initialize();
      return this.kbService.getStatistics();
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return {
        total: 0,
        byYear: {},
        byCategory: {},
        byAuthor: {},
        recentPapers: [],
        topAuthors: [],
        topKeywords: []
      };
    }
  }

  // 按年份获取论文
  async getPapersByYear(year: number): Promise<Paper[]> {
    try {
      await this.initialize();
      const papers = this.kbService.getAllPapers();
      return papers.filter(paper => paper.year === year);
    } catch (error) {
      console.error('按年份获取论文失败:', error);
      return [];
    }
  }

  // 按作者获取论文
  async getPapersByAuthor(author: string): Promise<Paper[]> {
    try {
      await this.initialize();
      const papers = this.kbService.getAllPapers();
      return papers.filter(paper => 
        paper.authors.some(a => a.toLowerCase().includes(author.toLowerCase()))
      );
    } catch (error) {
      console.error('按作者获取论文失败:', error);
      return [];
    }
  }

  // 按关键词获取论文
  async getPapersByKeyword(keyword: string): Promise<Paper[]> {
    try {
      await this.initialize();
      const papers = this.kbService.getAllPapers();
      return papers.filter(paper => 
        paper.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
      );
    } catch (error) {
      console.error('按关键词获取论文失败:', error);
      return [];
    }
  }

  // 添加论文到知识库
  async addPaper(paper: Paper): Promise<boolean> {
    try {
      await this.initialize();
      await this.kbService.addPaper(paper);
      return true;
    } catch (error) {
      console.error('添加论文失败:', error);
      return false;
    }
  }

  // 批量添加论文
  async addPapers(papers: Paper[]): Promise<{ success: number; failed: number }> {
    try {
      await this.initialize();
      let success = 0;
      let failed = 0;

      for (const paper of papers) {
        const result = await this.addPaper(paper);
        if (result) {
          success++;
        } else {
          failed++;
        }
      }

      return { success, failed };
    } catch (error) {
      console.error('批量添加论文失败:', error);
      return { success: 0, failed: papers.length };
    }
  }

  // 高级搜索
  async advancedSearch(params: {
    title?: string;
    abstract?: string;
    authors?: string[];
    keywords?: string[];
    yearFrom?: number;
    yearTo?: number;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResult> {
    try {
      await this.initialize();
      const allPapers = this.kbService.getAllPapers();

      // 过滤论文
      let filteredPapers = allPapers;

      if (params.title) {
        filteredPapers = filteredPapers.filter(paper => 
          paper.title.toLowerCase().includes(params.title!.toLowerCase())
        );
      }

      if (params.abstract) {
        filteredPapers = filteredPapers.filter(paper => 
          paper.abstract.toLowerCase().includes(params.abstract!.toLowerCase())
        );
      }

      if (params.authors && params.authors.length > 0) {
        filteredPapers = filteredPapers.filter(paper => 
          params.authors!.some(author => 
            paper.authors.some(paperAuthor => 
              paperAuthor.toLowerCase().includes(author.toLowerCase())
            )
          )
        );
      }

      if (params.keywords && params.keywords.length > 0) {
        filteredPapers = filteredPapers.filter(paper => 
          params.keywords!.some(keyword => 
            paper.keywords.some(paperKeyword => 
              paperKeyword.toLowerCase().includes(keyword.toLowerCase())
            )
          )
        );
      }

      if (params.yearFrom) {
        filteredPapers = filteredPapers.filter(paper => paper.year >= params.yearFrom!);
      }

      if (params.yearTo) {
        filteredPapers = filteredPapers.filter(paper => paper.year <= params.yearTo!);
      }

      // 分页
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedPapers = filteredPapers.slice(start, end);

      return {
        papers: paginatedPapers,
        total: filteredPapers.length,
        page,
        pageSize
      };
    } catch (error) {
      console.error('高级搜索失败:', error);
      return { papers: [], total: 0, page: 1, pageSize: 10 };
    }
  }
}
