-- =====================================================
-- 更新数据集表，添加 stars 字段
-- 创建时间: 2026-03-21
-- =====================================================

-- 添加 stars 字段到 visdrone_datasets 表
ALTER TABLE visdrone_datasets ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0;

-- 更新现有数据集的 stars 值
UPDATE visdrone_datasets SET stars = 2160 WHERE name = 'VisDrone';
UPDATE visdrone_datasets SET stars = 674 WHERE name = 'DroneVehicle';
UPDATE visdrone_datasets SET stars = 213 WHERE name = 'DroneCrowd';
UPDATE visdrone_datasets SET stars = 0 WHERE name = 'MDMT';

-- 验证更新
SELECT id, name, stars FROM visdrone_datasets;
