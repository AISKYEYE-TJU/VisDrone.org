-- 为 visdrone_datasets 表添加 image 字段
ALTER TABLE visdrone_datasets ADD COLUMN IF NOT EXISTS image TEXT;

-- 为 visdrone_models 表添加 image 字段
ALTER TABLE visdrone_models ADD COLUMN IF NOT EXISTS image TEXT;

-- 提示: 需要在 Supabase Dashboard > SQL Editor 中执行此脚本
