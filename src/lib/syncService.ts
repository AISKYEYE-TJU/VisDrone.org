import { supabase } from '@/config/supabase';
import localDatabase from './localDatabase';

class SyncService {
  private isSyncing = false;

  async syncAll(): Promise<{ success: boolean; message: string }> {
    if (this.isSyncing) {
      return { success: false, message: '同步已在进行中' };
    }

    this.isSyncing = true;
    const results: string[] = [];
    const errors: string[] = [];

    try {
      results.push('开始同步数据...');

      await this.syncTable('news', async () => {
        const { data, error } = await supabase.from('visdrone_news').select('*').order('date', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('news');
        await localDatabase.put('news', data || []);
        return data?.length || 0;
      }, results, errors);

      await this.syncTable('datasets', async () => {
        const { data, error } = await supabase.from('visdrone_datasets').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('datasets');
        await localDatabase.put('datasets', data || []);
        return data?.length || 0;
      }, results, errors);

      await this.syncTable('models', async () => {
        const { data, error } = await supabase.from('visdrone_models').select('*').order('stars', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('models');
        await localDatabase.put('models', data || []);
        return data?.length || 0;
      }, results, errors);

      await this.syncTable('papers', async () => {
        const { data, error } = await supabase.from('visdrone_papers').select('*').order('year', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('papers');
        await localDatabase.put('papers', data || []);
        return data?.length || 0;
      }, results, errors);

      await this.syncTable('patents', async () => {
        const { data, error } = await supabase.from('visdrone_patents').select('*').order('date', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('patents');
        await localDatabase.put('patents', data || []);
        return data?.length || 0;
      }, results, errors);

      await this.syncTable('awards', async () => {
        const { data, error } = await supabase.from('visdrone_awards').select('*').order('date', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('awards');
        await localDatabase.put('awards', data || []);
        return data?.length || 0;
      }, results, errors);

      await this.syncTable('team', async () => {
        const { data, error } = await supabase.from('visdrone_team').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        await localDatabase.clear('team');
        await localDatabase.put('team', data || []);
        return data?.length || 0;
      }, results, errors);

      if (errors.length > 0) {
        return { success: false, message: `同步完成但有错误: ${errors.join(', ')}` };
      }

      return { success: true, message: `同步成功！\n${results.join('\n')}` };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, message: `同步失败: ${error}` };
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncTable(
    tableName: string,
    fetchFn: () => Promise<number>,
    results: string[],
    errors: string[]
  ): Promise<void> {
    try {
      const count = await fetchFn();
      await localDatabase.setLastSync(tableName, new Date().toISOString());
      results.push(`✓ ${tableName}: ${count} 条记录`);
    } catch (error) {
      errors.push(`${tableName}: ${error}`);
      results.push(`✗ ${tableName}: 同步失败`);
    }
  }

  async getSyncStatus(): Promise<Record<string, string | null>> {
    const tables = ['news', 'datasets', 'models', 'papers', 'patents', 'awards', 'team'];
    const status: Record<string, string | null> = {};
    for (const table of tables) {
      status[table] = await localDatabase.getLastSync(table);
    }
    return status;
  }
}

export const syncService = new SyncService();
export default syncService;
