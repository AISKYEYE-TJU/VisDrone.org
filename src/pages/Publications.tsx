import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, BookOpen, Award, Newspaper, FileSpreadsheet, Filter } from 'lucide-react';
import { publications } from "@/data/index";
import { PublicationCard } from "@/components/Cards";
import { PublicationType, cn } from "@/lib/index";

/**
 * 出版物页面组件
 * 展示实验室的所有学术成果，包括期刊论文、会议论文、专著等
 * 支持按年份排序和按类型筛选，设计风格遵循学术极简主义
 */
const Publications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PublicationType | '全部'>('全部');

  // 筛选标签定义
  const filterTabs: { label: string; value: PublicationType | '全部'; icon: React.ReactNode }[] = [
    { label: '全部', value: '全部', icon: <Filter className="w-4 h-4" /> },
    { label: '期刊论文', value: '期刊论文', icon: <Newspaper className="w-4 h-4" /> },
    { label: '会议论文', value: '会议论文', icon: <FileText className="w-4 h-4" /> },
    { label: '专著', value: '专著', icon: <BookOpen className="w-4 h-4" /> },
    { label: '教材', value: '教材', icon: <BookOpen className="w-4 h-4" /> },
    { label: '专利', value: '专利', icon: <Award className="w-4 h-4" /> },
    { label: '报告', value: '报告', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  // 根据筛选条件过滤并按年份降序排列
  const filteredPublications = useMemo(() => {
    const filtered = activeTab === '全部' 
      ? publications 
      : publications.filter(p => p.type === activeTab);
    
    return [...filtered].sort((a, b) => b.year - a.year);
  }, [activeTab]);

  // 按年份分组
  const groupedPublications = useMemo(() => {
    const groups: { [key: number]: typeof publications } = {};
    filteredPublications.forEach(pub => {
      if (!groups[pub.year]) groups[pub.year] = [];
      groups[pub.year].push(pub);
    });
    return Object.entries(groups).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));
  }, [filteredPublications]);

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题区 */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight font-heading">
              学术成果
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              实验室在人机协同、人工智能艺术及设计方法论等领域的最新研究产出。我们致力于通过跨学科的视角，探索技术与艺术的深度融合。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 筛选过滤区 */}
      <section className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted-foreground/10"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 出版物列表 */}
      <section className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {groupedPublications.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {groupedPublications.map(([year, pubs]) => (
                <div key={year} className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
                  <div className="relative">
                    <div className="sticky top-40">
                      <span className="text-3xl font-bold text-primary/30 font-mono tracking-tighter">
                        {year}
                      </span>
                      <div className="h-1 w-8 bg-primary mt-2 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {pubs.map((pub, index) => (
                      <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PublicationCard publication={pub} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">暂无相关类型的成果展示</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 维护说明 (仅供后台人员参考的UI提示) */}
      <section className="bg-muted/30 py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto p-6 rounded-xl border border-dashed border-muted-foreground/30 bg-background">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              网站更新指南
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              如需添加新的论文、专著或专利，请联系实验室负责人。维护人员只需在数据文件（data/index.ts）中按照既定格式添加条目，页面将自动根据年份和类型进行分类展示。无需修改任何代码逻辑，确保非技术背景人员亦可轻松维护。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Publications;