import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Layers, Compass, CheckCircle2, Clock } from 'lucide-react';
import { researchProjects } from '@/data/index';
import { ResearchCard } from '@/components/Cards';
import { ProjectStatus, LAB_INFO } from '@/lib/index';

const Research: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | '全部'>('全部');

  const filteredProjects = useMemo(() => {
    if (activeFilter === '全部') return researchProjects;
    return researchProjects.filter((p) => p.status === activeFilter);
  }, [activeFilter]);

  const filters: (ProjectStatus | '全部')[] = ['全部', '进行中', '已完成'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              探索<span className="text-primary">人机协同</span>的未来边界
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {LAB_INFO.name} 致力于在艺术学、计算机科学与设计学的交汇点上开展前瞻性研究。我们通过建模、仿真与实证研究，重塑人工智能时代下的创意工作流与交互范式。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="p-3 bg-accent/10 rounded-xl text-accent-foreground">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">设计创新教育</h3>
                <p className="text-sm text-muted-foreground">探索AI时代的设计教育新模式，培养复合型设计人才。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">群智创新设计</h3>
                <p className="text-sm text-muted-foreground">汇聚集体智慧，通过协作式设计流程激发创新。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="p-3 bg-accent/10 rounded-xl text-accent-foreground">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">人机交互设计</h3>
                <p className="text-sm text-muted-foreground">构建更自然、智能的人机协作界面，提升用户体验。</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">生成式设计</h3>
                <p className="text-sm text-muted-foreground">探索大模型在艺术创作与专业设计中的介入机制与边界。</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">研究项目</h2>
              <p className="text-muted-foreground">展示实验室目前进行中和已完成的核心科研课题</p>
            </div>

            <div className="flex items-center p-1 bg-background border border-border rounded-lg">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeFilter === filter ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResearchCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="text-muted-foreground">暂无该分类下的研究项目</p>
            </div>
          )}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">研究范式与方法</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">跨学科融合</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  我们将艺术学的设计直觉与计算机科学的计算能力相结合，强调「以人为本」的算法设计，确保技术进步能够赋能人类创意而非取代人类。
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">迭代化实证</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  通过严格的实验设计与用户访谈，我们对每一个开发的智能工具进行定性与定量评估，确保研究成果在实际应用场景中具有高效的可行性。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 lg:p-16 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
               <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0, 50 0, 100 100 Z" fill="currentColor" />
               </svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">寻找研究合作伙伴？</h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-lg">
                我们始终欢迎来自学术界和工业界的合作机会，共同探索人工智能与人类创意的共生关系。
              </p>
              <a
                href={`mailto:${LAB_INFO.contactEmail}`}
                className="inline-flex items-center justify-center h-12 px-8 font-medium bg-background text-primary rounded-full hover:bg-secondary transition-colors"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;