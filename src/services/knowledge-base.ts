import fs from 'fs';
import path from 'path';
import { Paper, Category, HCDomain, KnowledgeBaseIndex, SearchResult, PaperStatistics } from '../types/chi-papers';
import { CHI_PAPERS_CONFIG } from '../config/chi-papers';

// 知识库管理服务
export class KnowledgeBaseService {
  private indexPath = 'chi-papers/knowledge-base-index.json';
  private index: KnowledgeBaseIndex | null = null;

  // 加载知识库
  async loadKnowledgeBase() {
    try {
      if (fs.existsSync(this.indexPath)) {
        const data = fs.readFileSync(this.indexPath, 'utf8');
        this.index = JSON.parse(data);
        console.log('知识库加载成功');
      } else {
        this.index = this.createEmptyIndex();
        await this.saveKnowledgeBase();
        console.log('创建新的知识库索引');
      }
      return this.index;
    } catch (error) {
      console.error('加载知识库失败:', error);
      this.index = this.createEmptyIndex();
      return this.index;
    }
  }

  // 保存知识库
  async saveKnowledgeBase() {
    try {
      if (this.index) {
        fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
        console.log('知识库保存成功');
      }
    } catch (error) {
      console.error('保存知识库失败:', error);
      throw error;
    }
  }

  // 创建空索引
  private createEmptyIndex(): KnowledgeBaseIndex {
    return {
      papers: {},
      categories: {},
      hcDomains: {},
      authorIndex: {},
      keywordIndex: {},
      yearIndex: {},
      searchIndex: {}
    };
  }

  // 添加论文到知识库
  async addPaper(paper: Paper) {
    if (!this.index) {
      await this.loadKnowledgeBase();
    }

    if (this.index) {
      // 添加论文
      this.index.papers[paper.id] = paper;

      // 更新作者索引
      paper.authors.forEach(author => {
        if (!this.index?.authorIndex[author]) {
          this.index.authorIndex[author] = [];
        }
        if (!this.index.authorIndex[author].includes(paper.id)) {
          this.index.authorIndex[author].push(paper.id);
        }
      });

      // 更新关键词索引
      paper.keywords.forEach(keyword => {
        if (!this.index?.keywordIndex[keyword]) {
          this.index.keywordIndex[keyword] = [];
        }
        if (!this.index.keywordIndex[keyword].includes(paper.id)) {
          this.index.keywordIndex[keyword].push(paper.id);
        }
      });

      // 更新年份索引
      const yearKey = paper.year.toString();
      if (!this.index.yearIndex[yearKey]) {
        this.index.yearIndex[yearKey] = [];
      }
      if (!this.index.yearIndex[yearKey].includes(paper.id)) {
        this.index.yearIndex[yearKey].push(paper.id);
      }

      await this.saveKnowledgeBase();
    }
  }

  // 批量添加论文
  async addPapers(papers: Paper[]) {
    for (const paper of papers) {
      await this.addPaper(paper);
    }
  }

  // 搜索论文
  searchPapers(query: string, options?: {
    year?: number;
    category?: string;
    author?: string;
    page?: number;
    pageSize?: number;
  }): SearchResult {
    if (!this.index) {
      return { papers: [], total: 0, page: 1, pageSize: 10 };
    }

    // 基础搜索逻辑
    let matchingPapers: Paper[] = [];
    
    // 简单实现：基于标题和关键词匹配
    Object.values(this.index.papers).forEach(paper => {
      const text = `${paper.title} ${paper.abstract} ${paper.keywords.join(' ')}`;
      if (text.toLowerCase().includes(query.toLowerCase())) {
        matchingPapers.push(paper);
      }
    });

    // 应用过滤条件
    if (options?.year) {
      matchingPapers = matchingPapers.filter(paper => paper.year === options.year);
    }

    // 分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedPapers = matchingPapers.slice(start, end);

    return {
      papers: paginatedPapers,
      total: matchingPapers.length,
      page,
      pageSize
    };
  }

  // 获取统计信息
  getStatistics(): PaperStatistics {
    if (!this.index) {
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

    const papers = Object.values(this.index.papers);
    const total = papers.length;

    // 按年份统计
    const byYear: Record<number, number> = {};
    papers.forEach(paper => {
      byYear[paper.year] = (byYear[paper.year] || 0) + 1;
    });

    // 按作者统计
    const byAuthor: Record<string, number> = {};
    papers.forEach(paper => {
      paper.authors.forEach(author => {
        byAuthor[author] = (byAuthor[author] || 0) + 1;
      });
    });

    // 最近论文
    const recentPapers = papers
      .sort((a, b) => b.year - a.year)
      .slice(0, 10);

    // 顶级作者
    const topAuthors = Object.entries(byAuthor)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 顶级关键词
    const keywordCount: Record<string, number> = {};
    papers.forEach(paper => {
      paper.keywords.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });
    const topKeywords = Object.entries(keywordCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total,
      byYear,
      byCategory: {}, // 需要实现分类统计
      byAuthor,
      recentPapers,
      topAuthors,
      topKeywords
    };
  }

  // 获取所有论文
  getAllPapers(): Paper[] {
    if (!this.index) {
      return [];
    }
    return Object.values(this.index.papers);
  }

  // 根据ID获取论文
  getPaperById(id: string): Paper | null {
    if (!this.index) {
      return null;
    }
    return this.index.papers[id] || null;
  }
}
