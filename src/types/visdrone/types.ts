import type {
  NewsCategory,
  PaperType,
  PatentType,
  TeamRole,
  DatasetCategory,
  ModelTask,
  SeminarGroup,
  SeminarType,
} from './constants';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  date: string;
  excerpt: string;
  image?: string;
  category: NewsCategory | string;
  content?: string;
}

export interface Dataset {
  id: string;
  name: string;
  full_name: string;
  description: string;
  category: DatasetCategory | string;
  paper_title: string;
  paper_venue: string;
  paper_year: number;
  authors?: string[];
  features: string[];
  stats: DatasetStats;
  github?: string;
  stars?: number;
  github_info?: GithubInfo;
}

export interface DatasetStats {
  images?: string;
  videos?: string;
  annotations?: string;
  categories?: number;
}

export interface GithubInfo {
  description?: string;
  stars?: number;
  forks?: number;
  license?: string;
}

export interface Model {
  id: string;
  name: string;
  full_name: string;
  description: string;
  task: ModelTask | string;
  paper_title: string;
  paper_venue: string;
  paper_year: number;
  paper_url?: string;
  features: string[];
  github?: string;
  stars?: number;
  forks?: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: PaperType;
  doi?: string;
  pdf_url?: string;
  code_url?: string;
  github?: string;
  citations?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  name_en?: string;
  role?: string;
  roles: string[];
  title: string;
  year?: string;
  image?: string;
  bio: string;
  research_interests?: string[];
  email?: string;
  homepage?: string;
}

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  number: string;
  date: string;
  type: PatentType;
  pdf_url?: string;
}

export interface Award {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  pdf_url?: string;
}

export interface SeminarEvent {
  id: string;
  title: string;
  date: string;
  speaker?: string;
  abstract?: string;
  ppt_url?: string;
  paper_url?: string;
  video_url?: string;
  type: SeminarType;
  group?: SeminarGroup;
}

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  display_order: number;
}

export interface VisDroneStats {
  datasets: number;
  papers: number;
  patents: number;
  awards: number;
}
