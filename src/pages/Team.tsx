import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, School, Award, Calendar } from 'lucide-react';
import { teamMembers } from '@/data/index';
import { TeamCard } from '@/components/Cards';
import GroupMeeting from '@/components/GroupMeeting';
import { MemberRole, TeamMember } from '@/lib/index';
import { IMAGES } from '@/assets/images';

/**
 * 团队成员角色配置
 */
const ROLE_CONFIG: Record<MemberRole, { label: string; icon: React.ReactNode }> = {
  PI: { label: '实验室负责人', icon: <Award className="w-5 h-5" /> },
  Professor: { label: '教授/专家', icon: <Award className="w-5 h-5" /> },
  PhD: { label: '博士研究生', icon: <GraduationCap className="w-5 h-5" /> },
  Master: { label: '硕士研究生', icon: <School className="w-5 h-5" /> },
  Alumni: { label: '实验室校友', icon: <Users className="w-5 h-5" /> },
  Staff: { label: '行政团队', icon: <Users className="w-5 h-5" /> },
};

export default function Team() {
  // 按角色分组
  const groupedMembers = teamMembers.reduce((acc, member) => {
    if (!acc[member.role]) acc[member.role] = [];
    acc[member.role].push(member);
    return acc;
  }, {} as Record<MemberRole, TeamMember[]>);

  // 定义渲染顺序
  const rolesToDisplay: MemberRole[] = ['PI', 'PhD', 'Master', 'Alumni'];

  return (
    <div className="min-h-screen bg-background">
      {/* 英雄区：团队概览 */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.TEAM_WORK_1} 
            alt="Team Background" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              RESEARCH TEAM
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              研究团队
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              汇聚艺术设计、计算机科学与心理学的跨学科力量，共同探索人机协同的未来可能。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 成员展示区 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {rolesToDisplay.map((role) => {
            const members = groupedMembers[role];
            if (!members || members.length === 0) return null;

            return (
              <div key={role} className="mb-20 last:mb-0">
                {/* 角色标题 */}
                <div className="flex items-center gap-3 mb-10 border-b border-border pb-4">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary">
                    {ROLE_CONFIG[role].icon}
                  </div>
                  <h2 className="text-2xl font-bold">{ROLE_CONFIG[role].label}</h2>
                  <span className="text-muted-foreground font-mono text-sm ml-auto">
                    {members.length.toString().padStart(2, '0')} MEMBERS
                  </span>
                </div>

                {/* 成员网格 */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {members.map((member) => (
                    <motion.div
                      key={member.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <TeamCard member={member} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 组会模块 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              GROUP MEETING
            </span>
            <h2 className="text-3xl font-bold mb-6">线上组会</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              与老师、学生和虚拟学生一起进行线上讨论，头脑风暴，共同探索设计创新的可能性。
            </p>
          </motion.div>
          
          <GroupMeeting />
        </div>
      </section>

      {/* 实验室文化/呼吁 */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-12 rounded-3xl bg-card border border-border shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6">加入我们</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              实验室常年招收具有艺术学、设计学、计算机科学或心理学背景的推免生、统考生及博士后。如果你对人机协同、生成式AI与创意设计感兴趣，欢迎联系我们。
            </p>
            <a 
              href="/join" 
              className="inline-flex items-center justify-center h-12 px-8 font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
            >
              查看招生详情
            </a>
          </motion.div>
        </div>
      </section>

      {/* 页脚装饰 */}
      <div className="py-10 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2026 人机协同设计实验室</p>
      </div>
    </div>
  );
}
