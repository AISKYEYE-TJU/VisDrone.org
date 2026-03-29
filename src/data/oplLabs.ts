// OPL 实验室数据结构定义和示例数据

export interface TeamMember {
  id: string;
  name: string;
  role: 'PI' | 'human_student' | 'agent_student';
  avatar?: string;
  title?: string;
  research?: string;
  email?: string;
  publications?: number;
  projects?: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  link?: string;
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  members: string[];
  funding?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'dataset' | 'model' | 'agent';
  description: string;
  link?: string;
  downloads?: number;
}

export interface OPLLab {
  id: string;
  name: string;
  discipline: string;
  description: string;
  coverImage: string;
  avatar: string;
  members: number;
  projectCount: number;
  paperCount: number;
  // 详细内容
  pi: TeamMember;
  humanStudents: TeamMember[];
  agentStudents: TeamMember[];
  publications: Paper[];
  researchProjects: Project[];
  resources: Resource[];
  meetingSystem?: {
    enabled: boolean;
    schedule: string;
    nextMeeting?: string;
  };
}

// AI 视觉实验室数据
export const aiVisionLab: OPLLab = {
  id: 'ai-vision',
  name: 'AI 视觉实验室',
  discipline: '人工智能',
  description: '专注于计算机视觉和图像处理研究，包括目标检测、图像分割、视频理解等前沿方向',
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=computer%20vision%20laboratory%2C%20AI%20research%20setting%2C%20neural%20networks%20visualization%2C%20image%20processing%20displays%2C%20modern%20tech%20environment%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20setting&image_size=landscape_16_9',
  avatar: 'AI',
  members: 12,
  projectCount: 8,
  paperCount: 15,
  pi: {
    id: 'pi-ai-vision',
    name: '张华教授',
    role: 'PI',
    title: '教授，博士生导师',
    research: '计算机视觉、深度学习、医学影像分析',
    email: 'zhanghua@example.edu.cn',
    publications: 120,
    projects: 15
  },
  humanStudents: [
    {
      id: 'hs-001',
      name: '李明',
      role: 'human_student',
      title: '博士研究生',
      research: '目标检测与跟踪',
      email: 'liming@example.edu.cn',
      publications: 8,
      projects: 3
    },
    {
      id: 'hs-002',
      name: '王芳',
      role: 'human_student',
      title: '硕士研究生',
      research: '图像分割',
      email: 'wangfang@example.edu.cn',
      publications: 4,
      projects: 2
    },
    {
      id: 'hs-003',
      name: '刘强',
      role: 'human_student',
      title: '博士研究生',
      research: '视频理解',
      email: 'liuqiang@example.edu.cn',
      publications: 6,
      projects: 4
    }
  ],
  agentStudents: [
    {
      id: 'as-001',
      name: 'VisionBot',
      role: 'agent_student',
      avatar: '🤖',
      title: '视觉分析智能体',
      research: '自动化图像分析和标注',
      publications: 12,
      projects: 5
    },
    {
      id: 'as-002',
      name: 'ImageMind',
      role: 'agent_student',
      avatar: '🧠',
      title: '图像理解智能体',
      research: '图像语义理解和推理',
      publications: 8,
      projects: 3
    },
    {
      id: 'as-003',
      name: 'DetectronX',
      role: 'agent_student',
      avatar: '🔍',
      title: '目标检测智能体',
      research: '高精度目标检测和跟踪',
      publications: 10,
      projects: 4
    },
    {
      id: 'as-004',
      name: 'SegmentMaster',
      role: 'agent_student',
      avatar: '✂️',
      title: '图像分割智能体',
      research: '语义分割和实例分割',
      publications: 9,
      projects: 3
    },
    {
      id: 'as-005',
      name: 'VideoAI',
      role: 'agent_student',
      avatar: '🎬',
      title: '视频分析智能体',
      research: '视频理解和动作识别',
      publications: 11,
      projects: 4
    }
  ],
  publications: [
    {
      id: 'paper-001',
      title: 'Multi-Scale Object Detection in Complex Scenes',
      authors: ['Li, M.', 'Zhang, H.', 'et al.'],
      venue: 'CVPR 2024',
      year: 2024,
      link: '#',
      category: '目标检测'
    },
    {
      id: 'paper-002',
      title: 'Semantic Segmentation using Attention Mechanisms',
      authors: ['Wang, F.', 'Zhang, H.', 'et al.'],
      venue: 'ICCV 2023',
      year: 2023,
      link: '#',
      category: '图像分割'
    },
    {
      id: 'paper-003',
      title: 'Video Understanding with Temporal Transformers',
      authors: ['Liu, Q.', 'Zhang, H.', 'et al.'],
      venue: 'NeurIPS 2023',
      year: 2023,
      link: '#',
      category: '视频理解'
    }
  ],
  researchProjects: [
    {
      id: 'proj-001',
      name: '智能监控系统研发',
      description: '开发基于深度学习的智能视频监控系统',
      status: 'ongoing',
      startDate: '2024-01',
      endDate: '2026-12',
      members: ['李明', 'VisionBot'],
      funding: '国家自然科学基金'
    },
    {
      id: 'proj-002',
      name: '医学影像分析平台',
      description: '构建 AI 辅助的医学影像诊断平台',
      status: 'ongoing',
      startDate: '2023-06',
      endDate: '2025-06',
      members: ['王芳', 'ImageMind'],
      funding: '科技部重点研发计划'
    }
  ],
  resources: [
    {
      id: 'res-001',
      name: 'COCO 数据集增强版',
      type: 'dataset',
      description: '包含 10 万张标注图像的物体检测数据集',
      link: '#',
      downloads: 5000
    },
    {
      id: 'res-002',
      name: 'VisionTransformer 预训练模型',
      type: 'model',
      description: '在大规模数据集上预训练的 ViT 模型',
      link: '#',
      downloads: 3200
    },
    {
      id: 'res-003',
      name: '自动标注智能体',
      type: 'agent',
      description: '用于图像自动标注的智能体系统',
      link: '#',
      downloads: 1500
    }
  ],
  meetingSystem: {
    enabled: true,
    schedule: '每周三 14:00-16:00',
    nextMeeting: '2026-03-05 14:00'
  }
};

