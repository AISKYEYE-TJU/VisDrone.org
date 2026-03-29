import fs from 'fs';
import path from 'path';
import { Paper } from '../types/chi-papers';

// 元数据提取器
export class MetadataExtractor {
  // 从PDF文件提取元数据（简化实现）
  async extractFromPDF(pdfPath: string): Promise<Partial<Paper>> {
    try {
      // 这里需要实现PDF文本提取
      // 由于PDF提取比较复杂，这里提供一个简化的实现
      // 实际项目中可以使用pdf-parse等库
      
      console.log(`提取PDF元数据: ${pdfPath}`);
      
      // 从文件名推断信息
      const fileName = path.basename(pdfPath);
      const match = fileName.match(/^(\d{4})_(.*?)_(.*?)\.pdf$/);
      
      if (match) {
        const [, year, authorsPart, titlePart] = match;
        const authors = authorsPart.split('_').map(a => a.trim());
        const title = titlePart.replace(/_/g, ' ').trim();
        
        return {
          year: parseInt(year),
          authors,
          title,
          abstract: 'Abstract will be extracted from PDF',
          keywords: []
        };
      }
      
      return {};
    } catch (error) {
      console.error('提取PDF元数据失败:', error);
      return {};
    }
  }

  // 从元数据文件提取
  extractFromMetadataFile(metadataPath: string): Partial<Paper> {
    try {
      if (fs.existsSync(metadataPath)) {
        const data = fs.readFileSync(metadataPath, 'utf8');
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      console.error('提取元数据文件失败:', error);
      return {};
    }
  }

  // 合并元数据
  mergeMetadata(sources: Partial<Paper>[]): Partial<Paper> {
    const merged: Partial<Paper> = {};
    
    sources.forEach(source => {
      Object.assign(merged, source);
    });
    
    return merged;
  }

  // 标准化论文元数据
  normalizeMetadata(metadata: Partial<Paper>): Partial<Paper> {
    return {
      id: metadata.id || this.generateId(metadata),
      title: metadata.title?.trim() || 'Untitled',
      authors: metadata.authors?.map(a => a.trim()) || [],
      year: metadata.year || new Date().getFullYear(),
      doi: metadata.doi?.trim(),
      abstract: metadata.abstract?.trim() || '',
      keywords: metadata.keywords?.map(k => k.toLowerCase().trim()) || [],
      venue: metadata.venue || 'CHI Conference',
      pdfPath: metadata.pdfPath || '',
      metadataPath: metadata.metadataPath || '',
      createdAt: metadata.createdAt || new Date(),
      updatedAt: new Date()
    };
  }

  // 生成论文ID
  private generateId(metadata: Partial<Paper>): string {
    const title = metadata.title || 'untitled';
    const year = metadata.year || new Date().getFullYear();
    const id = `${year}_${title.toLowerCase().replace(/\s+/g, '_').substring(0, 20)}`;
    return id.replace(/[^a-zA-Z0-9_]/g, '');
  }

  // 批量处理元数据
  async processBatch(pdfDirectory: string, metadataDirectory: string): Promise<Paper[]> {
    const papers: Paper[] = [];
    
    if (!fs.existsSync(pdfDirectory)) {
      console.log('PDF目录不存在');
      return papers;
    }

    const pdfFiles = fs.readdirSync(pdfDirectory).filter(file => file.endsWith('.pdf'));
    
    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(pdfDirectory, pdfFile);
      const metadataFile = pdfFile.replace('.pdf', '.json');
      const metadataPath = path.join(metadataDirectory, metadataFile);
      
      // 提取元数据
      const pdfMetadata = await this.extractFromPDF(pdfPath);
      const fileMetadata = this.extractFromMetadataFile(metadataPath);
      
      // 合并和标准化
      const merged = this.mergeMetadata([pdfMetadata, fileMetadata]);
      const normalized = this.normalizeMetadata(merged);
      
      // 添加路径信息
      const paper: Paper = {
        ...(normalized as Paper),
        pdfPath,
        metadataPath
      };
      
      papers.push(paper);
    }
    
    return papers;
  }

  // 验证元数据完整性
  validateMetadata(paper: Paper): boolean {
    const requiredFields = ['id', 'title', 'authors', 'year', 'abstract'];
    
    for (const field of requiredFields) {
      if (!paper[field as keyof Paper]) {
        console.error(`缺少必填字段: ${field}`);
        return false;
      }
    }
    
    if (paper.authors.length === 0) {
      console.error('作者列表为空');
      return false;
    }
    
    return true;
  }

  // 导出元数据为JSON
  exportMetadata(paper: Paper, outputPath: string): void {
    try {
      fs.writeFileSync(outputPath, JSON.stringify(paper, null, 2));
      console.log(`元数据导出成功: ${outputPath}`);
    } catch (error) {
      console.error('导出元数据失败:', error);
    }
  }

  // 导入元数据
  importMetadata(inputPath: string): Paper | null {
    try {
      if (fs.existsSync(inputPath)) {
        const data = fs.readFileSync(inputPath, 'utf8');
        const paper = JSON.parse(data);
        return this.normalizeMetadata(paper) as Paper;
      }
      return null;
    } catch (error) {
      console.error('导入元数据失败:', error);
      return null;
    }
  }
}
