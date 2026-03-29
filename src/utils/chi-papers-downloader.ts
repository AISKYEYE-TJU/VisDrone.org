import fs from 'fs';
import path from 'path';
import { CHIPapersService } from '../api/chi-papers';
import { CHI_PAPERS_CONFIG } from '../config/chi-papers';

// 论文下载器
export class CHIPapersDownloader {
  private service: CHIPapersService;
  private downloadedCount = 0;
  private failedCount = 0;

  constructor(apiKey?: string, cookie?: string) {
    this.service = new CHIPapersService(apiKey, cookie);
  }

  // 批量下载指定年份的CHI论文
  async downloadPapersByYear(year: number) {
    try {
      console.log(`开始下载 ${year} 年CHI会议论文...`);
      
      // 创建年份目录
      const yearPath = path.join(CHI_PAPERS_CONFIG.storage.pdfPath, year.toString());
      const metadataYearPath = path.join(CHI_PAPERS_CONFIG.storage.metadataPath, year.toString());
      
      if (!fs.existsSync(yearPath)) {
        fs.mkdirSync(yearPath, { recursive: true });
      }
      
      if (!fs.existsSync(metadataYearPath)) {
        fs.mkdirSync(metadataYearPath, { recursive: true });
      }

      // 测试连接
      const connected = await this.service.testConnection();
      if (!connected) {
        console.error('无法连接到ACM Digital Library，请检查认证信息');
        return { success: 0, failed: 0 };
      }

      // 获取该年份的论文列表
      console.log('正在获取论文列表...');
      const papers = await this.service.getCHIPapersByYear(year);
      
      console.log(`找到 ${papers.length} 篇论文`);
      
      // 批量下载
      for (let i = 0; i < papers.length; i++) {
        const paper = papers[i];
        try {
          const paperId = paper.doi || paper.id;
          const fileName = this.generateFileName(paper);
          const savePath = path.join(yearPath, fileName);
          
          console.log(`下载论文 ${i + 1}/${papers.length}: ${paper.title}`);
          await this.service.downloadPaper(paperId, savePath);
          
          // 保存元数据
          const metadataPath = path.join(metadataYearPath, `${paperId}.json`);
          const metadata = {
            ...paper,
            year,
            pdfPath: savePath,
            metadataPath,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
          
          this.downloadedCount++;
          
          // 避免请求过于频繁
          if (i < papers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`下载失败: ${paper.title}`, error);
          this.failedCount++;
        }
      }

      console.log(`下载完成: 成功 ${this.downloadedCount} 篇, 失败 ${this.failedCount} 篇`);
      return { success: this.downloadedCount, failed: this.failedCount };
    } catch (error) {
      console.error('批量下载失败:', error);
      throw error;
    }
  }

  // 下载指定年份范围的论文
  async downloadPapersByYearRange(startYear: number, endYear: number) {
    let totalSuccess = 0;
    let totalFailed = 0;

    for (let year = startYear; year <= endYear; year++) {
      console.log(`\n开始处理 ${year} 年...`);
      const result = await this.downloadPapersByYear(year);
      totalSuccess += result.success;
      totalFailed += result.failed;
      
      // 年份之间暂停
      if (year < endYear) {
        console.log('暂停30秒...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    console.log(`\n年份范围下载完成: 成功 ${totalSuccess} 篇, 失败 ${totalFailed} 篇`);
    return { success: totalSuccess, failed: totalFailed };
  }

  // 生成文件名
  private generateFileName(paper: any): string {
    const title = paper.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const authors = paper.authors?.slice(0, 3).join('_') || 'unknown';
    return `${paper.year}_${authors}_${title.substring(0, 50)}.pdf`;
  }

  // 检查下载状态
  getDownloadStatus() {
    return {
      downloaded: this.downloadedCount,
      failed: this.failedCount,
      total: this.downloadedCount + this.failedCount
    };
  }

  // 设置认证信息
  setAuth(cookie: string) {
    this.service.setAuth(cookie);
  }

  // 测试连接
  async testConnection() {
    return await this.service.testConnection();
  }
}
