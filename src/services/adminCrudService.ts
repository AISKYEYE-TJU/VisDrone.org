import { supabase } from '@/config/supabase';
import { toast } from 'sonner';
import type {
  NewsItem,
  Dataset,
  Model,
  Paper,
  TeamMember,
  Patent,
  Award,
} from '@/types/visdrone';
import {
  mapDbToNews,
  mapDbToDataset,
  mapDbToModel,
  mapDbToPaper,
  mapDbToTeamMember,
  mapDbToPatent,
  mapDbToAward,
} from '@/types/visdrone/fieldMapper';
import type { DbNews, DbDataset, DbModel, DbPaper, DbTeamMember, DbPatent, DbAward } from '@/types/visdrone/fieldMapper';
import { githubFileService } from './githubFileService';

// 模块映射
const TABLE_TO_MODULE: Record<string, string> = {
  visdrone_news: 'news',
  visdrone_datasets: 'datasets',
  visdrone_models: 'models',
  visdrone_papers: 'papers',
  visdrone_patents: 'patents',
  visdrone_awards: 'awards',
  visdrone_team: 'team',
};

export class AdminCrudService {
  private tableName: string;
  private moduleName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.moduleName = TABLE_TO_MODULE[tableName] || tableName;
  }

  private async syncToGitHub(): Promise<void> {
    if (!githubFileService.getConfig()) return;

    try {
      const { data } = await supabase.from(this.tableName).select('*');
      if (data) {
        await githubFileService.saveModuleData(
          this.moduleName,
          data,
          `Admin: 更新 ${this.moduleName} 数据 via Admin`
        );
      }
    } catch (err) {
      console.warn(`Failed to sync ${this.moduleName} to GitHub:`, err);
    }
  }

  async getAll<T>(mapper: (db: unknown) => T): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapper);
    } catch (err) {
      console.error(`Error fetching ${this.tableName}:`, err);
      toast.error(`获取数据失败: ${this.tableName}`);
      return [];
    }
  }

  async getById<T>(id: string, mapper: (db: unknown) => T): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapper(data) : null;
    } catch (err) {
      console.error(`Error fetching ${this.tableName}/${id}:`, err);
      return null;
    }
  }

  async create<T extends Record<string, unknown>>(item: T): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      toast.success('创建成功');
      await this.syncToGitHub();
      return { success: true, id: data.id };
    } catch (err) {
      console.error(`Error creating ${this.tableName}:`, err);
      const message = err instanceof Error ? err.message : '创建失败';
      toast.error(message);
      return { success: false, error: message };
    }
  }

  async update<T extends Record<string, unknown>>(id: string, item: Partial<T>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('更新成功');
      await this.syncToGitHub();
      return { success: true };
    } catch (err) {
      console.error(`Error updating ${this.tableName}/${id}:`, err);
      const message = err instanceof Error ? err.message : '更新失败';
      toast.error(message);
      return { success: false, error: message };
    }
  }

  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('删除成功');
      await this.syncToGitHub();
      return { success: true };
    } catch (err) {
      console.error(`Error deleting ${this.tableName}/${id}:`, err);
      const message = err instanceof Error ? err.message : '删除失败';
      toast.error(message);
      return { success: false, error: message };
    }
  }

  async batchCreate<T extends Record<string, unknown>>(items: T[]): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .insert(items);

      if (error) throw error;
      toast.success(`批量创建成功: ${items.length} 条`);
      await this.syncToGitHub();
      return { success: true, count: items.length };
    } catch (err) {
      console.error(`Error batch creating ${this.tableName}:`, err);
      const message = err instanceof Error ? err.message : '批量创建失败';
      toast.error(message);
      return { success: false, error: message };
    }
  }
}

export const newsService = new AdminCrudService('visdrone_news');
export const datasetsService = new AdminCrudService('visdrone_datasets');
export const modelsService = new AdminCrudService('visdrone_models');
export const papersService = new AdminCrudService('visdrone_papers');
export const patentsService = new AdminCrudService('visdrone_patents');
export const awardsService = new AdminCrudService('visdrone_awards');
const teamService = new AdminCrudService('visdrone_team');
const seminarsService = new AdminCrudService('visdrone_seminars');

export async function fetchAllNews(): Promise<NewsItem[]> {
  const news = await newsService.getAll(mapDbToNews);
  return news.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  return newsService.getById(id, mapDbToNews);
}

