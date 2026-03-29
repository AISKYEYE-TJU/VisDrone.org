import axios from 'axios';
import fs from 'fs';
import path from 'path';

// CHI会议论文API服务
export class CHIPapersService {
  private baseUrl = 'https://dl.acm.org';
  private apiKey: string | null = null;
  private cookie: string | null = null;

  constructor(apiKey?: string, cookie?: string) {
    this.apiKey = apiKey || null;
    this.cookie = cookie || null;
  }

  // 搜索CHI会议论文
  async searchPapers(query: string, year?: number) {
    try {
      // 使用ACM Digital Library的搜索API
      const response = await axios.get(`${this.baseUrl}/action/doSearch`, {
        params: {
          AllField: query,
          startPage: 1,
          pageSize: 50,
          AfterYear: year,
          BeforeYear: year,
          ContribAuthor: '',
          pubtype: 'Conference Proceedings',
          conf: 'CHI'
        },
        headers: this.getHeaders()
      });
      
      // 解析HTML响应获取论文列表
      return this.parseSearchResults(response.data);
    } catch (error) {
      console.error('搜索论文失败:', error);
      throw error;
    }
  }

  // 下载论文
  async downloadPaper(paperId: string, savePath: string) {
    try {
      // 构建PDF下载URL
      const pdfUrl = `${this.baseUrl}/doi/pdf/${paperId}`;
      
      // 下载PDF文件
      const response = await axios.get(pdfUrl, {
        responseType: 'stream',
        headers: this.getHeaders(),
        timeout: 60000 // 1分钟超时
      });

      // 确保目录存在
      const dir = path.dirname(savePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 保存文件
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(true));
        writer.on('error', (error) => {
          fs.unlinkSync(savePath);
          reject(error);
        });
      });
    } catch (error) {
      console.error('下载论文失败:', error);
      throw error;
    }
  }

  // 获取历年CHI会议论文列表
  async getCHIPapersByYear(year: number) {
    try {
      // 搜索指定年份的CHI会议论文
      const papers = await this.searchPapers('CHI Conference', year);
      return papers;
    } catch (error) {
      console.error('获取论文列表失败:', error);
      throw error;
    }
  }

  // 获取HTTP头
  private getHeaders() {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    };

    if (this.cookie) {
      headers['Cookie'] = this.cookie;
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // 解析搜索结果
  private parseSearchResults(html: string) {
    // 简单的HTML解析，实际项目中可以使用cheerio等库
    const papers: any[] = [];
    
    // 提取论文信息的正则表达式
    const paperRegex = /<div class="issue-item__content">(.*?)<\/div>/gs;
    let match;

    while ((match = paperRegex.exec(html)) !== null) {
      const paperHtml = match[1];
      
      // 提取标题
      const titleMatch = paperHtml.match(/<h5 class="issue-item__title">(.*?)<\/h5>/);
      const title = titleMatch ? titleMatch[1].replace(/<.*?>/g, '').trim() : '';
      
      // 提取DOI
      const doiMatch = paperHtml.match(/doi\.org\/(10\.\d+\/[^"\s]+)/);
      const doi = doiMatch ? doiMatch[1] : '';
      
      // 提取作者
      const authorsMatch = paperHtml.match(/<ul class="rlist--inline issue-item__authors">(.*?)<\/ul>/s);
      let authors: string[] = [];
      if (authorsMatch) {
        const authorsHtml = authorsMatch[1];
        const authorMatches = authorsHtml.match(/<span class="hlFld-ContribAuthor">(.*?)<\/span>/g);
        if (authorMatches) {
          authors = authorMatches.map(a => a.replace(/<.*?>/g, '').trim());
        }
      }
      
      if (title && doi) {
        papers.push({
          id: doi,
          title,
          authors,
          doi,
          abstract: '',
          keywords: [],
          venue: 'CHI Conference'
        });
      }
    }
    
    return papers;
  }

  // 设置认证信息
  setAuth(cookie: string) {
    this.cookie = cookie;
  }

  // 测试连接
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseUrl}/doi/10.1145/3313831.3376601`, {
        headers: this.getHeaders()
      });
      return response.status === 200;
    } catch (error) {
      console.error('连接测试失败:', error);
      return false;
    }
  }
}
