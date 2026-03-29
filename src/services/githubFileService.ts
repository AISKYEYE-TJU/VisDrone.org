import { toast } from 'sonner';

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface FileContent {
  path: string;
  content: string;
  sha?: string;
}

const API_BASE = 'https://api.github.com';

const MODULE_CONFIG: Record<string, { path: string; exportName: string }> = {
  news: { path: 'src/data/visdrone/news.ts', exportName: 'news' },
  datasets: { path: 'src/data/visdrone/datasets.ts', exportName: 'datasets' },
  models: { path: 'src/data/visdrone/models.ts', exportName: 'models' },
  papers: { path: 'src/data/visdrone/papers.ts', exportName: 'papers' },
  patents: { path: 'src/data/visdrone/patents.ts', exportName: 'patents' },
  awards: { path: 'src/data/visdrone/awards.ts', exportName: 'awards' },
  team: { path: 'src/data/visdrone/team.ts', exportName: 'teamMembers' },
};

class GitHubFileService {
  private config: GitHubConfig | null = null;

  setConfig(config: GitHubConfig) {
    this.config = config;
    localStorage.setItem('github_config', JSON.stringify(config));
  }

  getConfig(): GitHubConfig | null {
    if (!this.config) {
      const saved = localStorage.getItem('github_config');
      if (saved) {
        this.config = JSON.parse(saved);
      }
    }
    return this.config;
  }

  clearConfig() {
    this.config = null;
    localStorage.removeItem('github_config');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config = this.getConfig();
    if (!config) {
      throw new Error('GitHub 未配置，请先设置 GitHub 配置');
    }

    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `GitHub API 错误: ${response.status}`);
    }

    return response.json();
  }

  async getFileContent(path: string): Promise<FileContent | null> {
    const config = this.getConfig();
    if (!config) throw new Error('GitHub 未配置');

    try {
      const data = await this.request<{ content: string; sha: string }>(
        `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`
      );
      const content = atob(data.content);
      return { path, content, sha: data.sha };
    } catch (err) {
      if ((err as Error).message.includes('404')) {
        return null;
      }
      throw err;
    }
  }

  async updateFile(path: string, content: string, message: string, sha?: string): Promise<{ success: boolean }> {
    const config = this.getConfig();
    if (!config) throw new Error('GitHub 未配置');

    try {
      const body: Record<string, unknown> = {
        message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: config.branch,
      };

      if (sha) {
        body.sha = sha;
      }

      await this.request(`/repos/${config.owner}/${config.repo}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      toast.success('GitHub 同步成功');
      return { success: true };
    } catch (err) {
      console.error('Error updating file:', err);
      toast.error(`GitHub 同步失败: ${(err as Error).message}`);
      return { success: false };
    }
  }

  async getModuleData(module: string): Promise<{ content: string; sha: string } | null> {
    const config = MODULE_CONFIG[module];
    if (!config) {
      throw new Error(`未知模块: ${module}`);
    }

    const file = await this.getFileContent(config.path);
    if (!file) return null;

    return { content: file.content, sha: file.sha || '' };
  }

  async saveModuleData(
    module: string,
    data: unknown[],
    message: string
  ): Promise<{ success: boolean }> {
    const config = MODULE_CONFIG[module];
    if (!config) {
      throw new Error(`未知模块: ${module}`);
    }

    const existing = await this.getModuleData(module);
    const content = this.generateTsFile(module, data);

    return this.updateFile(
      config.path,
      content,
      message,
      existing?.sha
    );
  }

  private generateTsFile(module: string, data: unknown[]): string {
    const config = MODULE_CONFIG[module];
    if (!config) throw new Error(`未知模块: ${module}`);

    const typeMap: Record<string, string> = {
      news: 'NewsItem',
      datasets: 'Dataset',
      models: 'Model',
      papers: 'Paper',
      patents: 'Patent',
      awards: 'Award',
      team: 'TeamMember',
    };

    const typeName = typeMap[module] || 'any';
    const exportName = config.exportName;

    let content = `import type { ${typeName} } from '@/types/visdrone';\n\n`;
    content += `export const ${exportName}: ${typeName}[] = [\n`;

    data.forEach((item) => {
      const formatted = JSON.stringify(item, null, 2)
        .replace(/\n/g, '\n  ')
        .replace(/\\n/g, '\n');
      content += `  ${formatted},\n`;
    });

    content += `];\n\n`;
    content += `export function get${typeName}ById(id: string): ${typeName} | undefined {\n`;
    content += `  return ${exportName}.find(item => item.id === id);\n`;
    content += `}\n`;

    return content;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const config = this.getConfig();
    if (!config) {
      return { success: false, message: 'GitHub 未配置' };
    }

    try {
      await this.request(`/repos/${config.owner}/${config.repo}`);
      return { success: true, message: `已连接到 ${config.owner}/${config.repo}` };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
}

export const githubFileService = new GitHubFileService();
export default githubFileService;