export async function createNews(item: Partial<DbNews>): Promise<{ success: boolean; id?: string }> {
  return newsService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updateNews(id: string, item: Partial<DbNews>): Promise<{ success: boolean }> {
  return newsService.update(id, item);
}

export async function deleteNews(id: string): Promise<{ success: boolean }> {
  return newsService.delete(id);
}

export async function fetchAllDatasets(): Promise<Dataset[]> {
  return datasetsService.getAll(mapDbToDataset);
}

export async function fetchDatasetById(id: string): Promise<Dataset | null> {
  return datasetsService.getById(id, mapDbToDataset);
}

export async function createDataset(item: Partial<DbDataset>): Promise<{ success: boolean; id?: string }> {
  return datasetsService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updateDataset(id: string, item: Partial<DbDataset>): Promise<{ success: boolean }> {
  return datasetsService.update(id, item);
}

export async function deleteDataset(id: string): Promise<{ success: boolean }> {
  return datasetsService.delete(id);
}

export async function fetchAllModels(): Promise<Model[]> {
  return modelsService.getAll(mapDbToModel);
}

export async function fetchModelById(id: string): Promise<Model | null> {
  return modelsService.getById(id, mapDbToModel);
}

export async function createModel(item: Partial<DbModel>): Promise<{ success: boolean; id?: string }> {
  return modelsService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updateModel(id: string, item: Partial<DbModel>): Promise<{ success: boolean }> {
  return modelsService.update(id, item);
}

export async function deleteModel(id: string): Promise<{ success: boolean }> {
  return modelsService.delete(id);
}

export async function fetchAllPapers(): Promise<Paper[]> {
  return papersService.getAll(mapDbToPaper);
}

export async function fetchPaperById(id: string): Promise<Paper | null> {
  return papersService.getById(id, mapDbToPaper);
}

export async function createPaper(item: Partial<DbPaper>): Promise<{ success: boolean; id?: string }> {
  return papersService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updatePaper(id: string, item: Partial<DbPaper>): Promise<{ success: boolean }> {
  return papersService.update(id, item);
}

export async function deletePaper(id: string): Promise<{ success: boolean }> {
  return papersService.delete(id);
}

export async function fetchAllPatents(): Promise<Patent[]> {
  return patentsService.getAll(mapDbToPatent);
}

export async function fetchPatentById(id: string): Promise<Patent | null> {
  return patentsService.getById(id, mapDbToPatent);
}

export async function createPatent(item: Partial<DbPatent>): Promise<{ success: boolean; id?: string }> {
  return patentsService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updatePatent(id: string, item: Partial<DbPatent>): Promise<{ success: boolean }> {
  return patentsService.update(id, item);
}

export async function deletePatent(id: string): Promise<{ success: boolean }> {
  return patentsService.delete(id);
}

export async function fetchAllAwards(): Promise<Award[]> {
  return awardsService.getAll(mapDbToAward);
}

export async function fetchAwardById(id: string): Promise<Award | null> {
  return awardsService.getById(id, mapDbToAward);
}

export async function createAward(item: Partial<DbAward>): Promise<{ success: boolean; id?: string }> {
  return awardsService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updateAward(id: string, item: Partial<DbAward>): Promise<{ success: boolean }> {
  return awardsService.update(id, item);
}

export async function deleteAward(id: string): Promise<{ success: boolean }> {
  return awardsService.delete(id);
}

export async function fetchAllTeamMembers(): Promise<TeamMember[]> {
  return teamService.getAll(mapDbToTeamMember);
}

export async function fetchTeamMemberById(id: string): Promise<TeamMember | null> {
  return teamService.getById(id, mapDbToTeamMember);
}

export async function createTeamMember(item: Partial<DbTeamMember>): Promise<{ success: boolean; id?: string }> {
  return teamService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updateTeamMember(id: string, item: Partial<DbTeamMember>): Promise<{ success: boolean }> {
  return teamService.update(id, item);
}

export async function deleteTeamMember(id: string): Promise<{ success: boolean }> {
  return teamService.delete(id);
}

export async function syncTeamMembersToDatabase(members: TeamMember[]): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const dbMembers = members.map(m => ({
      id: m.id,
      name: m.name,
      name_en: m.name_en,
      role: m.role || null,
      roles: m.roles || (m.role ? [m.role] : []),
      title: m.title,
      year: m.year,
      bio: m.bio,
      image: m.image,
      email: m.email,
      homepage: m.homepage,
      research_interests: m.research_interests,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('visdrone_team')
      .upsert(dbMembers, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: members.length };
  } catch (err) {
    console.error('Error syncing team members:', err);
    const message = err instanceof Error ? err.message : '同步失败';
    return { success: false, error: message };
  }
}

export async function clearTeamMembersDatabase(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('visdrone_team')
      .delete()
      .neq('id', '');

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error clearing team members:', err);
    const message = err instanceof Error ? err.message : '清理失败';
    return { success: false, error: message };
  }
}

export interface DbSeminar {
  id: string;
  title: string;
  date: string;
  speaker?: string;
  abstract?: string;
  ppt_url?: string;
  paper_url?: string;
  video_url?: string;
  type: 'group_meeting' | 'invited_talk' | 'workshop';
  group?: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchAllSeminars(): Promise<DbSeminar[]> {
  return seminarsService.getAll((db) => db as DbSeminar);
}

export async function fetchSeminarById(id: string): Promise<DbSeminar | null> {
  return seminarsService.getById(id, (db) => db as DbSeminar);
}

export async function createSeminar(item: Partial<DbSeminar>): Promise<{ success: boolean; id?: string }> {
  return seminarsService.create({
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function updateSeminar(id: string, item: Partial<DbSeminar>): Promise<{ success: boolean }> {
  return seminarsService.update(id, item);
}

export async function deleteSeminar(id: string): Promise<{ success: boolean }> {
  return seminarsService.delete(id);
}