// 自然语言处理实验室
export const nlpLab: OPLLab = {
  id: 'nlp',
  name: '自然语言处理组',
  discipline: '人工智能',
  description: '研究自然语言理解和生成技术，包括大语言模型、对话系统、机器翻译等方向',
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=natural%20language%20processing%20laboratory%2C%20AI%20research%20setting%2C%20text%20analysis%20visualization%2C%20language%20models%20displays%2C%20modern%20tech%20environment%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20setting&image_size=landscape_16_9',
  avatar: 'NL',
  members: 8,
  projectCount: 5,
  paperCount: 12,
  pi: {
    id: 'pi-nlp',
    name: '陈静教授',
    role: 'PI',
    title: '教授，博士生导师',
    research: '自然语言处理、大语言模型、对话系统',
    email: 'chenjing@example.edu.cn',
    publications: 95,
    projects: 12
  },
  humanStudents: [
    {
      id: 'hs-nlp-001',
      name: '赵伟',
      role: 'human_student',
      title: '博士研究生',
      research: '大语言模型对齐',
      email: 'zhaowei@example.edu.cn',
      publications: 7,
      projects: 2
    },
    {
      id: 'hs-nlp-002',
      name: '孙丽',
      role: 'human_student',
      title: '硕士研究生',
      research: '机器翻译',
      email: 'sunli@example.edu.cn',
      publications: 3,
      projects: 1
    }
  ],
  agentStudents: [
    {
      id: 'as-nlp-001',
      name: 'TextBot',
      role: 'agent_student',
      avatar: '📝',
      title: '文本分析智能体',
      research: '自动化文本分析和摘要',
      publications: 10,
      projects: 4
    },
    {
      id: 'as-nlp-002',
      name: 'ChatAgent',
      role: 'agent_student',
      avatar: '💬',
      title: '对话系统智能体',
      research: '多轮对话理解和生成',
      publications: 9,
      projects: 3
    },
    {
      id: 'as-nlp-003',
      name: 'TranslateAI',
      role: 'agent_student',
      avatar: '🌐',
      title: '机器翻译智能体',
      research: '多语言机器翻译',
      publications: 8,
      projects: 3
    },
    {
      id: 'as-nlp-004',
      name: 'Summarizer',
      role: 'agent_student',
      avatar: '📋',
      title: '文本摘要智能体',
      research: '自动文本摘要生成',
      publications: 11,
      projects: 4
    },
    {
      id: 'as-nlp-005',
      name: 'LLMExpert',
      role: 'agent_student',
      avatar: '🧠',
      title: '大语言模型智能体',
      research: '大语言模型微调与对齐',
      publications: 12,
      projects: 5
    }
  ],
  publications: [
    {
      id: 'paper-nlp-001',
      title: 'Efficient Fine-tuning of Large Language Models',
      authors: ['Zhao, W.', 'Chen, J.', 'et al.'],
      venue: 'ACL 2024',
      year: 2024,
      link: '#',
      category: '大语言模型'
    },
    {
      id: 'paper-nlp-002',
      title: 'Neural Machine Translation with Context Awareness',
      authors: ['Sun, L.', 'Chen, J.', 'et al.'],
      venue: 'EMNLP 2023',
      year: 2023,
      link: '#',
      category: '机器翻译'
    }
  ],
  researchProjects: [
    {
      id: 'proj-nlp-001',
      name: '智能对话系统',
      description: '开发多轮对话理解和生成系统',
      status: 'ongoing',
      startDate: '2024-03',
      endDate: '2026-03',
      members: ['赵伟', 'TextBot'],
      funding: '企业横向合作'
    }
  ],
  resources: [
    {
      id: 'res-nlp-001',
      name: '中文对话语料库',
      type: 'dataset',
      description: '包含 100 万轮中文对话的高质量语料库',
      link: '#',
      downloads: 4200
    },
    {
      id: 'res-nlp-002',
      name: 'LLM 微调工具包',
      type: 'model',
      description: '大语言模型高效微调工具集',
      link: '#',
      downloads: 2800
    }
  ],
  meetingSystem: {
    enabled: true,
    schedule: '每周五 10:00-12:00',
    nextMeeting: '2026-03-07 10:00'
  }
};

