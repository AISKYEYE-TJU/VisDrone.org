import { HCDomain, Category, Paper } from '../types/chi-papers';
import { CHI_PAPERS_CONFIG } from '../config/chi-papers';

// 人机协同领域分类服务
export class HCClassificationService {
  private hcDomains: HCDomain[] = [
    {
      id: 'human-ai-collaboration',
      name: '人机协同',
      description: '人类与人工智能系统的协作与交互',
      keywords: [
        'human-ai collaboration',
        'human-agent interaction',
        'collaborative AI',
        'human-centered AI'
      ],
      papers: []
    },
    {
      id: 'mixed-initiative',
      name: '混合主动系统',
      description: '人类和计算机共同控制的系统',
      keywords: [
        'mixed initiative',
        'shared control',
        'collaborative problem solving'
      ],
      papers: []
    },
    {
      id: 'human-robot-interaction',
      name: '人机交互',
      description: '人类与机器人的交互研究',
      keywords: [
        'human-robot interaction',
        'HRI',
        'robotics',
        'social robots'
      ],
      papers: []
    },
    {
      id: 'augmented-intelligence',
      name: '增强智能',
      description: 'AI增强人类能力的系统',
      keywords: [
        'augmented intelligence',
        'intelligence augmentation',
        'human enhancement'
      ],
      papers: []
    },
    {
      id: 'collaborative-systems',
      name: '协作系统',
      description: '支持多人协作的系统',
      keywords: [
        'collaborative systems',
        'groupware',
        'team collaboration'
      ],
      papers: []
    }
  ];

  private categories: Category[] = [
    {
      id: 'methodology',
      name: '方法论',
      description: '研究方法和评估技术',
      level: 1,
      papers: []
    },
    {
      id: 'system-design',
      name: '系统设计',
      description: '系统架构和设计原则',
      level: 1,
      papers: []
    },
    {
      id: 'user-study',
      name: '用户研究',
      description: '用户行为和需求研究',
      level: 1,
      papers: []
    },
    {
      id: 'application',
      name: '应用案例',
      description: '实际应用和案例研究',
      level: 1,
      papers: []
    }
  ];

  // 获取所有人机协同领域
  getHCDomains(): HCDomain[] {
    return this.hcDomains;
  }

  // 获取所有分类
  getCategories(): Category[] {
    return this.categories;
  }

  // 对论文进行领域分类
  classifyPaper(paper: Paper): {
    domains: string[];
    categories: string[];
    confidence: number;
  } {
    const domains: string[] = [];
    const categories: string[] = [];
    let totalScore = 0;

    // 领域分类
    this.hcDomains.forEach(domain => {
      let score = 0;
      const text = `${paper.title} ${paper.abstract} ${paper.keywords.join(' ')}`.toLowerCase();
      
      domain.keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      if (score > 0) {
        domains.push(domain.id);
        totalScore += score;
      }
    });

    // 分类标签
    // 简单的规则分类
    const abstract = paper.abstract.toLowerCase();
    if (abstract.includes('method') || abstract.includes('evaluation')) {
      categories.push('methodology');
    }
    if (abstract.includes('design') || abstract.includes('architecture')) {
      categories.push('system-design');
    }
    if (abstract.includes('user study') || abstract.includes('experiment')) {
      categories.push('user-study');
    }
    if (abstract.includes('application') || abstract.includes('case study')) {
      categories.push('application');
    }

    // 计算置信度
    const confidence = domains.length > 0 ? (totalScore / (domains.length * 3)) : 0;

    return {
      domains,
      categories,
      confidence: Math.min(confidence, 1)
    };
  }

  // 批量分类论文
  classifyPapers(papers: Paper[]): Map<string, {
    domains: string[];
    categories: string[];
    confidence: number;
  }> {
    const results = new Map<string, {
      domains: string[];
      categories: string[];
      confidence: number;
    }>();

    papers.forEach(paper => {
      const classification = this.classifyPaper(paper);
      results.set(paper.id, classification);
    });

    return results;
  }

  // 获取领域统计
  getDomainStatistics(papers: Paper[]): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.hcDomains.forEach(domain => {
      stats[domain.name] = 0;
    });

    papers.forEach(paper => {
      const classification = this.classifyPaper(paper);
      classification.domains.forEach(domainId => {
        const domain = this.hcDomains.find(d => d.id === domainId);
        if (domain) {
          stats[domain.name] = (stats[domain.name] || 0) + 1;
        }
      });
    });

    return stats;
  }

  // 获取分类统计
  getCategoryStatistics(papers: Paper[]): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.categories.forEach(category => {
      stats[category.name] = 0;
    });

    papers.forEach(paper => {
      const classification = this.classifyPaper(paper);
      classification.categories.forEach(categoryId => {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          stats[category.name] = (stats[category.name] || 0) + 1;
        }
      });
    });

    return stats;
  }

  // 添加自定义领域
  addHCDomain(domain: Omit<HCDomain, 'papers'>): HCDomain {
    const newDomain: HCDomain = {
      ...domain,
      papers: []
    };
    this.hcDomains.push(newDomain);
    return newDomain;
  }

  // 添加自定义分类
  addCategory(category: Omit<Category, 'papers'>): Category {
    const newCategory: Category = {
      ...category,
      papers: []
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  // 搜索领域
  searchDomains(query: string): HCDomain[] {
    const lowerQuery = query.toLowerCase();
    return this.hcDomains.filter(domain => 
      domain.name.toLowerCase().includes(lowerQuery) ||
      domain.description.toLowerCase().includes(lowerQuery) ||
      domain.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  // 搜索分类
  searchCategories(query: string): Category[] {
    const lowerQuery = query.toLowerCase();
    return this.categories.filter(category => 
      category.name.toLowerCase().includes(lowerQuery) ||
      category.description.toLowerCase().includes(lowerQuery)
    );
  }

  // 导出分类体系
  exportClassificationSystem(): {
    domains: HCDomain[];
    categories: Category[];
  } {
    return {
      domains: this.hcDomains,
      categories: this.categories
    };
  }

  // 导入分类体系
  importClassificationSystem(data: {
    domains: HCDomain[];
    categories: Category[];
  }): void {
    if (data.domains) {
      this.hcDomains = data.domains;
    }
    if (data.categories) {
      this.categories = data.categories;
    }
  }
}
