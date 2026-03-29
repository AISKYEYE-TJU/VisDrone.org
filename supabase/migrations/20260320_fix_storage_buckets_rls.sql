-- =====================================================
-- Supabase Storage Buckets RLS 修复脚本
-- 解决 "new row violates row-level security policy" 错误
-- 请在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 1. 检查 storage.buckets 表的现有 policies
SELECT '=== 检查 storage.buckets 的 policies ===' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'buckets' AND schemaname = 'storage';

-- 2. 删除现有的 restricted policies
DROP POLICY IF EXISTS "Allow authenticated bucket access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated update access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public access to bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public insert access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public update access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public delete access" ON storage.buckets;

-- 3. 为 storage.buckets 创建完全开放的 policies
SELECT '=== 创建新的 storage.buckets policies ===' as status;

-- 读取 - 公开
CREATE POLICY "buckets_public_read" ON storage.buckets
FOR SELECT TO anon, authenticated USING (true);

-- 插入 - 公开
CREATE POLICY "buckets_public_insert" ON storage.buckets
FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 更新 - 公开
CREATE POLICY "buckets_public_update" ON storage.buckets
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- 删除 - 公开
CREATE POLICY "buckets_public_delete" ON storage.buckets
FOR DELETE TO anon, authenticated USING (true);

-- 4. 验证
SELECT '=== 验证 buckets policies ===' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'buckets' AND schemaname = 'storage';

-- 5. 再次尝试创建/更新 bucket
SELECT '=== 更新/创建 visdrone-images bucket ===' as status;

INSERT INTO storage.buckets (id, name, public)
VALUES ('visdrone-images', 'visdrone-images', true)
ON CONFLICT (id) DO UPDATE SET
  name = 'visdrone-images',
  public = true;

-- 6. 验证 bucket
SELECT '=== 验证最终结果 ===' as status;
SELECT id, name, public FROM storage.buckets WHERE id = 'visdrone-images';

SELECT '=== 完成! ===' as status;