-- Create storage bucket for images
-- Run this in Supabase SQL Editor

-- Enable storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('visdrone-images', 'visdrone-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policy to allow public read
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'visdrone-images');

-- Create policy to allow anonymous uploads (for development)
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'visdrone-images');

-- Create policy to allow anonymous updates
DROP POLICY IF EXISTS "Allow anonymous updates" ON storage.objects;
CREATE POLICY "Allow anonymous updates"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'visdrone-images');

-- Create policy to allow anonymous deletes
DROP POLICY IF EXISTS "Allow anonymous deletes" ON storage.objects;
CREATE POLICY "Allow anonymous deletes"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'visdrone-images');

-- Verify bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'visdrone-images';
