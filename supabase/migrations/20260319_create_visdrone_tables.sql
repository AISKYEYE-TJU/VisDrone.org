-- VisDrone 数据库表结构
-- 创建时间: 2026-03-19
-- 说明: 为VisDrone网站创建所有必要的数据表

-- ==================== 新闻表 ====================
CREATE TABLE IF NOT EXISTS visdrone_news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    date TEXT NOT NULL, -- 格式: YYYY-MM
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

-- 创建索引
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

-- 数据集分类约束
ALTER TABLE visdrone_datasets 
    ADD CONSTRAINT valid_dataset_category 
    CHECK (category IN ('低空环境感知', '低空群体智能', '低空具身智能'));

-- 创建索引
CREATE INDEX idx_visdrone_datasets_category ON visdrone_datasets(category);
CREATE INDEX idx_visdrone_datasets_created ON visdrone_datasets(created_at DESC);

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

-- 创建索引
CREATE INDEX idx_visdrone_models_stars ON visdrone_models(stars DESC);
CREATE INDEX idx_visdrone_models_task ON visdrone_models(task);

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

-- 论文类型约束
ALTER TABLE visdrone_papers 
    ADD CONSTRAINT valid_paper_type 
    CHECK (type IN ('conference', 'journal'));

-- 创建索引
CREATE INDEX idx_visdrone_papers_year ON visdrone_papers(year DESC);
CREATE INDEX idx_visdrone_papers_type ON visdrone_papers(type);
CREATE INDEX idx_visdrone_papers_venue ON visdrone_papers(venue);

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

-- 创建索引
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

-- 创建索引
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

-- 角色约束
ALTER TABLE visdrone_team 
    ADD CONSTRAINT valid_role 
    CHECK (role IN ('PI', 'Professor', 'PhD', 'Master', 'Alumni'));

-- 创建索引
CREATE INDEX idx_visdrone_team_role ON visdrone_team(role);
CREATE INDEX idx_visdrone_team_name ON visdrone_team(name);

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

-- 创建索引
CREATE INDEX idx_visdrone_partners_order ON visdrone_partners(display_order);

-- ==================== 启用RLS (Row Level Security) ====================
-- 为所有表启用RLS
ALTER TABLE visdrone_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE visdrone_partners ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略（任何人都可以读取）
CREATE POLICY "Allow public read access" ON visdrone_news
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_datasets
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_models
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_papers
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_patents
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_awards
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_team
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON visdrone_partners
    FOR SELECT USING (true);

-- 创建管理员写入策略（需要认证）
CREATE POLICY "Allow authenticated write access" ON visdrone_news
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_datasets
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_models
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_papers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_patents
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_awards
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_team
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated write access" ON visdrone_partners
    FOR ALL USING (auth.role() = 'authenticated');

-- ==================== 创建更新触发器 ====================
-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_visdrone_news_updated_at BEFORE UPDATE ON visdrone_news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_datasets_updated_at BEFORE UPDATE ON visdrone_datasets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_models_updated_at BEFORE UPDATE ON visdrone_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_papers_updated_at BEFORE UPDATE ON visdrone_papers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_patents_updated_at BEFORE UPDATE ON visdrone_patents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_awards_updated_at BEFORE UPDATE ON visdrone_awards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_team_updated_at BEFORE UPDATE ON visdrone_team
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visdrone_partners_updated_at BEFORE UPDATE ON visdrone_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== 插入默认合作伙伴数据 ====================
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

-- ==================== 添加注释 ====================
COMMENT ON TABLE visdrone_news IS 'VisDrone新闻数据';
COMMENT ON TABLE visdrone_datasets IS 'VisDrone数据集数据';
COMMENT ON TABLE visdrone_models IS 'VisDrone模型数据';
COMMENT ON TABLE visdrone_papers IS 'VisDrone论文数据';
COMMENT ON TABLE visdrone_patents IS 'VisDrone专利数据';
COMMENT ON TABLE visdrone_awards IS 'VisDrone奖项数据';
COMMENT ON TABLE visdrone_team IS 'VisDrone团队成员数据';
COMMENT ON TABLE visdrone_partners IS 'VisDrone合作伙伴数据';
