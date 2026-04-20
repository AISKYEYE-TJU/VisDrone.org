import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://zpzwefrxckbojbotjxof.supabase.co';
const supabaseAnonKey = 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportModels() {
  console.log('Fetching models from Supabase...');

  try {
    const { data, error } = await supabase
      .from('visdrone_models')
      .select('*')
      .order('stars', { ascending: false });

    if (error) throw error;

    console.log(`Found ${data?.length || 0} models\n`);

    const outputPath = path.join(__dirname, '..', 'src', 'data', 'models_export.json');

    const dataDir = path.dirname(outputPath);
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch {}

    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Models saved to: ${outputPath}`);

    if (data) {
      console.log('\n=== Models Summary ===');
      data.forEach((model, i) => {
        console.log(`${i + 1}. ${model.name}`);
        console.log(`   GitHub: ${model.github || 'N/A'}`);
        console.log(`   Stars: ${model.stars || 0}`);
        console.log(`   Paper: ${model.paper_title || 'N/A'} (${model.paper_venue || 'N/A'} ${model.paper_year || 'N/A'})`);
        console.log('');
      });
    }

    return data;

  } catch (error) {
    console.error('Error fetching models:', error);
    return null;
  }
}

async function exportPapers() {
  console.log('\nFetching papers from Supabase...');

  try {
    const { data, error } = await supabase
      .from('visdrone_papers')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;

    console.log(`Found ${data?.length || 0} papers\n`);

    const outputPath = path.join(__dirname, '..', 'src', 'data', 'papers_export.json');

    const dataDir = path.dirname(outputPath);
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch {}

    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Papers saved to: ${outputPath}`);

    return data;

  } catch (error) {
    console.error('Error fetching papers:', error);
    return null;
  }
}

const models = await exportModels();
const papers = await exportPapers();

// Save combined data for comparison
if (models && papers) {
  const comparisonPath = path.join(__dirname, '..', 'src', 'data', 'comparison_data.json');
  await fs.writeFile(comparisonPath, JSON.stringify({ models, papers }, null, 2), 'utf-8');
  console.log(`\nComparison data saved to: ${comparisonPath}`);
}

console.log('\nDone!');
