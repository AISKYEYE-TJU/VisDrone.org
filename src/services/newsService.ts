import { supabase } from '@/config/supabase';
import { oplLabs } from '@/data/oplLabs';

export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  type: 'paper' | 'award' | 'event' | 'recruitment' | 'general';
  image_url?: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const defaultNews: News[] = [
  {
    id: 'news-1',
    title: '实验室论文被CVPR 2026接收',
    summary: '恭喜实验室团队论文《基于深度学习的医学影像分析》被CVPR 2026接收！',
    content: '恭喜实验室团队论文《基于深度学习的医学影像分析》被CVPR 2026接收！这是实验室在AI医疗领域的重要突破。',
    type: 'paper',
    image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=conference%20presentation%2C%20academic%20research%2C%20CVPR%20conference%2C%20no%20text%2C%20no%20words&image_size=landscape_16_9',
    is_published: true,
    is_featured: true,
    created_at: '2026-02-15'
  },
  {
    id: 'news-2',
    title: '实验室获得国家自然科学基金重点项目',
    summary: '实验室获得国家自然科学基金重点支持，研究经费达到500万元。',
    content: '实验室获得国家自然科学基金重点支持，研究经费达到500万元。项目将聚焦于人工智能辅助设计研究。',
    type: 'award',
    image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=research%20award%2C%20national%20science%20foundation%2C%20celebration%2C%20no%20text&image_size=landscape_16_9',
    is_published: true,
    is_featured: true,
    created_at: '2026-01-20'
  },
  {
    id: 'news-3',
    title: '2026年博士研究生招生正式启动',
    summary: '人机协同设计实验室2026年博士研究生招生正式启动，欢迎优秀学子报考。',
    content: '人机协同设计实验室2026年博士研究生招生正式启动，欢迎优秀学子报考。招生方向包括：人机交互、人工智能设计、群智创新设计等。',
    type: 'recruitment',
    image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20recruitment%2C%20phd%20students%2C%20campus%20life%2C%20no%20text&image_size=landscape_16_9',
    is_published: true,
    is_featured: true,
    created_at: '2026-01-10'
  },
  {
    id: 'news-4',
    title: '实验室成功举办人机协同设计研讨会',
    summary: '实验室成功举办年度学术研讨会，国内外50余名专家学者参会。',
    content: '实验室成功举办年度学术研讨会，国内外50余名专家学者参会。会议围绕人机协同设计前沿议题展开深入讨论。',
    type: 'event',
    image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=academic%20conference%2C%20seminar%2C%20researchers%20discussing%2C%20no%20text&image_size=landscape_16_9',
    is_published: true,
    is_featured: false,
    created_at: '2025-12-15'
  }
];

export const newsService = {
  async getAllNews(): Promise<News[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        return data;
      }
      return defaultNews;
    } catch (error) {
      console.log('使用默认新闻数据');
      return defaultNews;
    }
  },

  async getFeaturedNews(): Promise<News[]> {
    const allNews = await this.getAllNews();
    return allNews.filter(news => news.is_featured);
  },

  async getNewsById(id: string): Promise<News | null> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return defaultNews.find(n => n.id === id) || null;
    }
  },

  async createNews(news: Partial<News>): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .insert({
        id: `news-${Date.now()}`,
        ...news,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNews(id: string, news: Partial<News>): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .update(news)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNews(id: string): Promise<void> {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const contactService = {
  async submitMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        id: `contact-${Date.now()}`,
        ...data,
        status: 'unread',
        created_at: new Date().toISOString()
      });

    if (error) {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      messages.push({
        id: `contact-${Date.now()}`,
        ...data,
        status: 'unread',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
    return { success: !error };
  },

  async getMessages() {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return JSON.parse(localStorage.getItem('contactMessages') || '[]');
    }
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const index = messages.findIndex((m: any) => m.id === id);
      if (index !== -1) {
        messages[index].status = 'read';
        localStorage.setItem('contactMessages', JSON.stringify(messages));
      }
    }
  }
};
