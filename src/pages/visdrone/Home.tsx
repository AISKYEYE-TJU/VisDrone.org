import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Database, Brain, Star, BookOpen, Award, ChevronRight, FileText, Lightbulb, Trophy, Quote, Code2 } from 'lucide-react';
import { VISDRONE_INFO, RESEARCH_AREAS } from '@/lib/visdrone-config';
import visdroneService from '@/services/visdroneService';
import { getHeroImage } from '@/utils/aiImageGenerator';

const Home: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [patents, setPatents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    papers: 0,
    patents: 0,
    awards: 0,
    datasets: 0,
    models: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [modelsData, datasetsData, papersData, awardsData, patentsData] = await Promise.all([
        visdroneService.getModels(),
        visdroneService.getDatasets(),
        visdroneService.getPapers(),
        visdroneService.getAwards(),
        visdroneService.getPatents(),
      ]);
      // 按stars排序并取前4个
      const sortedModels = modelsData.sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 4);
      const sortedDatasets = datasetsData
        .map(d => ({ ...d, stars: d.stars || d.github_info?.stars || 0 }))
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 4);
      setModels(sortedModels);
      setDatasets(sortedDatasets);
      setPapers(papersData.slice(0, 3));
      setAwards(awardsData.slice(0, 3));
      setPatents(patentsData.slice(0, 3));
      
      // 更新真实统计数据
      setStats({
        papers: papersData.length,
        patents: patentsData.length,
        awards: awardsData.length,
        datasets: datasetsData.length,
        models: modelsData.length,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // 使用真实统计数据
  const displayStats = [
    { value: stats.datasets > 0 ? stats.datasets : VISDRONE_INFO.stats.datasets, label: '数据集', icon: <Database className="w-5 h-5" /> },
    { value: stats.papers > 0 ? stats.papers : VISDRONE_INFO.stats.papers, label: '发表论文', icon: <FileText className="w-5 h-5" /> },
    { value: stats.patents > 0 ? stats.patents : VISDRONE_INFO.stats.patents, label: '授权专利', icon: <Lightbulb className="w-5 h-5" /> },
    { value: stats.models > 0 ? stats.models : VISDRONE_INFO.stats.models, label: '开源模型', icon: <Code2 className="w-5 h-5" /> },
    { value: 26157, label: '引用次数', icon: <Quote className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${getHeroImage('home')}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center sm:text-left"
          >
            {/* Institution Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-white/20 max-w-full"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{VISDRONE_INFO.institution}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-tight text-white"
            >
              {VISDRONE_INFO.name}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto sm:mx-0"
            >
              {VISDRONE_INFO.description}
            </motion.p>

            {/* Stats - 使用真实数据 - 居中展示 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-10 mb-8 sm:mb-12"
            >
              {displayStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60 flex items-center justify-center gap-1 mt-2">
                    {stat.icon}
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start"
            >
              <Link
                to="/visdrone/research"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 text-sm sm:text-base"
              >
                探索更多 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/visdrone/team"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all border border-white/20 text-sm sm:text-base"
              >
                团队成员
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
          >
            <motion.div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Research Areas Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">核心研究方向</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              VisDrone 团队面向低空经济国家战略需求，构建低空数据基座和知识基座，攻关低空智能感知、低空具身智能和低空群体智能技术难题
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {RESEARCH_AREAS.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm text-primary font-medium">{area.titleEn}</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{area.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{area.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {area.keywords.map(k => (
                    <span key={k} className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs bg-primary/10 text-primary rounded-full">{k}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Datasets Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">数据基座</h2>
              <p className="text-muted-foreground text-sm sm:text-base">构建世界上规模最大的低空视觉数据平台</p>
            </div>
            <Link to="/visdrone/data-base" className="hidden sm:inline-flex items-center gap-1 text-primary hover:underline text-sm">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  {(dataset.stars || dataset.github_info?.stars) && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-500">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500" />
                      <span>{(dataset.stars || dataset.github_info?.stars || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{dataset.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3 sm:mb-4">{dataset.description}</p>
                <div className="text-xs text-muted-foreground">
                  <p>{dataset.paper_venue} {dataset.paper_year}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 sm:hidden">
            <Link to="/visdrone/data-base" className="inline-flex items-center gap-1 text-primary hover:underline text-sm">
              查看全部数据集 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">模型基座</h2>
              <p className="text-muted-foreground text-sm sm:text-base">面向深度网络结构、目标检测、目标分割、目标追踪和目标计数等领域的模型和算法</p>
            </div>
            <Link to="/visdrone/model-base" className="hidden sm:inline-flex items-center gap-1 text-primary hover:underline text-sm">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <span>{model.stars || 0}</span>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{model.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3 sm:mb-4">{model.description}</p>
                <div className="text-xs text-muted-foreground">
                  <p>{model.paper_venue} {model.paper_year}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8 sm:hidden">
            <Link to="/visdrone/model-base" className="inline-flex items-center gap-1 text-primary hover:underline text-sm">
              查看全部模型 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Publications & Awards Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Papers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold">发表论文 ({stats.papers > 0 ? stats.papers : VISDRONE_INFO.stats.papers})</h2>
                <Link to="/visdrone/publications" className="text-xs sm:text-sm text-primary hover:underline inline-flex items-center gap-1">
                  更多 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {papers.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1">{paper.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-primary">{paper.venue}</span>
                          <span>{paper.year}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold">获奖荣誉 ({stats.awards > 0 ? stats.awards : VISDRONE_INFO.stats.awards})</h2>
                <Link to="/visdrone/publications" className="text-xs sm:text-sm text-primary hover:underline inline-flex items-center gap-1">
                  更多 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {awards.map((award, index) => (
                  <motion.div
                    key={award.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1">{award.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{award.venue}</span>
                          <span>{award.date}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-10 sm:py-16 bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-2">合作单位</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">与国内外知名企业和研究机构建立深度合作关系</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 lg:gap-8"
          >
            {['雄安国创中心', '一飞智控', '天地伟业', '中电科', '航天三院', '中水北方', '中汽研', '华为', '长安汽车'].map((partner, index) => (
              <div
                key={index}
                className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg bg-muted/50 text-muted-foreground font-medium text-xs sm:text-sm hover:bg-muted transition-colors"
              >
                {partner}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
