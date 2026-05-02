import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zpzwefrxckbojbotjxof.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export interface Lab {
  id: string;
  name: string;
  discipline: string;
  description: string;
  cover_image: string;
  avatar: string;
  members: number;
  project_count: number;
  paper_count: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  lab_id: string;
  name: string;
  role: 'PI' | 'human_student' | 'agent_student';
  avatar?: string;
  title?: string;
  research?: string;
  email?: string;
  publications?: number;
  projects?: number;
  created_at: string;
  updated_at: string;
}

export interface Paper {
  id: string;
  lab_id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  link?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  lab_id: string;
  name: string;
  description: string;
  status: 'ongoing' | 'completed';
  start_date: string;
  end_date?: string;
  members: string[];
  funding?: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  lab_id: string;
  name: string;
  type: 'dataset' | 'model' | 'agent';
  description: string;
  link?: string;
  downloads?: number;
  created_at: string;
  updated_at: string;
}

export interface MeetingSystem {
  id: string;
  lab_id: string;
  enabled: boolean;
  schedule: string;
  next_meeting?: string;
  created_at: string;
  updated_at: string;
}
