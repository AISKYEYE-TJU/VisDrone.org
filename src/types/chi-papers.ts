// CHI论文知识库数据类型定义

// 论文元数据
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  abstract: string;
  keywords: string[];
  venue: string;
  pdfPath: string;
  metadataPath: string;
  createdAt: Date;
  updatedAt: Date;
}

// 分类标签
export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  level: number;
  papers: string[]; // 论文ID列表
}

// 人机协同领域子领域
export interface HCDomain {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  papers: string[];
}

// 知识库索引
export interface KnowledgeBaseIndex {
  papers: Record<string, Paper>;
  categories: Record<string, Category>;
  hcDomains: Record<string, HCDomain>;
  authorIndex: Record<string, string[]>; // 作者 -> 论文ID列表
  keywordIndex: Record<string, string[]>; // 关键词 -> 论文ID列表
  yearIndex: Record<string, string[]>; // 年份 -> 论文ID列表
  searchIndex: Record<string, string[]>; // 搜索关键词 -> 论文ID列表
}

// 检索结果
export interface SearchResult {
  papers: Paper[];
  total: number;
  page: number;
  pageSize: number;
  categories?: Category[];
  facets?: {
    years: Record<number, number>;
    categories: Record<string, number>;
    authors: Record<string, number>;
  };
}

// 论文统计信息
export interface PaperStatistics {
  total: number;
  byYear: Record<number, number>;
  byCategory: Record<string, number>;
  byAuthor: Record<string, number>;
  recentPapers: Paper[];
  topAuthors: Array<{ name: string; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
}
