import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import NewsAdmin from './NewsAdmin';
import DatasetsAdmin from './DatasetsAdmin';
import PapersAdmin from './PapersAdmin';
import PatentsAdmin from './PatentsAdmin';
import AwardsAdmin from './AwardsAdmin';
import TeamAdmin from './TeamAdmin';
import ModelsAdmin from './ModelsAdmin';
import SeminarsAdmin from './SeminarsAdmin';
import PartnersAdmin from './PartnersAdmin';
import DataSyncPage from './DataSyncPage';
import { FileText, Database, Brain, Users, Lightbulb, Award, Newspaper, LayoutDashboard, RefreshCw, Calendar, Handshake, Quote, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAllNews, fetchAllDatasets, fetchAllPapers, fetchAllPatents, fetchAllAwards, fetchAllTeamMembers, fetchAllModels, fetchAllSeminars, fetchAllPartners, getSiteConfig, setSiteConfig } from '@/services/adminCrudService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const statsConfig = [
  { key: 'news', label: '新闻', icon: Newspaper, color: 'text-blue-500' },
  { key: 'datasets', label: '数据集', icon: Database, color: 'text-green-500' },
  { key: 'papers', label: '论文', icon: FileText, color: 'text-purple-500' },
  { key: 'patents', label: '专利', icon: Lightbulb, color: 'text-orange-500' },
  { key: 'awards', label: '奖项', icon: Award, color: 'text-yellow-500' },
  { key: 'team', label: '团队', icon: Users, color: 'text-pink-500' },
  { key: 'models', label: '模型', icon: Brain, color: 'text-cyan-500' },
  { key: 'seminars', label: '学术活动', icon: Calendar, color: 'text-indigo-500' },
  { key: 'partners', label: '合作单位', icon: Handshake, color: 'text-emerald-500' },
];

function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, { count: number; loading: boolean }>>({
    news: { count: 0, loading: true },
    datasets: { count: 0, loading: true },
    papers: { count: 0, loading: true },
    patents: { count: 0, loading: true },
    awards: { count: 0, loading: true },
    team: { count: 0, loading: true },
    models: { count: 0, loading: true },
    seminars: { count: 0, loading: true },
    partners: { count: 0, loading: true },
  });
  const [citationCount, setCitationCount] = useState<string>('26157');
  const [citationEditing, setCitationEditing] = useState(false);
  const [citationSaving, setCitationSaving] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const [newsData, datasetsData, papersData, patentsData, awardsData, teamData, modelsData, seminarsData, partnersData, citationVal] = await Promise.all([
        fetchAllNews(),
        fetchAllDatasets(),
        fetchAllPapers(),
        fetchAllPatents(),
        fetchAllAwards(),
        fetchAllTeamMembers(),
        fetchAllModels(),
        fetchAllSeminars(),
        fetchAllPartners(),
        getSiteConfig('citation_count'),
      ]);

      setStats({
        news: { count: newsData.length, loading: false },
        datasets: { count: datasetsData.length, loading: false },
        papers: { count: papersData.length, loading: false },
        patents: { count: patentsData.length, loading: false },
        awards: { count: awardsData.length, loading: false },
        team: { count: teamData.length, loading: false },
        models: { count: modelsData.length, loading: false },
        seminars: { count: seminarsData.length, loading: false },
        partners: { count: partnersData.length, loading: false },
      });
      if (citationVal) {
        setCitationCount(citationVal);
      }
    };

    loadStats();
  }, []);

  const handleSaveCitation = async () => {
    setCitationSaving(true);
    await setSiteConfig('citation_count', citationCount);
    setCitationSaving(false);
    setCitationEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">管理后台</h1>
        <p className="text-slate-500">VisDrone 网站内容管理系统</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const statInfo = stats[stat.key];
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    {statInfo?.loading ? (
                      <Skeleton className="h-8 w-12 mt-1" />
                    ) : (
                      <p className={`text-2xl font-bold ${stat.color}`}>{statInfo?.count || 0}</p>
                    )}
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 引用次数编辑卡片 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Quote className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-sm text-slate-500">Google Scholar 引用次数</p>
                {citationEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={citationCount}
                      onChange={(e) => setCitationCount(e.target.value)}
                      className="w-40 h-9 text-lg font-bold"
                      placeholder="输入引用次数"
                    />
                    <Button size="sm" onClick={handleSaveCitation} disabled={citationSaving}>
                      <Save className="w-4 h-4 mr-1" />
                      {citationSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setCitationEditing(false)}>
                      取消
                    </Button>
                  </div>
                ) : (
                  <p
                    className="text-2xl font-bold text-emerald-500 cursor-pointer hover:underline"
                    onClick={() => setCitationEditing(true)}
                    title="点击编辑"
                  >
                    {Number(citationCount).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            {!citationEditing && (
              <Button variant="outline" size="sm" onClick={() => setCitationEditing(true)}>
                编辑
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-600">使用左侧导航菜单管理各个模块的内容。</p>
            <div className="text-sm text-slate-500">
              <p>• 新闻管理 - 添加、编辑、删除团队新闻</p>
              <p>• 数据集管理 - 管理研究数据集</p>
              <p>• 论文管理 - 跟踪发表论文</p>
              <p>• 专利管理 - 记录专利信息</p>
              <p>• 奖项管理 - 展示获奖情况</p>
              <p>• 团队管理 - 管理团队成员</p>
              <p>• 模型管理 - 管理 AI 模型</p>
              <p>• 学术活动 - 管理组会、特邀报告</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">数据库</span>
              <span className="text-green-600">已连接</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">存储服务</span>
              <span className="text-green-600">已连接</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">数据同步</span>
              <span className="text-green-600">正常</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const location = useLocation();

  if (location.pathname === '/visdrone/admin') {
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  const subRoutes: Record<string, React.ReactNode> = {
    '/visdrone/admin/news': <NewsAdmin />,
    '/visdrone/admin/datasets': <DatasetsAdmin />,
    '/visdrone/admin/models': <ModelsAdmin />,
    '/visdrone/admin/papers': <PapersAdmin />,
    '/visdrone/admin/patents': <PatentsAdmin />,
    '/visdrone/admin/awards': <AwardsAdmin />,
    '/visdrone/admin/team': <TeamAdmin />,
    '/visdrone/admin/seminars': <SeminarsAdmin />,
    '/visdrone/admin/partners': <PartnersAdmin />,
    '/visdrone/admin/sync': <DataSyncPage />,
  };

  const ChildComponent = subRoutes[location.pathname];

  if (!ChildComponent) {
    return <Navigate to="/visdrone/admin" replace />;
  }

  return <AdminLayout>{ChildComponent}</AdminLayout>;
}
