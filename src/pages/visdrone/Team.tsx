import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Award, Mail, ExternalLink, MapPin, User } from 'lucide-react';
import { VISDRONE_INFO } from '@/lib/visdrone-config';
import { getHeroImage } from '@/utils/aiImageGenerator';
import { visdroneService } from '@/services/visdroneService';
import type { TeamMember } from '@/types/visdrone';

const MemberCard: React.FC<{
  member: TeamMember;
  large?: boolean;
}> = ({ member, large = false }) => {
  const extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
  const [extIndex, setExtIndex] = React.useState(0);

  const basePath = React.useMemo(() => {
    if (!member.image) return `/team/${member.name}`;
    const lastDot = member.image.lastIndexOf('.');
    const lastSlash = member.image.lastIndexOf('/');
    if (lastDot > lastSlash) {
      return member.image.substring(0, lastDot);
    }
    return member.image;
  }, [member.image, member.name]);

  const imgSrc = `${basePath}${extensions[extIndex]}`;

  const handleImgError = () => {
    if (extIndex < extensions.length - 1) {
      setExtIndex(extIndex + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
        large ? 'p-8' : 'p-5'
      }`}
    >
      <div className={`relative rounded-full overflow-hidden mb-4 ${
        large ? 'w-32 h-32 mx-auto' : 'w-20 h-20'
      }`}>
        <img
          src={imgSrc}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      </div>

      <div className={large ? 'text-center' : ''}>
        <h3 className={`font-bold text-gray-900 ${large ? 'text-2xl mb-2' : 'text-lg mb-1'}`}>
          {member.name}
          {member.name_en && <span className="text-sm text-gray-500 ml-2">({member.name_en})</span>}
        </h3>
        
        <p className={`text-blue-600 font-medium mb-1 ${large ? 'text-base' : 'text-sm'}`}>
          {member.title}
        </p>

        {member.bio && (
          <p className={`text-gray-600 mb-3 ${large ? 'text-sm' : 'text-xs'}`}>
            {member.bio}
          </p>
        )}

        {(member.homepage || member.email) && (
          <div className={`flex gap-2 ${large ? 'justify-center' : ''}`}>
            {member.homepage && (
              <a
                href={member.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
                title="个人主页"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
                title="发送邮件"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StudentCard: React.FC<{
  member: TeamMember;
  isAlumni?: boolean;
}> = ({ member, isAlumni = false }) => {
  const extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
  const [extIndex, setExtIndex] = React.useState(0);

  const basePath = React.useMemo(() => {
    if (!member.image) return `/team/${member.name}`;
    const lastDot = member.image.lastIndexOf('.');
    const lastSlash = member.image.lastIndexOf('/');
    if (lastDot > lastSlash) {
      return member.image.substring(0, lastDot);
    }
    return member.image;
  }, [member.image, member.name]);

  const imgSrc = `${basePath}${extensions[extIndex]}`;

  const handleImgError = () => {
    if (extIndex < extensions.length - 1) {
      setExtIndex(extIndex + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <img
            src={imgSrc}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={handleImgError}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm mb-0.5">{member.name}</h4>

          {isAlumni ? (
            member.roles?.includes('Professor') ? (
              <p className="text-xs text-gray-500 mb-1">
                {member.year} {member.title && `| ${member.title}`}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mb-1">
                {member.year} {member.bio && `| ${member.bio.split('|')[0]}`}
              </p>
            )
          ) : (
            <>
              {(member.year || member.bio) && (
                <p className="text-xs text-gray-500 mb-1">
                  {member.year} {member.bio && `| ${member.bio.split('|')[0]}`}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SectionTitle: React.FC<{ title: string; count?: number; icon?: React.ReactNode }> = ({ 
  title, 
  count, 
  icon 
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && <div className="text-blue-500">{icon}</div>}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {count !== undefined && (
        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 text-sm rounded-full">
          {count}人
        </span>
      )}
      <div className="flex-1 h-px bg-gray-200 ml-4" />
    </div>
  );
};

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const members = await visdroneService.getTeamMembers();
        setTeamMembers(members);
      } catch (e) {
        console.error('Failed to fetch team members:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const getRoles = (member: TeamMember): string[] => {
    return member.roles && member.roles.length > 0 ? member.roles : (member.role ? [member.role] : []);
  };

  const isAlumni = (member: TeamMember): boolean => {
    return getRoles(member).includes('Alumni');
  };

  const sortByYear = (members: TeamMember[], ascending = true) => {
    return [...members].sort((a, b) => {
      const yearA = a.year ? parseInt(a.year.replace(/\D/g, '')) : 0;
      const yearB = b.year ? parseInt(b.year.replace(/\D/g, '')) : 0;
      return ascending ? yearA - yearB : yearB - yearA;
    });
  };

  const professorOrder = ['sunyiming', 'yaoxinjie', 'fanyan', 'zhumengping'];

  const leader = teamMembers.find(m => getRoles(m).includes('PI'));
  const professors = teamMembers
    .filter(m => getRoles(m).includes('Professor'))
    .sort((a, b) => professorOrder.indexOf(a.id) - professorOrder.indexOf(b.id));
  const phdStudents = sortByYear(teamMembers.filter(m => getRoles(m).includes('PhD')));
  const masterStudents = sortByYear(teamMembers.filter(m => getRoles(m).includes('Master')));
  const visitingStudents = teamMembers.filter(m => getRoles(m).includes('Visiting'));
  const alumni = sortByYear(teamMembers.filter(m => getRoles(m).includes('Alumni')), false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${getHeroImage('team')}')` }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">VisDrone团队</h1>
            <p className="text-lg text-white/70 mb-6">
              来自东南大学、天津大学、国防科技大学等顶尖高校的优秀研究团队
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{VISDRONE_INFO.location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12 space-y-16">
        {leader && (
          <section>
            <SectionTitle 
              title="团队负责人" 
              icon={<Award className="w-6 h-6" />}
            />
            <div className="max-w-md mx-auto">
              <MemberCard member={leader} large />
            </div>
          </section>
        )}

        <section>
          <SectionTitle 
            title="团队教师" 
            count={professors.length}
            icon={<Users className="w-6 h-6" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {professors.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle 
            title="博士生" 
            count={phdStudents.length}
            icon={<GraduationCap className="w-6 h-6" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {phdStudents.map((student) => (
              <StudentCard key={student.id} member={student} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle 
            title="硕士生" 
            count={masterStudents.length}
            icon={<GraduationCap className="w-6 h-6" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {masterStudents.map((student) => (
              <StudentCard key={student.id} member={student} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle 
            title="访问学生" 
            count={visitingStudents.length}
            icon={<User className="w-6 h-6" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {visitingStudents.map((student) => (
              <StudentCard key={student.id} member={student} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle 
            title="毕业生" 
            count={alumni.length}
            icon={<Award className="w-6 h-6" />}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {alumni.map((alumnus) => (
              <StudentCard key={alumnus.id} member={alumnus} isAlumni={true} />
            ))}
          </div>
        </section>
      </div>

      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">加入我们</h2>
            <p className="text-gray-600 mb-6">
              VisDrone团队长期招收博士后、博士生、硕士生和本科生。欢迎对低空智能、计算机视觉、机器学习感兴趣的同学加入！
            </p>
            <a
              href={`mailto:${VISDRONE_INFO.contactEmail}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              联系招生
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
