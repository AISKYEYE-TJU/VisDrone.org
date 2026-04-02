import type {
  NewsItem,
  Dataset,
  Model,
  Paper,
  TeamMember,
  Patent,
  Award,
  SeminarEvent,
  Partner,
} from './types';

export interface DbPatent {
  id: string;
  inventors: string;
  title: string;
  patent_no: string;
  date: string;
  pdf_url?: string;
}

export interface DbAward {
  id: string;
  title: string;
  winners: string;
  year: number;
  pdf_url?: string;
}

export interface DbPaper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'conference' | 'journal';
  doi?: string;
  pdf_url?: string;
}

export interface DbNews {
  id: string;
  title: string;
  url: string;
  date: string;
  excerpt: string;
  image?: string;
  category: string;
  content?: string;
}

export interface DbDataset {
  id: string;
  name: string;
  full_name: string;
  description: string;
  category: string;
  paper_title: string;
  paper_venue: string;
  paper_year: number;
  authors?: string[];
  features: unknown[];
  stats: unknown;
  github?: string;
  github_info?: unknown;
  image?: string;
}

export interface DbModel {
  id: string;
  name: string;
  full_name: string;
  description: string;
  task: string;
  paper_title: string;
  paper_venue: string;
  paper_year: number;
  paper_url?: string;
  features: unknown[];
  github?: string;
  stars: number;
  forks: number;
  image?: string;
  low_altitude_tags?: string[];
}

export interface DbTeamMember {
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

export interface DbPartner {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  display_order: number;
}

export function mapDbToPatent(db: DbPatent): Patent {
  return {
    id: db.id,
    title: db.title,
    inventors: db.inventors ? db.inventors.split('，') : [],
    number: db.patent_no,
    date: db.date,
    type: '发明',
    pdf_url: db.pdf_url,
  };
}

export function mapDbToAward(db: DbAward): Award {
  return {
    id: db.id,
    title: db.title,
    authors: db.winners ? db.winners.split('，') : [],
    venue: '',
    date: db.year?.toString() || '',
    pdf_url: db.pdf_url,
  };
}

export function mapDbToNews(db: DbNews): NewsItem {
  return {
    id: db.id,
    title: db.title,
    url: db.url,
    date: db.date,
    excerpt: db.excerpt,
    image: db.image,
    category: db.category,
    content: db.content,
  };
}

export function mapDbToDataset(db: DbDataset): Dataset {
  return {
    id: db.id,
    name: db.name,
    full_name: db.full_name,
    description: db.description,
    category: db.category,
    paper_title: db.paper_title,
    paper_venue: db.paper_venue,
    paper_year: db.paper_year,
    authors: Array.isArray(db.authors) ? db.authors : [],
    features: Array.isArray(db.features) ? db.features as string[] : [],
    stats: (db.stats as Dataset['stats']) || {},
    github: db.github,
    github_info: (db.github_info as Dataset['github_info']) || undefined,
    image: db.image || undefined,
  };
}

export function mapDbToModel(db: DbModel): Model {
  return {
    id: db.id,
    name: db.name,
    full_name: db.full_name,
    description: db.description,
    task: db.task,
    paper_title: db.paper_title,
    paper_venue: db.paper_venue,
    paper_year: db.paper_year,
    paper_url: db.paper_url,
    features: Array.isArray(db.features) ? db.features as string[] : [],
    github: db.github,
    stars: db.stars,
    forks: db.forks,
    image: db.image || undefined,
    low_altitude_tags: Array.isArray(db.low_altitude_tags) ? db.low_altitude_tags as string[] : [],
  };
}

export function mapDbToPaper(db: DbPaper): Paper {
  return {
    id: db.id,
    title: db.title,
    authors: Array.isArray(db.authors) ? db.authors : [],
    venue: db.venue,
    year: db.year,
    type: db.type,
    doi: db.doi,
    pdf_url: db.pdf_url,
    code_url: db.code_url,
    github: db.github,
  };
}

export function mapDbToTeamMember(db: DbTeamMember): TeamMember {
  return {
    id: db.id,
    name: db.name,
    name_en: db.name_en,
    role: db.role,
    roles: Array.isArray(db.roles) ? db.roles : (db.role ? [db.role] : []),
    title: db.title,
    year: db.year,
    image: db.image,
    bio: db.bio,
    research_interests: Array.isArray(db.research_interests) ? db.research_interests : undefined,
    email: db.email,
    homepage: db.homepage,
  };
}

export function mapDbToPartner(db: DbPartner): Partner {
  return {
    id: db.id,
    name: db.name,
    logo_url: db.logo_url,
    website: db.website,
    description: db.description,
    display_order: db.display_order,
  };
}

export function mapDbToSeminarEvent(db: unknown): SeminarEvent {
  const d = db as Record<string, unknown>;
  return {
    id: d.id as string,
    title: d.title as string,
    date: d.date as string,
    speaker: d.speaker as string | undefined,
    abstract: d.abstract as string | undefined,
    ppt_url: d.ppt_url as string | undefined,
    paper_url: d.paper_url as string | undefined,
    video_url: d.video_url as string | undefined,
    type: (d.type as SeminarEvent['type']) || 'seminar',
    group: d.group as SeminarEvent['group'],
  };
}
