import { supabase, Lab, TeamMember, Paper, Project, Resource, MeetingSystem } from '@/config/supabase';
import { OPLLab } from '@/data/oplLabs';

// 实验室服务
export const labService = {
  // 获取所有实验室
  async getAllLabs(): Promise<OPLLab[]> {
    try {
      const { data: labs, error } = await supabase
        .from('labs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取实验室列表失败:', error);
        // 失败时返回默认数据
        const { oplLabs } = await import('@/data/oplLabs');
        return oplLabs;
      }

      // 为每个实验室获取详细信息
      const labsWithDetails = await Promise.all(
        labs.map(async (lab) => {
          return await this.getLabById(lab.id);
        })
      );

      return labsWithDetails;
    } catch (error) {
      console.error('获取实验室列表异常:', error);
      // 异常时返回默认数据
      const { oplLabs } = await import('@/data/oplLabs');
      return oplLabs;
    }
  },

  // 根据ID获取实验室
  async getLabById(labId: string): Promise<OPLLab> {
    try {
      // 获取实验室基本信息
      const { data: lab, error: labError } = await supabase
        .from('labs')
        .select('*')
        .eq('id', labId)
        .single();

      if (labError || !lab) {
        console.error('获取实验室详情失败:', labError);
        // 失败时从默认数据中查找
        const { oplLabs } = await import('@/data/oplLabs');
        const defaultLab = oplLabs.find(l => l.id === labId);
        if (defaultLab) {
          return defaultLab;
        }
        throw new Error('实验室不存在');
      }

      // 获取团队成员
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('lab_id', labId);

      if (membersError) {
        console.error('获取团队成员失败:', membersError);
      }

      // 分类团队成员
      const pi = teamMembers?.find(m => m.role === 'PI');
      const humanStudents = teamMembers?.filter(m => m.role === 'human_student') || [];
      const agentStudents = teamMembers?.filter(m => m.role === 'agent_student') || [];

      // 获取论文
      const { data: papers, error: papersError } = await supabase
        .from('papers')
        .select('*')
        .eq('lab_id', labId);

      if (papersError) {
        console.error('获取论文失败:', papersError);
      }

      // 获取项目
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('lab_id', labId);

      if (projectsError) {
        console.error('获取项目失败:', projectsError);
      }

      // 获取资源
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('lab_id', labId);

      if (resourcesError) {
        console.error('获取资源失败:', resourcesError);
      }

      // 获取会议系统
      const { data: meetingSystem, error: meetingError } = await supabase
        .from('meeting_systems')
        .select('*')
        .eq('lab_id', labId)
        .single();

      if (meetingError) {
        console.error('获取会议系统失败:', meetingError);
      }

      // 构建实验室对象
      const oplLab: OPLLab = {
        id: lab.id,
        name: lab.name,
        discipline: lab.discipline,
        description: lab.description,
        coverImage: lab.cover_image,
        avatar: lab.avatar,
        members: lab.members,
        projectCount: lab.project_count,
        paperCount: lab.paper_count,
        pi: pi ? {
          id: pi.id,
          name: pi.name,
          role: pi.role,
          avatar: pi.avatar,
          title: pi.title,
          research: pi.research,
          email: pi.email,
          publications: pi.publications,
          projects: pi.projects
        } : {
          id: `pi-${labId}`,
          name: '实验室负责人',
          role: 'PI',
          title: '教授',
          research: '研究方向',
          email: 'email@example.com',
          publications: 0,
          projects: 0
        },
        humanStudents: humanStudents.map(student => ({
          id: student.id,
          name: student.name,
          role: student.role,
          avatar: student.avatar,
          title: student.title,
          research: student.research,
          email: student.email,
          publications: student.publications,
          projects: student.projects
        })),
        agentStudents: agentStudents.map(agent => ({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          avatar: agent.avatar,
          title: agent.title,
          research: agent.research,
          email: agent.email,
          publications: agent.publications,
          projects: agent.projects
        })),
        publications: papers?.map(paper => ({
          id: paper.id,
          title: paper.title,
          authors: paper.authors,
          venue: paper.venue,
          year: paper.year,
          link: paper.link,
          category: paper.category
        })) || [],
        researchProjects: projects?.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          startDate: project.start_date,
          endDate: project.end_date,
          members: project.members,
          funding: project.funding
        })) || [],
        resources: resources?.map(resource => ({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          description: resource.description,
          link: resource.link,
          downloads: resource.downloads
        })) || [],
        meetingSystem: meetingSystem ? {
          enabled: meetingSystem.enabled,
          schedule: meetingSystem.schedule,
          nextMeeting: meetingSystem.next_meeting
        } : {
          enabled: false,
          schedule: '每周一次'
        }
      };

      return oplLab;
    } catch (error) {
      console.error('获取实验室详情异常:', error);
      // 异常时从默认数据中查找
      const { oplLabs } = await import('@/data/oplLabs');
      const defaultLab = oplLabs.find(l => l.id === labId);
      if (defaultLab) {
        return defaultLab;
      }
      throw error;
    }
  },

  // 创建实验室
  async createLab(labData: Partial<Lab>): Promise<OPLLab> {
    try {
      const { data: newLab, error } = await supabase
        .from('labs')
        .insert({
          id: `lab-${Date.now()}`,
          name: labData.name,
          discipline: labData.discipline,
          description: labData.description,
          cover_image: labData.cover_image,
          avatar: labData.avatar,
          members: 1,
          project_count: 0,
          paper_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('创建实验室失败:', error);
        throw error;
      }

      // 创建默认 PI
      await supabase
        .from('team_members')
        .insert({
          id: `pi-${newLab.id}`,
          lab_id: newLab.id,
          name: '实验室负责人',
          role: 'PI' as const,
          title: '教授',
          research: '研究方向',
          email: 'email@example.com',
          publications: 0,
          projects: 0
        });

      // 创建默认会议系统
      await supabase
        .from('meeting_systems')
        .insert({
          id: `meeting-${newLab.id}`,
          lab_id: newLab.id,
          enabled: false,
          schedule: '每周一次'
        });

      return await this.getLabById(newLab.id);
    } catch (error) {
      console.error('创建实验室异常:', error);
      throw error;
    }
  },

  // 添加智能体学生
  async addAgentStudent(labId: string, agentData: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const { data: newAgent, error } = await supabase
        .from('team_members')
        .insert({
          id: `agent-${Date.now()}`,
          lab_id: labId,
          name: agentData.name,
          role: 'agent_student' as const,
          avatar: agentData.avatar,
          title: agentData.title,
          research: agentData.research,
          publications: agentData.publications || 0,
          projects: agentData.projects || 0
        })
        .select()
        .single();

      if (error) {
        console.error('添加智能体学生失败:', error);
        throw error;
      }

      // 更新实验室成员数
      await supabase
        .from('labs')
        .update({ members: supabase.raw('members + 1') })
        .eq('id', labId);

      return newAgent;
    } catch (error) {
      console.error('添加智能体学生异常:', error);
      throw error;
    }
  },

  // 添加论文
  async addPaper(labId: string, paperData: Partial<Paper>): Promise<Paper> {
    try {
      const { data: newPaper, error } = await supabase
        .from('papers')
        .insert({
          id: `paper-${Date.now()}`,
          lab_id: labId,
          title: paperData.title,
          authors: paperData.authors,
          venue: paperData.venue,
          year: paperData.year,
          link: paperData.link,
          category: paperData.category
        })
        .select()
        .single();

      if (error) {
        console.error('添加论文失败:', error);
        throw error;
      }

      // 更新实验室论文数
      await supabase
        .from('labs')
        .update({ paper_count: supabase.raw('paper_count + 1') })
        .eq('id', labId);

      return newPaper;
    } catch (error) {
      console.error('添加论文异常:', error);
      throw error;
    }
  },

  // 添加项目
  async addProject(labId: string, projectData: Partial<Project>): Promise<Project> {
    try {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          id: `project-${Date.now()}`,
          lab_id: labId,
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          members: projectData.members,
          funding: projectData.funding
        })
        .select()
        .single();

      if (error) {
        console.error('添加项目失败:', error);
        throw error;
      }

      // 更新实验室项目数
      await supabase
        .from('labs')
        .update({ project_count: supabase.raw('project_count + 1') })
        .eq('id', labId);

      return newProject;
    } catch (error) {
      console.error('添加项目异常:', error);
      throw error;
    }
  },

  // 更新会议系统
  async updateMeetingSystem(labId: string, meetingData: Partial<MeetingSystem>): Promise<MeetingSystem> {
    try {
      // 检查会议系统是否存在
      const { data: existingMeeting, error: checkError } = await supabase
        .from('meeting_systems')
        .select('*')
        .eq('lab_id', labId)
        .single();

      let result;

      if (checkError || !existingMeeting) {
        // 创建新的会议系统
        result = await supabase
          .from('meeting_systems')
          .insert({
            id: `meeting-${Date.now()}`,
            lab_id: labId,
            enabled: meetingData.enabled,
            schedule: meetingData.schedule,
            next_meeting: meetingData.next_meeting
          })
          .select()
          .single();
      } else {
        // 更新现有会议系统
        result = await supabase
          .from('meeting_systems')
          .update({
            enabled: meetingData.enabled,
            schedule: meetingData.schedule,
            next_meeting: meetingData.next_meeting
          })
          .eq('lab_id', labId)
          .select()
          .single();
      }

      if (result.error) {
        console.error('更新会议系统失败:', result.error);
        throw result.error;
      }

      return result.data;
    } catch (error) {
      console.error('更新会议系统异常:', error);
      throw error;
    }
  }
};
