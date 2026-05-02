import React from 'react';
import {
  BookOpen, ExternalLink, Github, Building2,
  Users, Calendar, Tag, Globe, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface AgentReference {
  name: string;
  description: string;
  longDescription: string;
  source: {
    organization: string;
    github?: string;
    paper?: string;
    website?: string;
    year?: number;
  };
  methodology: string[];
  suitableDomains: string[];
  limitations: string[];
  citations?: string;
}

interface AgentReferenceCardProps {
  reference: AgentReference;
  compact?: boolean;
}

const agentReferences: Record<string, AgentReference> = {
  'ai-scientist': {
    name: 'AI Scientist',
    description: '端到端自动化科研系统',
    longDescription: 'AI Scientist 是由 SakanaAI 开发的自动化科学研究系统，能够从想法发现到论文完成的全流程自动化。系统包含想法生成、文献调研、实验设计、论文撰写、同行评审和论文修订等完整流程。',
    source: {
      organization: 'SakanaAI',
      github: 'https://github.com/SakanaAI/AI-Scientist',
      paper: 'https://arxiv.org/abs/2408.06292',
      year: 2024
    },
    methodology: [
      '想法发现：基于文献分析自动生成创新研究想法',
      '文献调研：集成 Semantic Scholar 和 arXiv 进行文献检索',
      '实验设计：自动设计实验方案和代码框架',
      '论文撰写：按照学术规范自动撰写论文',
      '同行评审：模拟审稿人进行论文评审',
      '迭代修订：根据评审意见自动修订论文'
    ],
    suitableDomains: [
      '机器学习研究',
      '计算机科学',
      '人工智能应用研究',
      '算法优化研究'
    ],
    limitations: [
      '需要人工审核实验结果',
      '生成的代码需要调试',
      '创新性依赖训练数据',
      '需要验证实验可行性'
    ],
    citations: 'Lu, C., et al. (2024). The AI Scientist: Automated Scientific Discovery. arXiv:2408.06292.'
  },
  'gpt-researcher': {
    name: 'GPT Researcher',
    description: '多源信息采集与研究报告生成',
    longDescription: 'GPT Researcher 是一个开源的研究助手，能够自动从多个来源采集信息并生成全面的研究报告。支持网页、学术文献、新闻等多种数据源。',
    source: {
      organization: 'Assaf Elovic & Community',
      github: 'https://github.com/assafelovic/gpt-researcher',
      website: 'https://docs.gptr.dev',
      year: 2023
    },
    methodology: [
      '研究规划：自动分析研究问题并制定策略',
      '多源采集：从20+数据源并行采集信息',
      '信息过滤：智能过滤和去重',
      '内容分析：提取关键信息和观点',
      '报告生成：生成结构化研究报告'
    ],
    suitableDomains: [
      '市场研究',
      '竞争分析',
      '文献综述',
      '新闻分析',
      '通用研究'
    ],
    limitations: [
      '需要网络访问',
      '信息准确性需验证',
      '深度分析能力有限',
      '可能遗漏专业领域信息'
    ]
  },
  'autora': {
    name: 'AutoRA',
    description: '自动化科学研究代理',
    longDescription: 'AutoRA (Automated Research Assistant) 是一个用于自动化科学研究的框架，实现了理论生成、实验设计和结果分析的闭环研究流程。',
    source: {
      organization: 'Autonomous Research Organization',
      github: 'https://github.com/autoresearch/autora',
      paper: 'https://arxiv.org/abs/2305.16388',
      website: 'https://autoresearch.github.io/autora/',
      year: 2023
    },
    methodology: [
      'Theorist：自动生成科学理论和假设',
      'Experimentalist：设计验证实验',
      'Experiment Runner：执行实验并收集数据',
      'Analysis：分析结果并反馈优化理论',
      '闭环迭代：持续优化研究过程'
    ],
    suitableDomains: [
      '认知科学',
      '社会心理学',
      '行为经济学',
      '人机交互',
      '学习科学'
    ],
    limitations: [
      '主要适用于行为科学',
      '实验需要实际执行',
      '理论验证需要领域专家',
      '复杂实验设计能力有限'
    ],
    citations: 'Huang, K., et al. (2023). AutoRA: Automated Research Assistant. arXiv:2305.16388.'
  },
  'storm': {
    name: 'STORM',
    description: '斯坦福知识策展系统',
    longDescription: 'STORM (Synthesis of Topic Outlines through Retrieval and Multi-perspective question asking) 是斯坦福大学开发的知识策展系统，通过多角度提问生成维基百科式的深度文章。',
    source: {
      organization: 'Stanford University - OVAL',
      github: 'https://github.com/stanford-oval/storm',
      paper: 'https://arxiv.org/abs/2402.14207',
      year: 2024
    },
    methodology: [
      '发现式提问：模拟专家从多角度提问',
      '视角整合：整合理论、方法、实践、前沿等视角',
      '知识合成：将多源信息合成为连贯文章',
      '维基风格：生成结构完整、引用规范的文章'
    ],
    suitableDomains: [
      '知识策展',
      '百科式文章撰写',
      '主题综述',
      '教育内容创作'
    ],
    limitations: [
      '需要大量检索调用',
      '生成时间较长',
      '专业深度有限',
      '引用需人工验证'
    ],
    citations: 'Shao, Y., et al. (2024). STORM: Synthesis of Topic Outlines through Retrieval and Multi-perspective Question Asking. arXiv:2402.14207.'
  },
  'openscholar': {
    name: 'OpenScholar',
    description: 'Allen AI 学术检索增强',
    longDescription: 'OpenScholar 是 Allen AI 研究所开发的学术检索增强系统，结合检索增强生成(RAG)技术，为学术研究提供高质量的信息检索和综合能力。',
    source: {
      organization: 'Allen Institute for AI',
      paper: 'https://arxiv.org/abs/2411.14199',
      website: 'https://allenai.org/',
      year: 2024
    },
    methodology: [
      '语义检索：基于论文语义进行精准检索',
      '引用链构建：自动构建论文引用网络',
      'RAG增强：检索增强生成提高准确性',
      '多文档综合：综合多篇论文信息'
    ],
    suitableDomains: [
      '学术文献综述',
      '研究前沿分析',
      '论文写作辅助',
      '学术研究'
    ],
    limitations: [
      '依赖论文数据库覆盖',
      '最新预印本可能缺失',
      '跨学科检索能力有限',
      '需要专业领域知识验证'
    ]
  },
  'surveyx': {
    name: 'SurveyX',
    description: '学术综述论文生成',
    longDescription: 'SurveyX 是一个学术综述论文生成系统，通过双层语义过滤和结构化写作，自动生成高质量的学术综述论文。',
    source: {
      organization: 'Academic Community',
      year: 2024
    },
    methodology: [
      '论文筛选：双层语义过滤筛选相关论文',
      '结构规划：自动规划综述结构',
      '内容组织：按主题组织论文内容',
      'LaTeX输出：生成规范的LaTeX格式论文'
    ],
    suitableDomains: [
      '学术综述撰写',
      '领域调研报告',
      '研究现状分析'
    ],
    limitations: [
      '需要大量论文输入',
      '创新观点有限',
      '结构可能不够灵活',
      '需要专家审核'
    ]
  },
  'asreview': {
    name: 'ASReview',
    description: '主动学习系统性文献综述',
    longDescription: 'ASReview LAB 是乌得勒支大学开发的主动学习工具，用于高效的系统性文献综述筛选。发表于 Nature Machine Intelligence，被广泛应用于学术研究。',
    source: {
      organization: 'Utrecht University',
      github: 'https://github.com/asreview/asreview',
      paper: 'https://doi.org/10.1038/s42256-020-00287-7',
      website: 'https://asreview.nl/',
      year: 2021
    },
    methodology: [
      '主动学习：AI模型根据标注持续优化',
      '智能排序：优先展示最可能相关的文献',
      '先验知识：利用已知文献加速筛选',
      'ELAS模型：多种预训练模型可选'
    ],
    suitableDomains: [
      '系统性文献综述',
      'Meta分析',
      '大规模文献筛选',
      '循证医学研究'
    ],
    limitations: [
      '需要初始标注',
      '模型可能遗漏边缘文献',
      '需要人工最终确认',
      '领域适应性需调优'
    ],
    citations: 'van de Schoot, R., et al. (2021). An open source machine learning framework for efficient and transparent systematic reviews. Nature Machine Intelligence, 3, 125–133.'
  },
  'chemcrow': {
    name: 'ChemCrow',
    description: '化学任务推理工具',
    longDescription: 'ChemCrow 是一个化学任务推理工具，集成 RDKit、PubChem 等化学工具和数据库，能够解决分子分析、反应预测等化学问题。',
    source: {
      organization: 'University of Rochester',
      github: 'https://github.com/ur-whitelab/chemcrow-public',
      paper: 'https://arxiv.org/abs/2304.05376',
      year: 2023
    },
    methodology: [
      '分子检索：集成 PubChem、RDKit 等数据库',
      '反应预测：预测化学反应产物',
      '性质计算：计算分子物理化学性质',
      '安全评估：生成化学安全注意事项'
    ],
    suitableDomains: [
      '有机化学',
      '药物化学',
      '材料化学',
      '化学教育'
    ],
    limitations: [
      '复杂反应预测准确度有限',
      '需要专业验证',
      '安全建议需人工审核',
      '部分工具需要API密钥'
    ],
    citations: 'Bran, A.M., et al. (2023). ChemCrow: Augmenting large-language models with chemistry tools. arXiv:2304.05376.'
  },
  'literature-review': {
    name: '文献综述智能体',
    description: '深度文献综述系统',
    longDescription: '集成 Semantic Scholar 和 arXiv 数据库的深度文献综述系统，支持真实论文检索、分析和综述生成。',
    source: {
      organization: 'CHILAB',
      github: '',
      year: 2024
    },
    methodology: [
      '多源检索：Semantic Scholar + arXiv',
      '智能筛选：基于相关性排序',
      '主题分析：自动提取研究主题',
      '综述生成：生成结构化综述报告'
    ],
    suitableDomains: [
      '学术研究',
      '文献调研',
      '研究前沿分析',
      '通用学术领域'
    ],
    limitations: [
      '依赖数据库覆盖',
      '深度分析能力有限',
      '需要专家审核'
    ]
  },
  'paperclaw': {
    name: 'PaperClaw',
    description: '三维几何代理模型领域科研助手',
    longDescription: 'PaperClaw 是一个专门用于三维几何代理模型领域的科研助手智能体，提供从检索到评估再到报告生成的完整工作流，帮助研究人员快速了解领域最新进展。',
    source: {
      organization: 'CHILAB',
      github: 'https://github.com/guhaohao0991/PaperClaw',
      year: 2024
    },
    methodology: [
      '自动论文检索：从 arXiv 检索最新相关论文',
      '深度论文总结：回答10个核心问题的专业级总结',
      '多维评估系统：四维评分 + Date-Citation 权衡机制',
      '周报自动生成：每周自动生成精选论文周报',
      '可视化中间过程：实时展示分析过程和结果'
    ],
    suitableDomains: [
      '三维几何代理模型',
      '神经算子学习',
      'PDE求解',
      '科学文献研究'
    ],
    limitations: [
      '领域聚焦于三维几何代理模型',
      '依赖 arXiv 数据库覆盖',
      '分析深度受限于AI模型能力',
      '需要网络连接获取最新文献'
    ]
  }
};

const AgentReferenceCard: React.FC<AgentReferenceCardProps> = ({ reference, compact = false }) => {
  if (compact) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{reference.name}</CardTitle>
            <Badge variant="outline">{reference.source.organization}</Badge>
          </div>
          <CardDescription>{reference.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {reference.suitableDomains.slice(0, 3).map((domain, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{domain}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {reference.name}
            </CardTitle>
            <CardDescription className="mt-1">{reference.description}</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {reference.source.organization}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">详细介绍</h4>
          <p className="text-sm text-muted-foreground">{reference.longDescription}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              来源信息
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span>{reference.source.organization}</span>
              </div>
              {reference.source.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{reference.source.year}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              参考链接
            </h4>
            <div className="flex flex-wrap gap-2">
              {reference.source.github && (
                <a href={reference.source.github} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <Github className="w-3 h-3 mr-1" />
                    GitHub
                  </Button>
                </a>
              )}
              {reference.source.paper && (
                <a href={reference.source.paper} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    论文
                  </Button>
                </a>
              )}
              {reference.source.website && (
                <a href={reference.source.website} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <Globe className="w-3 h-3 mr-1" />
                    网站
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
            <Tag className="w-4 h-4" />
            核心方法论
          </h4>
          <ul className="space-y-1">
            {reference.methodology.map((method, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary font-medium">{i + 1}.</span>
                {method}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm mb-2 text-green-700">适用领域</h4>
            <div className="flex flex-wrap gap-1">
              {reference.suitableDomains.map((domain, i) => (
                <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2 text-amber-700">使用限制</h4>
            <ul className="space-y-1">
              {reference.limitations.map((limitation, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {limitation}</li>
              ))}
            </ul>
          </div>
        </div>

        {reference.citations && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2">引用格式</h4>
              <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono">
                {reference.citations}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { agentReferences, AgentReferenceCard };
export default AgentReferenceCard;
