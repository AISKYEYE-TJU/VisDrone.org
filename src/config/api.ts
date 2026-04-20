export const API_CONFIG = {
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: 'sk-8c277633f58644eab6f4fe91f2d8e53f',
  model: 'qwen3.5-flash-2026-02-23',
  maxTokens: 4000,
  timeout: 180000,
  maxRetries: 3,
  retryDelay: 2000
};

// 阿里云 Qwen3.5 系列模型配置
// 免费额度：每个模型 1,000,000 tokens，用完即停（返回403错误）
export const QWEN35_MODELS = {
  // 轻量级模型 - 适合简单任务、快速响应
  'qwen3.5-flash-2026-02-23': {
    name: 'Qwen3.5 Flash (最新)',
    description: '轻量级模型，响应速度快，适合简单对话和快速查询',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 1, // 优先级：1为最高
    useCase: ['简单对话', '快速查询', '文本摘要', '轻量级任务']
  },
  // 中等模型 - 适合一般任务
  'qwen3.5-plus-2026-02-15': {
    name: 'Qwen3.5 Plus (最新)',
    description: '平衡型模型，性能和速度兼顾，适合大多数任务',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 2,
    useCase: ['一般对话', '内容生成', '代码辅助', '数据分析']
  },
  'qwen3.5-plus': {
    name: 'Qwen3.5 Plus',
    description: '标准版 Plus 模型',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 3,
    useCase: ['一般任务', '多轮对话', '文档处理']
  },
  // 大参数模型 - 适合复杂任务
  'qwen3.5-35b-a3b': {
    name: 'Qwen3.5 35B',
    description: '350亿参数模型，适合复杂推理和创作任务',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 4,
    useCase: ['复杂推理', '创意写作', '代码生成', '多步骤任务']
  },
  'qwen3.5-27b': {
    name: 'Qwen3.5 27B',
    description: '270亿参数模型，性能与效率平衡',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 5,
    useCase: ['中等复杂度任务', '技术文档', '代码审查']
  },
  // 超大模型 - 适合高难度任务
  'qwen3.5-122b-a10b': {
    name: 'Qwen3.5 122B',
    description: '1220亿参数模型，强大的推理和创作能力',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 6,
    useCase: ['高难度推理', '学术研究', '复杂代码项目', '创意策划']
  },
  'qwen3.5-397b-a17b': {
    name: 'Qwen3.5 397B',
    description: '3970亿参数模型，顶级性能，适合最复杂的任务',
    contextWindow: 128000,
    maxTokens: 8192,
    priority: 7,
    useCase: ['顶级推理', '科学研究', '大规模代码项目', '高级创意任务']
  }
};

// 模型使用策略
export const MODEL_STRATEGY = {
  // 默认模型（优先级最高且轻量）
  defaultModel: 'qwen3.5-flash-2026-02-23',
  
  // 模型切换策略：当当前模型返回403错误时，按优先级切换到下一个模型
  fallbackChain: [
    'qwen3.5-flash-2026-02-23',
    'qwen3.5-plus-2026-02-15',
    'qwen3.5-plus',
    'qwen3.5-35b-a3b',
    'qwen3.5-27b',
    'qwen3.5-122b-a10b',
    'qwen3.5-397b-a17b'
  ],
  
  // 任务类型推荐模型
  taskModels: {
    // 轻量级任务 - 快速响应
    '简单对话': 'qwen3.5-flash-2026-02-23',
    '快速查询': 'qwen3.5-flash-2026-02-23',
    
    // 中等任务 - 平衡性能
    '一般任务': 'qwen3.5-plus-2026-02-15',
    '组会讨论': 'qwen3.5-plus-2026-02-15',
    '日常交流': 'qwen3.5-plus',
    
    // 代码和复杂任务
    '代码生成': 'qwen3.5-35b-a3b',
    '技术实现': 'qwen3.5-35b-a3b',
    
    // 高级推理任务 - 大参数模型
    '复杂推理': 'qwen3.5-122b-a10b',
    '学术研究': 'qwen3.5-397b-a17b',
    '科研自动化': 'qwen3.5-397b-a17b',
    '群智创新': 'qwen3.5-397b-a17b',
    
    // 虚拟智能体对话 - 轻量级模型
    '虚拟智能体': 'qwen3.5-flash-2026-02-23',
    '团队成员对话': 'qwen3.5-flash-2026-02-23'
  },
  
  // 场景化模型配置
  scenarios: {
    // AI4Research 自动化科研系统 - 需要高级推理
    ai4research: {
      default: 'qwen3.5-397b-a17b',
      fallback: ['qwen3.5-122b-a10b', 'qwen3.5-35b-a3b', 'qwen3.5-plus-2026-02-15'],
      description: '自动化科研系统，需要深度推理和学术能力'
    },
    
    // 群智创新 - 轻量级模型，快速响应
    swarmInnovation: {
      default: 'qwen3.5-flash-2026-02-23',
      fallback: ['qwen3.5-plus-2026-02-15', 'qwen3.5-plus', 'qwen3.5-35b-a3b'],
      description: '群智创新设计，使用轻量级模型保证快速响应'
    },
    
    // 组会讨论 - 轻量级，快速响应
    groupMeeting: {
      default: 'qwen3.5-flash-2026-02-23',
      fallback: ['qwen3.5-plus-2026-02-15', 'qwen3.5-plus', 'qwen3.5-35b-a3b'],
      description: '组会讨论场景，需要快速响应和流畅交互'
    },
    
    // 虚拟智能体对话 - 轻量级模型
    virtualAgent: {
      default: 'qwen3.5-flash-2026-02-23',
      fallback: ['qwen3.5-plus-2026-02-15', 'qwen3.5-plus', 'qwen3.5-35b-a3b'],
      description: '与团队成员虚拟智能体对话，使用轻量级模型保证快速响应'
    },
    
    // 通用对话 - 默认轻量级
    general: {
      default: 'qwen3.5-flash-2026-02-23',
      fallback: ['qwen3.5-plus-2026-02-15', 'qwen3.5-plus', 'qwen3.5-35b-a3b'],
      description: '通用对话场景，优先使用轻量级模型'
    }
  }
};

