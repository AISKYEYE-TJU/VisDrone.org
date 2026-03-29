-- =====================================================
-- 添加论文相关扩展字段
-- =====================================================

-- 给论文表添加GitHub链接字段
ALTER TABLE visdrone_papers
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS citations INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS code_url TEXT;

-- 给数据集表添加扩展字段
ALTER TABLE visdrone_datasets
ADD COLUMN IF NOT EXISTS sample_images TEXT[], -- 样本图片URL数组
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0, -- 下载次数
ADD COLUMN IF NOT EXISTS competition_teams TEXT[], -- 参赛队伍

-- 给团队表添加扩展字段
ALTER TABLE visdrone_team
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS bilibili TEXT,
ADD COLUMN IF NOT EXISTS zhihu TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT;

-- 给模型表添加扩展字段
ALTER TABLE visdrone_models
ADD COLUMN IF NOT EXISTS architecture_image TEXT, -- 架构图
ADD COLUMN IF NOT EXISTS performance_metrics JSONB; -- 性能指标JSON

-- 验证表结构
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'visdrone_papers' ORDER BY ordinal_position;

SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'visdrone_datasets' ORDER BY ordinal_position;

SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'visdrone_team' ORDER BY ordinal_position;

SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'visdrone_models' ORDER BY ordinal_position;
