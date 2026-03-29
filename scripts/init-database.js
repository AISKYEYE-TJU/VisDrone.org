// Database Initialization Script
// Run this to create all VisDrone tables in Supabase

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zpzwefrxckbojbotjxof.supabase.co';
const supabaseKey = 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly';

const supabase = createClient(supabaseUrl, supabaseKey);

const createTablesSQL = `
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
`;

async function initDatabase() {
  console.log('🚀 Initializing VisDrone Database...\n');
  
  try {
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (error) {
      console.error('❌ Error creating tables:', error);
      console.log('\n⚠️  Please manually execute the SQL in Supabase Dashboard:');
      console.log('1. Go to https://app.supabase.com/project/zpzwefrxckbojbotjxof');
      console.log('2. Click SQL Editor → New Query');
      console.log('3. Copy and paste the SQL from: supabase/migrations/20260319_create_visdrone_tables.sql');
      console.log('4. Click Run\n');
      return;
    }
    
    console.log('✅ All tables created successfully!\n');
    
    // Verify tables
    const tables = [
      'visdrone_news',
      'visdrone_datasets', 
      'visdrone_models',
      'visdrone_papers',
      'visdrone_patents',
      'visdrone_awards',
      'visdrone_team',
      'visdrone_partners'
    ];
    
    console.log('📊 Created tables:');
    tables.forEach(table => console.log(`  ✓ ${table}`));
    
    console.log('\n🎉 Database initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:5173/visdrone/admin');
    console.log('3. Go to "数据同步" page');
    console.log('4. Switch to "数据库" mode');
    console.log('5. Click "同步到数据库"\n');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

initDatabase();