export const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1';

export const ARXIV_API = 'https://export.arxiv.org/api/query';

export const DATA_SOURCES = {
  semanticScholar: {
    name: 'Semantic Scholar',
    description: '2亿+学术论文数据库，由Allen AI研究所提供',
    baseUrl: SEMANTIC_SCHOLAR_API,
    enabled: true
  },
  arxiv: {
    name: 'arXiv',
    description: '开放获取的预印本论文库，涵盖物理、数学、计算机科学等',
    baseUrl: ARXIV_API,
    enabled: true
  }
};

export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  published: string;
  updated: string;
  link: string;
  pdfLink: string;
  categories: string[];
  primaryCategory: string;
}

export interface Author {
  name: string;
  authorId?: string;
  affiliation?: string[];
}

export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  authors: Author[];
  year: number | null;
  abstract: string;
  venue: string;
  citationCount: number;
  referenceCount: number;
  influentialCitationCount: number;
  isOpenAccess: boolean;
  openAccessPdf?: string;
  url: string;
  tldr?: string;
  publicationDate?: string;
  journal?: string;
}

// 智能模型选择器
export function selectModelForTask(taskType: string): string {
  return MODEL_STRATEGY.taskModels[taskType] || MODEL_STRATEGY.defaultModel;
}

// 获取下一个备用模型
export function getFallbackModel(currentModel: string): string | null {
  const currentIndex = MODEL_STRATEGY.fallbackChain.indexOf(currentModel);
  if (currentIndex < MODEL_STRATEGY.fallbackChain.length - 1) {
    return MODEL_STRATEGY.fallbackChain[currentIndex + 1];
  }
  return null;
}

export const searchArxiv = async (query: string, maxResults: number = 20): Promise<ArxivPaper[]> => {
  try {
    console.log('开始 arXiv 搜索:', query);
    
    // 优化搜索策略：处理长查询和中文查询
    let optimizedQuery = query;
    if (optimizedQuery.length > 100) {
      optimizedQuery = optimizedQuery.substring(0, 100);
      console.log('优化 arXiv 查询（长度限制）:', optimizedQuery);
    }
    
    // 尝试不同的搜索字段
    const searchFields = ['all', 'ti', 'abs', 'au'];
    let papers: ArxivPaper[] = [];
    
    for (const field of searchFields) {
      const searchUrl = `${ARXIV_API}?search_query=${field}:${encodeURIComponent(optimizedQuery)}&max_results=${Math.min(maxResults, 10)}&sortBy=relevance&sortOrder=descending`;
      console.log('arXiv 搜索 URL:', searchUrl);
      
      try {
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        console.log('arXiv API 响应状态:', response.status);
        
        if (!response.ok) {
          console.error('arXiv API 错误:', response.status, await response.text());
          continue;
        }
        
        const xmlText = await response.text();
        console.log('arXiv API 响应长度:', xmlText.length);
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const entries = xmlDoc.querySelectorAll('entry');
        
        for (const entry of entries) {
          const paper: ArxivPaper = {
            id: entry.querySelector('id')?.textContent || '',
            title: entry.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() || '',
            authors: Array.from(entry.querySelectorAll('author name')).map(a => a.textContent || ''),
            summary: entry.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim() || '',
            published: entry.querySelector('published')?.textContent || '',
            updated: entry.querySelector('updated')?.textContent || '',
            link: entry.querySelector('id')?.textContent || '',
            pdfLink: entry.querySelector('link[title="pdf"]')?.getAttribute('href') || '',
            categories: Array.from(entry.querySelectorAll('category')).map(c => c.getAttribute('term') || ''),
            primaryCategory: entry.querySelector('category')?.getAttribute('term') || ''
          };
          
          papers.push(paper);
          
          if (papers.length >= maxResults) {
            break;
          }
        }
        
        if (papers.length > 0) {
          break;
        }
      } catch (error) {
        console.error(`arXiv 搜索字段 ${field} 出错:`, error);
        continue;
      }
    }
    
    console.log(`arXiv 搜索完成，找到 ${papers.length} 篇论文`);
    return papers;
  } catch (error) {
    console.error('arXiv 搜索失败:', error);
    return [];
  }
};

