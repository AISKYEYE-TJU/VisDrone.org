-- Fix RLS Policy to allow anonymous writes
-- Run this in Supabase SQL Editor if you get "create failed" errors

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_news;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_datasets;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_models;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_papers;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_patents;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_awards;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_team;
DROP POLICY IF EXISTS "Allow authenticated write access" ON visdrone_partners;

-- Create new policies allowing anonymous writes (for development)
CREATE POLICY "Allow anonymous write access" ON visdrone_news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_datasets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_models FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_papers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_patents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_awards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_team FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous write access" ON visdrone_partners FOR ALL USING (true) WITH CHECK (true);