// 计算生物学实验室
export const compBioLab: OPLLab = {
  id: 'comp-bio',
  name: '计算生物学实验室',
  discipline: '生物医学',
  description: '利用计算方法研究生物学问题，包括基因组学、蛋白质结构预测、药物设计等方向',
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=computational%20biology%20laboratory%2C%20DNA%20sequencing%20visualization%2C%20protein%20structure%20models%2C%20bioinformatics%20research%20setting%2C%20modern%20lab%20environment%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20setting&image_size=landscape_16_9',
  avatar: 'CB',
  members: 15,
  projectCount: 10,
  paperCount: 20,
  pi: {
    id: 'pi-bio',
    name: '吴明教授',
    role: 'PI',
    title: '教授，博士生导师',
    research: '计算生物学、基因组学、蛋白质组学',
    email: 'wuming@example.edu.cn',
    publications: 150,
    projects: 18
  },
  humanStudents: [
    {
      id: 'hs-bio-001',
      name: '郑雪',
      role: 'human_student',
      title: '博士研究生',
      research: '蛋白质结构预测',
      email: 'zhengxue@example.edu.cn',
      publications: 9,
      projects: 4
    },
    {
      id: 'hs-bio-002',
      name: '钱峰',
      role: 'human_student',
      title: '博士研究生',
      research: '基因组数据分析',
      email: 'qianfeng@example.edu.cn',
      publications: 7,
      projects: 3
    }
  ],
  agentStudents: [
    {
      id: 'as-bio-001',
      name: 'BioBot',
      role: 'agent_student',
      avatar: '🧬',
      title: '生物信息分析智能体',
      research: '自动化基因组数据分析',
      publications: 15,
      projects: 6
    },
    {
      id: 'as-bio-002',
      name: 'ProteinFold',
      role: 'agent_student',
      avatar: '🔬',
      title: '蛋白质结构预测智能体',
      research: '蛋白质三维结构预测',
      publications: 14,
      projects: 5
    },
    {
      id: 'as-bio-003',
      name: 'GeneAI',
      role: 'agent_student',
      avatar: '🧪',
      title: '基因组分析智能体',
      research: '基因表达和调控分析',
      publications: 12,
      projects: 4
    },
    {
      id: 'as-bio-004',
      name: 'DrugDesign',
      role: 'agent_student',
      avatar: '💊',
      title: '药物设计智能体',
      research: '基于AI的药物分子设计',
      publications: 13,
      projects: 5
    },
    {
      id: 'as-bio-005',
      name: 'CellSim',
      role: 'agent_student',
      avatar: '🫀',
      title: '细胞模拟智能体',
      research: '细胞行为和信号通路模拟',
      publications: 11,
      projects: 4
    }
  ],
  publications: [
    {
      id: 'paper-bio-001',
      title: 'Deep Learning for Protein Structure Prediction',
      authors: ['Zheng, X.', 'Wu, M.', 'et al.'],
      venue: 'Nature Methods 2024',
      year: 2024,
      link: '#',
      category: '蛋白质结构'
    }
  ],
  researchProjects: [
    {
      id: 'proj-bio-001',
      name: '蛋白质折叠预测',
      description: '开发高精度的蛋白质三维结构预测系统',
      status: 'ongoing',
      startDate: '2023-01',
      endDate: '2025-12',
      members: ['郑雪', 'BioBot'],
      funding: '国家重点研发计划'
    }
  ],
  resources: [
    {
      id: 'res-bio-001',
      name: '人类基因组数据集',
      type: 'dataset',
      description: '大规模人类基因组测序数据',
      link: '#',
      downloads: 6500
    }
  ],
  meetingSystem: {
    enabled: true,
    schedule: '每周二 15:00-17:00',
    nextMeeting: '2026-03-04 15:00'
  }
};

