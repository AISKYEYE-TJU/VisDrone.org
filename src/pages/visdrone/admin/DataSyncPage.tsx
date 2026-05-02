import React, { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Check, AlertCircle, ArrowUpFromLine, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubConfigDialog } from '@/components/admin/AdminComponents';
import { supabase } from '@/config/supabase';
import { allTeamMembers } from '@/data/visdrone/team';
import { news } from '@/data/visdrone/news';
import { datasets } from '@/data/visdrone/datasets';
import { models } from '@/data/visdrone/models';
import { papers } from '@/data/visdrone/papers';
import { patents } from '@/data/visdrone/patents';
import { awards } from '@/data/visdrone/awards';
import { seminars, talks } from '@/data/visdrone/seminars';
import { githubFileService, GitHubConfig } from '@/services/githubFileService';

interface SyncStatus {
  module: string;
  tableName: string;
  tsCount: number;
  dbCount: number;
  status: 'pending' | 'syncing' | 'done' | 'error';
  message?: string;
}

const moduleConfig = [
  { module: 'team', tableName: 'visdrone_team', tsData: allTeamMembers, label: '团队成员' },
  { module: 'news', tableName: 'visdrone_news', tsData: news, label: '新闻' },
  { module: 'datasets', tableName: 'visdrone_datasets', tsData: datasets, label: '数据集' },
  { module: 'models', tableName: 'visdrone_models', tsData: models, label: '模型' },
  { module: 'papers', tableName: 'visdrone_papers', tsData: papers, label: '论文' },
  { module: 'patents', tableName: 'visdrone_patents', tsData: patents, label: '专利' },
  { module: 'awards', tableName: 'visdrone_awards', tsData: awards, label: '获奖' },
  { module: 'seminars', tableName: 'visdrone_seminars', tsData: [...seminars, ...talks], label: '学术活动' },
];

