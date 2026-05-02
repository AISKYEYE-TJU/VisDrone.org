import { supabase } from '@/config/supabase';

export interface SiteStats {
  totalUsers: number;
  totalAgents: number;
  totalModels: number;
  totalTasks: number;
}

const defaultStats: SiteStats = {
  totalUsers: 10520,
  totalAgents: 28,
  totalModels: 58,
  totalTasks: 1250000
};

export const statsService = {
  async getSiteStats(): Promise<SiteStats> {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .single();

      if (error || !data) {
        return defaultStats;
      }

      return {
        totalUsers: data.total_users || defaultStats.totalUsers,
        totalAgents: data.total_agents || defaultStats.totalAgents,
        totalModels: data.total_models || defaultStats.totalModels,
        totalTasks: data.total_tasks || defaultStats.totalTasks
      };
    } catch (error) {
      console.log('使用默认统计数据');
      return defaultStats;
    }
  },

  async updateStats(stats: Partial<SiteStats>): Promise<void> {
    try {
      const { error } = await supabase
        .from('site_stats')
        .upsert({
          id: 'main',
          ...stats,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('更新统计失败:', error);
    }
  },

  async incrementTaskCount(): Promise<void> {
    await this.updateStats({
      totalTasks: defaultStats.totalTasks + 1
    });
  }
};
