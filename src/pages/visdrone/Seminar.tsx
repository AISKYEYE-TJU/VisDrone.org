import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Presentation, ExternalLink, BookOpen, Users, ChevronRight, Layers, Brain, Plane } from 'lucide-react';
import visdroneService, { SeminarEvent } from '@/services/visdroneService';
import { getHeroImage } from '@/utils/aiImageGenerator';

const groupInfo = {
  learning: {
    name: '组会一：学习范式',
    icon: Brain,
    color: 'bg-blue-500',
    description: '持续学习、增量学习、小样本学习等前沿学习范式研究'
  },
  multimodal: {
    name: '组会二：多模态学习',
    icon: Layers,
    color: 'bg-purple-500',
    description: '视觉-语言模型、多模态融合、跨模态学习等研究'
  },
  embodied: {
    name: '组会三：具身智能',
    icon: Plane,
    color: 'bg-green-500',
    description: '无人机导航、具身感知、世界模型等具身智能研究'
  }
};

const Seminar: React.FC = () => {
  const [seminars, setSeminars] = useState<SeminarEvent[]>([]);
  const [talks, setTalks] = useState<SeminarEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'group_meeting' | 'invited_talk'>('group_meeting');
  const [activeGroup, setActiveGroup] = useState<'all' | 'learning' | 'multimodal' | 'embodied'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [seminarData, talkData] = await Promise.all([
        visdroneService.getSeminars(),
        visdroneService.getTalks(),
      ]);
      setSeminars(seminarData);
      setTalks(talkData);
    } catch (error) {
      console.error('Failed to load seminar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (dateStr: string): Date => {
    // 支持多种日期格式：2025-10-21, 2025年10月21日, 2025/10/21
    const match = dateStr.match(/(\d{4})[-\/年](\d{1,2})[-\/月](\d{1,2})/);
    if (match) {
      return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    }
    return new Date(dateStr);
  };

  const sortByDateDesc = (a: SeminarEvent, b: SeminarEvent): number => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  };

  const filteredSeminars = (activeGroup === 'all' 
    ? seminars 
    : seminars.filter(s => s.group === activeGroup)
  ).sort(sortByDateDesc);

  const currentEvents = activeTab === 'group_meeting' ? filteredSeminars : talks.sort(sortByDateDesc);

  const getGroupBadge = (group?: string) => {
    if (!group || !groupInfo[group as keyof typeof groupInfo]) return null;
    const info = groupInfo[group as keyof typeof groupInfo];
    const Icon = info.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${info.color} text-white`}>
        <Icon className="w-3 h-3" />
        {info.name.split('：')[0]}
      </span>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('research')}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Calendar className="w-4 h-4" />
              <span>学术交流</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">学术活动</h1>
            <p className="text-lg text-white/70 leading-relaxed">
              VisDrone团队定期举办学术研讨会和特邀讲座，促进学术交流与合作
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => setActiveTab('group_meeting')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'group_meeting'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              学术研讨会
            </button>
            <button
              onClick={() => setActiveTab('invited_talk')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'invited_talk'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Presentation className="w-4 h-4 inline-block mr-2" />
              特邀讲座
            </button>
          </div>
        </div>
      </section>

      {/* Group Filter - Only show for group_meeting */}
      {activeTab === 'group_meeting' && (
        <section className="py-6 bg-muted/30 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveGroup('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeGroup === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-card/80 border'
                }`}
              >
                全部 ({seminars.length})
              </button>
              {Object.entries(groupInfo).map(([key, info]) => {
                const Icon = info.icon;
                const count = seminars.filter(s => s.group === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveGroup(key as 'learning' | 'multimodal' | 'embodied')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeGroup === key
                        ? `${info.color} text-white`
                        : 'bg-card hover:bg-card/80 border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {info.name.split('：')[1]} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentEvents.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  暂无{activeTab === 'group_meeting' ? '研讨会' : '讲座'}记录
                </div>
              ) : (
                currentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Date */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-20 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {event.date.split('-')[2] || event.date.match(/\d+日/)?.[0]?.replace('日', '') || ''}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {event.date.match(/\d+年.*月/)?.[0]?.replace('年', '/').replace('月', '') || event.date.split('-').slice(0, 2).join('/')}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          {getGroupBadge(event.group)}
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        {event.speaker && (
                          <p className="text-sm text-muted-foreground mb-2">
                            主讲人：{event.speaker}
                          </p>
                        )}
                        {event.abstract && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.abstract}
                          </p>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {event.ppt_url && (
                          <a
                            href={event.ppt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            PPT
                          </a>
                        )}
                        {event.paper_url && (
                          <a
                            href={event.paper_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                          >
                            <BookOpen className="w-4 h-4" />
                            论文
                          </a>
                        )}
                        {event.video_url && (
                          <a
                            href={event.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            视频
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-card border"
            >
              <div className="text-3xl font-bold text-primary mb-2">{seminars.length}</div>
              <div className="text-sm text-muted-foreground">学术研讨会</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-card border"
            >
              <div className="text-3xl font-bold text-primary mb-2">{talks.length}</div>
              <div className="text-sm text-muted-foreground">特邀讲座</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-card border"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {seminars.filter(s => s.ppt_url).length + talks.filter(t => t.ppt_url).length}
              </div>
              <div className="text-sm text-muted-foreground">PPT资料</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 rounded-2xl bg-card border"
            >
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">研究组会</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Seminar;