export const searchSemanticScholar = async (query: string, maxResults: number = 20): Promise<SemanticScholarPaper[]> => {
  try {
    console.log('开始 Semantic Scholar 搜索:', query);
    
    const searchUrl = `${SEMANTIC_SCHOLAR_API}/paper/search?query=${encodeURIComponent(query)}&limit=${maxResults}&fields=title,authors,year,abstract,venue,citationCount,referenceCount,influentialCitationCount,isOpenAccess,openAccessPdf,url,tldr,publicationDate,journal`;
    console.log('Semantic Scholar 搜索 URL:', searchUrl);
    
    const response = await fetch(searchUrl);
    console.log('Semantic Scholar API 响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API 错误: ${response.status}`);
    }
    
    const data = await response.json();
    const papers: SemanticScholarPaper[] = (data.data || []).map((item: any) => ({
      paperId: item.paperId,
      title: item.title,
      authors: item.authors?.map((a: any) => ({
        name: a.name,
        authorId: a.authorId,
        affiliation: a.affiliation
      })) || [],
      year: item.year,
      abstract: item.abstract,
      venue: item.venue,
      citationCount: item.citationCount,
      referenceCount: item.referenceCount,
      influentialCitationCount: item.influentialCitationCount,
      isOpenAccess: item.isOpenAccess,
      openAccessPdf: item.openAccessPdf,
      url: item.url,
      tldr: item.tldr?.text,
      publicationDate: item.publicationDate,
      journal: item.journal
    }));
    
    console.log(`Semantic Scholar 搜索完成，找到 ${papers.length} 篇论文`);
    return papers;
  } catch (error) {
    console.error('Semantic Scholar 搜索失败:', error);
    return [];
  }
};

// LLM 调用函数
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 根据场景获取推荐的模型
 * @param scenario 场景名称
 * @returns 推荐的模型名称
 */
export function getModelForScenario(scenario: keyof typeof MODEL_STRATEGY.scenarios | string): string {
  const scenarioConfig = MODEL_STRATEGY.scenarios[scenario as keyof typeof MODEL_STRATEGY.scenarios];
  if (scenarioConfig) {
    return scenarioConfig.default;
  }
  // 如果没有匹配的场景，尝试从 taskModels 中查找
  const taskModel = MODEL_STRATEGY.taskModels[scenario as keyof typeof MODEL_STRATEGY.taskModels];
  if (taskModel) {
    return taskModel;
  }
  // 返回默认模型
  return MODEL_STRATEGY.defaultModel;
}

/**
 * 获取场景的回退模型列表
 * @param scenario 场景名称
 * @returns 回退模型列表
 */
export function getFallbackModelsForScenario(scenario: keyof typeof MODEL_STRATEGY.scenarios | string): string[] {
  const scenarioConfig = MODEL_STRATEGY.scenarios[scenario as keyof typeof MODEL_STRATEGY.scenarios];
  if (scenarioConfig) {
    return scenarioConfig.fallback;
  }
  // 返回全局回退链
  return MODEL_STRATEGY.fallbackChain;
}

/**
 * 调用 LLM API
 * @param messages 消息数组
 * @param model 模型名称（可选，默认使用 API_CONFIG.model）
 * @returns LLM 响应
 */
export const callLLM = async (
  messages: LLMMessage[],
  model?: string
): Promise<LLMResponse> => {
  const currentModel = model || API_CONFIG.model;
  
  try {
    console.log(`调用 LLM API，模型: ${currentModel}`);
    
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: currentModel,
        messages: messages,
        max_tokens: API_CONFIG.maxTokens,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API 请求失败: ${response.status}`
      );
    }

    const data = await response.json();
    
    return {
      content: data.choices?.[0]?.message?.content || '',
      model: data.model || currentModel,
      usage: data.usage
    };
  } catch (error) {
    console.error('LLM API 调用失败:', error);
    throw error;
  }
};