export default function DataSyncPage() {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>(
    moduleConfig.map(cfg => ({
      module: cfg.module,
      tableName: cfg.tableName,
      tsCount: cfg.tsData.length,
      dbCount: 0,
      status: 'pending',
    }))
  );
  const [syncing, setSyncing] = useState(false);
  const [showGithubConfig, setShowGithubConfig] = useState(false);
  const [githubConfig, setGithubConfig] = useState<GitHubConfig | null>(null);

  React.useEffect(() => {
    const saved = githubFileService.getConfig();
    if (saved) {
      setGithubConfig(saved);
    }
  }, []);

  const fetchDbCounts = async () => {
    for (const cfg of moduleConfig) {
      const { count, error } = await supabase
        .from(cfg.tableName)
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        setSyncStatuses(prev => prev.map(s =>
          s.module === cfg.module ? { ...s, dbCount: count } : s
        ));
      }
    }
  };

  React.useEffect(() => {
    fetchDbCounts();
  }, []);

  const syncToDb = async (module: string) => {
    const cfg = moduleConfig.find(c => c.module === module);
    if (!cfg) return;

    if (!confirm(`确定要将 ${cfg.label} 本地数据同步到云端数据库吗？\n\n此操作会覆盖云端数据，请确认已做好备份。`)) {
      return;
    }

    setSyncStatuses(prev => prev.map(s =>
      s.module === module ? { ...s, status: 'syncing' } : s
    ));

    try {
      for (const item of cfg.tsData as Record<string, unknown>[]) {
        const dbItem = transformToDbFormat(module, item);
        const { error } = await supabase
          .from(cfg.tableName)
          .upsert(dbItem, { onConflict: 'id' });

        if (error) {
          console.error(`Error syncing ${module}:`, error);
        }
      }

      setSyncStatuses(prev => prev.map(s =>
        s.module === module ? { ...s, status: 'done', message: '同步成功' } : s
      ));
      toast.success(`${cfg.label} 同步到数据库成功`);
      await fetchDbCounts();
    } catch (err) {
      setSyncStatuses(prev => prev.map(s =>
        s.module === module ? { ...s, status: 'error', message: String(err) } : s
      ));
      toast.error(`${cfg.label} 同步失败`);
    }
  };

  const syncAllToDb = async () => {
    if (!confirm(`确定要将所有模块的本地数据同步到云端数据库吗？\n\n此操作会覆盖云端数据，请确认已做好备份。`)) {
      return;
    }

    setSyncing(true);
    for (const cfg of moduleConfig) {
      await syncToDb(cfg.module);
    }
    setSyncing(false);
    toast.success('全部数据同步到数据库完成');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <ArrowUpFromLine className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleGithubConfigSave = (config: { owner: string; repo: string; branch: string; token: string }) => {
    githubFileService.setConfig(config);
    setGithubConfig(config);
    toast.success('GitHub 配置已保存');
  };

  const handleGithubConfigTest = async (): Promise<{ success: boolean; message: string }> => {
    return githubFileService.testConnection();
  };

  const syncModuleToGithub = async (module: string) => {
    const cfg = moduleConfig.find(c => c.module === module);
    if (!cfg) return;

    setSyncStatuses(prev => prev.map(s =>
      s.module === module ? { ...s, status: 'syncing' } : s
    ));

    try {
      const { data, error } = await supabase.from(cfg.tableName).select('*');
      if (error) throw error;

      await githubFileService.saveModuleData(
        module,
        data || [],
        `Admin: 更新 ${cfg.label} 数据 via Admin`
      );

      setSyncStatuses(prev => prev.map(s =>
        s.module === module ? { ...s, status: 'done', message: 'GitHub 同步成功' } : s
      ));
      toast.success(`${cfg.label} 同步到 GitHub 成功`);
    } catch (err) {
      setSyncStatuses(prev => prev.map(s =>
        s.module === module ? { ...s, status: 'error', message: String(err) } : s
      ));
      toast.error(`${cfg.label} GitHub 同步失败`);
    }
  };

  const syncAllToGithub = async () => {
    if (!githubConfig) {
      toast.error('请先配置 GitHub');
      setShowGithubConfig(true);
      return;
    }

    setSyncing(true);
    for (const cfg of moduleConfig) {
      await syncModuleToGithub(cfg.module);
    }
    setSyncing(false);
    toast.success('全部数据同步到 GitHub 完成');
  };

  const transformToDbFormat = (module: string, item: Record<string, unknown>): Record<string, unknown> => {
    const base = {
      ...item,
      updated_at: new Date().toISOString(),
    };

    switch (module) {
      case 'team':
        return {
          id: item.id,
          name: item.name,
          name_en: item.name_en || null,
          role: item.role || null,
          roles: item.roles || (item.role ? [item.role] : []),
          title: item.title || null,
          year: item.year || null,
          image: item.image || null,
          bio: item.bio || null,
          research_interests: item.research_interests || null,
          email: item.email || null,
          homepage: item.homepage || null,
          updated_at: new Date().toISOString(),
        };
      case 'news':
        return {
          id: item.id,
          title: item.title,
          url: item.url,
          date: item.date,
          excerpt: item.excerpt,
          image: item.image || null,
          category: item.category,
          content: item.content || null,
          updated_at: new Date().toISOString(),
        };
      case 'papers':
        return {
          id: item.id,
          title: item.title,
          authors: item.authors || [],
          venue: item.venue,
          year: item.year,
          type: item.type || 'conference',
          doi: item.doi || null,
          pdf_url: item.pdf_url || item.pdfUrl || null,
          code_url: item.code_url || item.codeUrl || null,
          github: item.github || null,
          citations: item.citations || 0,
          updated_at: new Date().toISOString(),
        };
      case 'patents':
        return {
          id: item.id,
          title: item.title,
          inventors: Array.isArray(item.inventors) ? item.inventors.join('，') : item.inventors || '',
          patent_no: item.number || item.patent_no || '',
          date: item.date,
          pdf_url: item.pdf_url || item.pdfUrl || null,
          updated_at: new Date().toISOString(),
        };
      case 'awards':
        return {
          id: item.id,
          title: item.title,
          winners: Array.isArray(item.authors) ? item.authors.join('，') : (item.authors || item.winners || ''),
          year: parseInt(String(item.date)) || new Date().getFullYear(),
          pdf_url: item.pdf_url || item.pdfUrl || null,
          updated_at: new Date().toISOString(),
        };
      case 'datasets':
        return {
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          description: item.description,
          category: item.category,
          paper_title: item.paper_title,
          paper_venue: item.paper_venue,
          paper_year: item.paper_year,
          features: item.features,
          stats: item.stats,
          github: item.github || null,
          stars: item.stars || 0,
          github_info: item.github_info || null,
          updated_at: new Date().toISOString(),
        };
      case 'models':
        return {
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          description: item.description,
          task: item.task,
          paper_title: (item.paper as Record<string, unknown>)?.title || '',
          paper_venue: (item.paper as Record<string, unknown>)?.venue || '',
          paper_year: (item.paper as Record<string, unknown>)?.year || 0,
          paper_url: (item.paper as Record<string, unknown>)?.url || null,
          features: item.features,
          github: item.github,
          stars: item.stars || 0,
          updated_at: new Date().toISOString(),
        };
      case 'seminars':
        return {
          id: item.id,
          title: item.title,
          date: item.date || null,
          speaker: item.speaker || null,
          abstract: item.abstract || null,
          ppt_url: item.ppt_url || null,
          paper_url: item.paper_url || item.pdf_url || null,
          video_url: item.video_url || null,
          type: item.type || 'group_meeting',
          group: item.group || 'learning',
          updated_at: new Date().toISOString(),
        };
      default:
        return base;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">数据同步</h1>
          <p className="text-slate-500">Supabase 数据库 ↔ GitHub 仓库</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGithubConfig(true)}>
            <Github className="w-4 h-4 mr-2" />
            {githubConfig ? '已连接 GitHub' : '配置 GitHub'}
          </Button>
          <Button variant="outline" onClick={fetchDbCounts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新统计
          </Button>
          {githubConfig && (
            <Button variant="outline" onClick={syncAllToGithub} disabled={syncing}>
              <Github className="w-4 h-4 mr-2" />
              全部同步到 GitHub
            </Button>
          )}
          <Button onClick={syncAllToDb} disabled={syncing}>
            <ArrowUpFromLine className="w-4 h-4 mr-2" />
            全部同步到数据库
          </Button>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 数据同步说明</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium mb-1">1. Supabase 数据库</div>
              <p className="text-xs opacity-80">网站数据源</p>
              <p className="text-xs mt-1">所有数据变更先保存到这里</p>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium mb-1">2. GitHub 仓库</div>
              <p className="text-xs opacity-80">TypeScript 文件备份</p>
              <p className="text-xs mt-1">配置后自动同步到 TS 文件</p>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium mb-1">3. 自动同步</div>
              <p className="text-xs opacity-80">CRUD 操作触发</p>
              <p className="text-xs mt-1">在 Admin 页面添加/编辑/删除数据时自动同步</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {syncStatuses.map((status) => {
          const cfg = moduleConfig.find(c => c.module === status.module);
          return (
            <Card key={status.module}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(status.status)}
                    <div>
                      <h3 className="font-medium">{cfg?.label || status.module}</h3>
                      <p className="text-sm text-slate-500">
                        本地 TS: {status.tsCount} 条 | 数据库: {status.dbCount} 条
                      </p>
                      {status.message && (
                        <p className="text-xs text-slate-400 mt-1">{status.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {githubConfig && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncModuleToGithub(status.module)}
                        disabled={syncing}
                      >
                        <Github className="w-4 h-4 mr-1" />
                        同步到 GitHub
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => syncToDb(status.module)}
                      disabled={syncing}
                    >
                      {status.status === 'syncing' ? '同步中...' : '同步到数据库'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <GitHubConfigDialog
        open={showGithubConfig}
        onOpenChange={setShowGithubConfig}
        onSave={handleGithubConfigSave}
        onTest={handleGithubConfigTest}
        currentConfig={githubConfig ? { owner: githubConfig.owner, repo: githubConfig.repo, branch: githubConfig.branch } : undefined}
      />
    </div>
  );
}
