export const ROUTE_PATHS = {
  HOME: '/',
  ABOUT: '/about',
  RESEARCH: '/research',
  TEAM: '/team',
  PUBLICATIONS: '/publications',
  EDUCATION: '/education',
  POPULAR_SCIENCE: '/popular-science',
  JOIN: '/join',
  MULTI_AGENT: '/multi-agent',
  ACADEMIC_SKILLS: '/academic-skills',
  AI4RESEARCH: '/ai4research',
  AI4DESIGN_RESEARCH: '/ai4design-research',
  AUTO_SOTA: '/autosota-info',
  LOGIN: '/login',
  ADMIN: '/admin',
} as const;

export type MemberRole = 'PI' | 'Professor' | 'PhD' | 'Master' | 'Alumni' | 'Staff';

export interface TeamMember {
  id: string;
  name: string;
  nameEn?: string;
  role: MemberRole;
  title: string;
  image: string;
  bio: string;
  researchInterests: string[];
  email?: string;
  phone?: string;
  website?: string;
  github?: string;
  scholar?: string;
}

export type ProjectStatus = '进行中' | '已完成';

export interface ResearchProject {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  image: string;
  tags: string[];
  status: ProjectStatus;
  year: string;
  link?: string;
}

export type PublicationType = '期刊论文' | '会议论文' | '专著' | '教材' | '专利' | '报告';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: PublicationType;
  link?: string;
  doi?: string;
  isSelected?: boolean;
}

export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === 'string') return input.split(' ');
      return Object.entries(input)
        .filter(([_, value]) => value)
        .map(([key]) => key);
    })
    .join(' ');
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export const LAB_INFO = {
  name: '人机协同设计实验室',
  nameEn: 'Human-AI Collaborative Design Lab',
  institution: '人机协同设计实验室',
  location: '中国',
  contactEmail: 'zhaotianjiao@seu.edu.cn',
  principal: '赵天娇',
};