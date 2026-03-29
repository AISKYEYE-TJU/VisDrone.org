-- =====================================================
-- Supabase Storage 修复脚本
-- 请在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 1. 首先检查 storage.buckets 表是否存在
SELECT '=== 检查 storage.buckets 表 ===' as status;

SELECT id, name, public, file_size_limit, created_at, updated_at
FROM storage.buckets
WHERE id = 'visdrone-images';

-- 2. 检查 storage.objects 表
SELECT '=== 检查 storage.objects 表 ===' as status;

SELECT id, bucket_id, name, owner, created_at, updated_at, last_accessed_at
FROM storage.objects
WHERE bucket_id = 'visdrone-images'
LIMIT 10;

-- 3. 如果bucket不存在，创建它
SELECT '=== 创建 storage bucket ===' as status;

INSERT INTO storage.buckets (id, name, public)
VALUES ('visdrone-images', 'visdrone-images', true)
ON CONFLICT (id) DO UPDATE SET
  name = 'visdrone-images',
  public = true;

-- 4. 删除旧的 policies
SELECT '=== 删除旧的 policies ===' as status;

DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access 2" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads 2" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous deletes" ON storage.objects;
DROP POLICY IF EXISTS "anon_insert" ON storage.objects;
DROP POLICY IF EXISTS "anon_select" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated write access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON storage.objects;

-- 5. 创建新的 policies (允许所有操作)
SELECT '=== 创建新的 policies ===' as status;

-- 读取权限 - 公开
CREATE POLICY "visdrone_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'visdrone-images');

-- 上传权限 - 匿名和认证用户
CREATE POLICY "visdrone_anonymous_upload" ON storage.objects
FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'visdrone-images');

-- 更新权限
CREATE POLICY "visdrone_anonymous_update" ON storage.objects
FOR UPDATE TO anon, authenticated USING (bucket_id = 'visdrone-images') WITH CHECK (bucket_id = 'visdrone-images');

-- 删除权限
CREATE POLICY "visdrone_anonymous_delete" ON storage.objects
FOR DELETE TO anon, authenticated USING (bucket_id = 'visdrone-images');

-- 6. 确保 bucket 是公开的
SELECT '=== 更新 bucket 为公开 ===' as status;

UPDATE storage.buckets
SET public = true
WHERE id = 'visdrone-images';

-- 7. 验证配置
SELECT '=== 验证最终配置 ===' as status;

SELECT 'Buckets:' as type;
SELECT id, name, public FROM storage.buckets WHERE id = 'visdrone-images';

SELECT 'Policies:' as type;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT '=== 完成! ===' as status;