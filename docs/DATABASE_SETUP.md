# VisDrone 数据库配置指南

## 概述

本指南将帮助您配置 Supabase 数据库，使 VisDrone 后台管理系统能够持久化存储数据。

## 步骤一：创建 Supabase 项目

### 1.1 注册/登录 Supabase

1. 访问 [Supabase 官网](https://supabase.com/)
2. 点击 "Start your project"
3. 使用 GitHub 或邮箱注册/登录

### 1.2 创建新项目

1. 点击 "New Project"
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Project name**: `visdrone-db` (或您喜欢的名称)
   - **Database Password**: 设置强密码（请保存好）
   - **Region**: 选择 `East Asia (Tokyo)` 或 `Southeast Asia (Singapore)`（离中国近）
3. 点击 "Create new project"
4. 等待项目创建完成（约 1-2 分钟）

## 步骤二：获取 API 密钥

### 2.1 Project URL 和 Anon Key

1. 进入项目 Dashboard
2. 点击左侧菜单 "Project Settings" → "API"
3. 找到以下信息：
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...`

### 2.2 保存配置

创建 `.env` 文件在项目根目录：

```bash
# 文件: .env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **重要**: 将 `.env` 添加到 `.gitignore`，不要提交到版本控制！

## 步骤三：创建数据库表

### 3.1 进入 SQL 编辑器

1. 在 Supabase Dashboard 中，点击左侧 "SQL Editor"
2. 点击 "New query"

### 3.2 执行建表 SQL

复制以下 SQL 内容并执行：

```sql
-- VisDrone 数据库表结构
-- 创建时间: 2026-03-19

-- ==================== 新闻表 ====================
CREATE TABLE IF NOT EXISTS visdrone_news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    date TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL DEFAULT '学术交流',
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 新闻分类约束
ALTER TABLE visdrone_news 
    ADD CONSTRAINT valid_category 
    CHECK (category IN ('学术交流', '学术活动', '平台建设', '科研项目', '学术成果', '竞赛获奖'));

CREATE INDEX idx_visdrone_news_date ON visdrone_news(date DESC);
CREATE INDEX idx_visdrone_news_category ON visdrone_news(category);

-- ==================== 数据集表 ====================
CREATE TABLE IF NOT EXISTS visdrone_datasets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '低空环境感知',
    paper_title TEXT NOT NULL,
    paper_venue TEXT NOT NULL,
    paper_year INTEGER NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    github TEXT,
    github_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE visdrone_datasets 
    ADD CONSTRAINT valid_dataset_category 
    CHECK (category IN ('低空环境感知', '低空群体智能', '低空具身智能'));

CREATE INDEX idx_visdrone_datasets_category ON visdrone_datasets(category);

-- ==================== 模型表 ====================
CREATE TABLE IF NOT EXISTS visdrone_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    description TEXT NOT NULL,
    task TEXT NOT NULL,
    paper_title TEXT NOT NULL,
    paper_venue TEXT NOT NULL,
    paper_year INTEGER NOT NULL,
    paper_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    low_altitude_tags JSONB DEFAULT '[]'::jsonb,
    github TEXT,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visdrone_models_stars ON visdrone_models(stars DESC);

-- ==================== 论文表 ====================
CREATE TABLE IF NOT EXISTS visdrone_papers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    authors JSONB NOT NULL DEFAULT '[]'::jsonb,
    venue TEXT NOT NULL,
    year INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'conference',
    doi TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE visdrone_papers 
    ADD CONSTRAINT valid_paper_type 
    CHECK (type IN ('conference', 'journal'));

CREATE INDEX idx_visdrone_papers_year ON visdrone_papers(year DESC);

-- ==================== 专利表 ====================
CREATE TABLE IF NOT EXISTS visdrone_patents (
    id TEXT PRIMARY KEY,
    inventors TEXT NOT NULL,
    title TEXT NOT NULL,
    patent_no TEXT NOT NULL,
    date TEXT NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visdrone_patents_date ON visdrone_patents(date DESC);

-- ==================== 奖项表 ====================
CREATE TABLE IF NOT EXISTS visdrone_awards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    winners TEXT NOT NULL,
    year INTEGER NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visdrone_awards_year ON visdrone_awards(year DESC);

-- ==================== 团队成员表 ====================
CREATE TABLE IF NOT EXISTS visdrone_team (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    role TEXT NOT NULL DEFAULT 'Master',
    title TEXT NOT NULL,
    year TEXT,
    image TEXT,
    bio TEXT NOT NULL,
    research_interests JSONB DEFAULT '[]'::jsonb,
    email TEXT,
    homepage TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE visdrone_team 
    ADD CONSTRAINT valid_role 
    CHECK (role IN ('PI', 'Professor', 'PhD', 'Master', 'Alumni'));

CREATE INDEX idx_visdrone_team_role ON visdrone_team(role);

-- ==================== 合作伙伴表 ====================
CREATE TABLE IF NOT EXISTS visdrone_partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== 启用RLS (行级安全) ====================
ALTER TABLE visdrone_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_partners ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Allow public read access" ON visdrone_news FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_datasets FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_models FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_papers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_patents FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_awards FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_team FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON visdrone_partners FOR SELECT USING (true);

-- 认证用户写入策略
CREATE POLICY "Allow authenticated write access" ON visdrone_news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_datasets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_models FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_papers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_patents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_awards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_team FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write access" ON visdrone_partners FOR ALL USING (auth.role() = 'authenticated');

-- ==================== 更新触发器 ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_visdrone_news_updated_at BEFORE UPDATE ON visdrone_news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_datasets_updated_at BEFORE UPDATE ON visdrone_datasets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_models_updated_at BEFORE UPDATE ON visdrone_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_papers_updated_at BEFORE UPDATE ON visdrone_papers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_patents_updated_at BEFORE UPDATE ON visdrone_patents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_awards_updated_at BEFORE UPDATE ON visdrone_awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_team_updated_at BEFORE UPDATE ON visdrone_team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visdrone_partners_updated_at BEFORE UPDATE ON visdrone_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认合作伙伴
INSERT INTO visdrone_partners (id, name, display_order) VALUES
    ('partner-1', '雄安国创中心', 1),
    ('partner-2', '一飞智控', 2),
    ('partner-3', '天地伟业', 3),
    ('partner-4', '中电科', 4),
    ('partner-5', '航天三院', 5),
    ('partner-6', '中水北方', 6),
    ('partner-7', '中汽研', 7),
    ('partner-8', '华为', 8),
    ('partner-9', '长安汽车', 9)
ON CONFLICT (name) DO NOTHING;
```

### 3.3 执行 SQL

1. 将上述 SQL 粘贴到编辑器
2. 点击 "Run" 按钮
3. 等待执行完成（显示 "Success"）

## 步骤四：配置本地环境

### 4.1 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
# .env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 4.2 添加到 .gitignore

确保 `.env` 不会被提交：

```bash
# .gitignore
.env
.env.local
.env.*.local
```

## 步骤五：启动项目并测试

### 5.1 安装依赖

```bash
npm install
```

### 5.2 启动开发服务器

```bash
npm run dev
```

### 5.3 访问 Admin 后台

1. 打开浏览器访问 `http://localhost:5173/visdrone/admin`
2. 点击左侧菜单 "数据同步"
3. 将开关切换到 "数据库" 模式
4. 点击 "同步到数据库" 按钮
5. 等待同步完成

## 步骤六：验证配置

### 6.1 检查数据表

在 Supabase Dashboard 中：
1. 点击 "Table Editor"
2. 应该能看到以下表：
   - visdrone_news
   - visdrone_datasets
   - visdrone_models
   - visdrone_papers
   - visdrone_patents
   - visdrone_awards
   - visdrone_team
   - visdrone_partners

### 6.2 测试数据操作

1. 在 Admin 后台添加一条新闻
2. 刷新页面，检查数据是否保留
3. 在 Supabase Table Editor 中查看数据是否存在

## 常见问题

### Q1: 连接失败怎么办？

检查以下几点：
- `.env` 文件中的 URL 和 Key 是否正确
- 项目是否处于 Active 状态
- 网络是否可以访问 Supabase

### Q2: 如何备份数据？

在 Supabase Dashboard：
1. 点击 "Database" → "Backups"
2. 点击 "Create backup"

或使用 SQL 导出：
```bash
pg_dump -h db.xxxxx.supabase.co -p 5432 -U postgres -d postgres > backup.sql
```

### Q3: 免费额度够用吗？

Supabase 免费版包含：
- 500MB 数据库空间
- 2GB 带宽/月
- 无限 API 请求

对于 VisDrone 的数据量（约 300+ 条记录），完全够用。

### Q4: 如何重置数据库？

1. 在 SQL Editor 中执行：
```sql
DROP TABLE IF EXISTS visdrone_news, visdrone_datasets, visdrone_models, 
visdrone_papers, visdrone_patents, visdrone_awards, visdrone_team, visdrone_partners CASCADE;
```

2. 重新执行步骤 3.2 的建表 SQL

## 下一步

数据库配置完成后，您可以：
1. 使用 Admin 后台管理所有数据
2. 邀请团队成员协作（需要配置 Auth）
3. 设置自动备份策略

如有问题，请查看 Supabase 官方文档：https://supabase.com/docs
