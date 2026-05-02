-- 更新 visdrone_datasets 表的 authors 字段

-- DroneBird
UPDATE visdrone_datasets
SET authors = ARRAY['Bing Cao', 'Quanhao Lu', 'Jiekang Feng', 'Qilong Wan', 'Pengfei Zhu', 'Qinghua Hu']::text[]
WHERE id = 'dronebird';

-- AnimalDrone
UPDATE visdrone_datasets
SET authors = ARRAY['Pengfei Zhu', 'Tao Peng', 'Dawei Du', 'Hongtao Yu', 'Libo Zhang', 'Qinghua Hu']::text[]
WHERE id = 'animaldrone';

-- LYU-DroneInfrared
UPDATE visdrone_datasets
SET authors = ARRAY['Wang, Xing', 'Li, Timing', 'Liu, Ya', 'Yao, Shuanglong', 'Liu, Ye', 'Yang, Nan', 'Zhu, Pengfei']::text[]
WHERE id = 'lyu-droneinfrared';

-- DroneRGBT
UPDATE visdrone_datasets
SET authors = ARRAY['Peng Tang', 'Qian Liu', 'Pengfei Zhu', 'Qinghua Hu']::text[]
WHERE id = 'dronergbt';

-- MultiDrone
UPDATE visdrone_datasets
SET authors = ARRAY['Pengfei Zhu', 'Jiayu Zheng', 'Dawei Du', 'Longyin Wen', 'Yiming Sun', 'Qinghua Hu']::text[]
WHERE id = 'multidrone';

-- MDMT
UPDATE visdrone_datasets
SET authors = ARRAY['Zhihao Liu', 'Yuanyuan Shang', 'Timing Li', 'Guanlin Chen', 'Yu Wang', 'Qinghua Hu', 'Pengfei Zhu']::text[]
WHERE id = 'mdmt';

-- DroneCrowd
UPDATE visdrone_datasets
SET authors = ARRAY['Longyin Wen', 'Dawei Du', 'Pengfei Zhu', 'Qinghua Hu', 'Qilong Wang', 'Lifeng Bo', 'Siwei Lyu']::text[]
WHERE id = 'dronecrowd';

-- DroneVehicle
UPDATE visdrone_datasets
SET authors = ARRAY['Yiming Sun', 'Bing Cao', 'Pengfei Zhu', 'Qinghua Hu']::text[]
WHERE id = 'dronevehicle';

-- VisDrone
UPDATE visdrone_datasets
SET authors = ARRAY['Pengfei Zhu', 'Longyin Wen', 'Dawei Du', 'Xiao Bian', 'Heng Fan', 'Qinghua Hu', 'Haibin Ling']::text[]
WHERE id = 'visdrone';