// 机器人实验室
export const roboticsLab: OPLLab = {
  id: 'robotics',
  name: '机器人实验室',
  discipline: '工程学',
  description: '设计和开发智能机器人系统，包括机器人感知、控制、人机协作等方向',
  coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=robotics%20laboratory%2C%20intelligent%20robot%20systems%2C%20robot%20arms%20and%20sensors%2C%20automation%20research%20setting%2C%20modern%20engineering%20lab%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20professional%20setting&image_size=landscape_16_9',
  avatar: 'RB',
  members: 14,
  projectCount: 9,
  paperCount: 17,
  pi: {
    id: 'pi-robotics',
    name: '黄志强教授',
    role: 'PI',
    title: '教授，博士生导师',
    research: '机器人学、自动控制、人机协作',
    email: 'huangzhiqiang@example.edu.cn',
    publications: 130,
    projects: 16
  },
  humanStudents: [
    {
      id: 'hs-rob-001',
      name: '周杰',
      role: 'human_student',
      title: '博士研究生',
      research: '机器人视觉伺服',
      email: 'zhoujie@example.edu.cn',
      publications: 8,
      projects: 3
    }
  ],
  agentStudents: [
    {
      id: 'as-rob-001',
      name: 'RoboBot',
      role: 'agent_student',
      avatar: '🦾',
      title: '机器人控制智能体',
      research: '机器人运动规划和控制',
      publications: 11,
      projects: 5
    },
    {
      id: 'as-rob-002',
      name: 'VisionNav',
      role: 'agent_student',
      avatar: '👁️',
      title: '机器人视觉导航智能体',
      research: '视觉 SLAM 和自主导航',
      publications: 10,
      projects: 4
    },
    {
      id: 'as-rob-003',
      name: 'ManipulatorAI',
      role: 'agent_student',
      avatar: '🤖',
      title: '机械臂控制智能体',
      research: '机器人抓取和操作',
      publications: 9,
      projects: 3
    },
    {
      id: 'as-rob-004',
      name: 'HRIExpert',
      role: 'agent_student',
      avatar: '🤝',
      title: '人机交互智能体',
      research: '人机协作和交互',
      publications: 12,
      projects: 5
    },
    {
      id: 'as-rob-005',
      name: 'SimRobot',
      role: 'agent_student',
      avatar: '🔧',
      title: '机器人仿真智能体',
      research: '机器人仿真和训练',
      publications: 8,
      projects: 3
    }
  ],
  publications: [
    {
      id: 'paper-rob-001',
      title: 'Visual Servoing for Robotic Manipulation',
      authors: ['Zhou, J.', 'Huang, Z.', 'et al.'],
      venue: 'ICRA 2024',
      year: 2024,
      link: '#',
      category: '机器人控制'
    }
  ],
  researchProjects: [
    {
      id: 'proj-rob-001',
      name: '智能手术机器人',
      description: '开发用于微创手术的智能机器人辅助系统',
      status: 'ongoing',
      startDate: '2024-01',
      endDate: '2027-01',
      members: ['周杰', 'RoboBot'],
      funding: '国家自然科学基金重点项目'
    }
  ],
  resources: [
    {
      id: 'res-rob-001',
      name: '机器人仿真环境',
      type: 'model',
      description: '基于物理的机器人仿真和训练平台',
      link: '#',
      downloads: 3800
    }
  ],
  meetingSystem: {
    enabled: true,
    schedule: '每周四 14:00-16:00',
    nextMeeting: '2026-03-06 14:00'
  }
};

// 导出所有实验室列表
export const oplLabs: OPLLab[] = [
  aiVisionLab,
  nlpLab,
  compBioLab,
  roboticsLab
];

// 按学科分类的实验室
export const labsByDiscipline = {
  '人工智能': [aiVisionLab, nlpLab],
  '生物医学': [compBioLab],
  '物理学': [],
  '工程学': [roboticsLab]
};
