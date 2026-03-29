import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://zpzwefrxckbojbotjxof.supabase.co';
const supabaseAnonKey = 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchCrossrefPDF(title, authors) {
  try {
    const query = encodeURIComponent(title);
    const response = await fetch(`https://api.crossref.org/works?query=${query}&rows=1`, {
      headers: {
        'User-Agent': 'VisDrone-Research/1.0 (mailto:visdrone@tju.edu.cn)'
      }
    });

    if (!response.ok) {
      console.log(`Crossref query failed for: ${title.substring(0, 50)}...`);
      return null;
    }

    const data = await response.json();
    const items = data.message?.items;

    if (!items || items.length === 0) {
      console.log(`No results from Crossref for: ${title.substring(0, 50)}...`);
      return null;
    }

    const work = items[0];

    // Try to find PDF link
    let pdfUrl = null;

    // Check DOI URL first
    if (work.URL) {
      pdfUrl = work.URL;
    }

    // Check for PDF links in the links array
    if (work.link) {
      const pdfLink = work.link.find(l =>
        l['content-type']?.includes('pdf') ||
        l['content-type']?.includes('application/pdf') ||
        l.rel === 'self'
      );
      if (pdfLink?.URL) {
        pdfUrl = pdfLink.URL;
      }
    }

    // Check for publisher PDF
    if (work['published-print']?.['article-process'] ||
        work['published-online']?.['article-process']) {
      // Usually the DOI link leads to the publisher page with PDF
      if (work.DOI) {
        pdfUrl = `https://doi.org/${work.DOI}`;
      }
    }

    // Check for free PDF if available
    if (work['has_full_text'] === true && work['full_text']['application/pdf']) {
      pdfUrl = work['full_text']['application/pdf']['alternate'];
    }

    if (pdfUrl) {
      console.log(`Found PDF for: ${title.substring(0, 50)}...`);
      console.log(`  URL: ${pdfUrl}`);
      return pdfUrl;
    }

    console.log(`No PDF link found for: ${title.substring(0, 50)}...`);
    return null;

  } catch (error) {
    console.error(`Error fetching Crossref for "${title.substring(0, 50)}...":`, error.message);
    return null;
  }
}

async function updatePapersWithPDFLinks() {
  console.log('Fetching papers from Supabase...\n');

  try {
    const { data, error } = await supabase
      .from('visdrone_papers')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;

    console.log(`Found ${data?.length || 0} papers\n`);

    // Find papers without PDF links
    const papersWithoutPDF = data.filter(p => !p.pdf_url || p.pdf_url === '#');
    console.log(`Papers without PDF: ${papersWithoutPDF.length}\n`);

    let updatedCount = 0;
    let failedCount = 0;
    const results = [];

    // Process papers without PDF
    for (const paper of papersWithoutPDF) {
      console.log(`\nProcessing: ${paper.title}`);
      console.log(`  Authors: ${paper.authors}`);
      console.log(`  Year: ${paper.year}, Venue: ${paper.venue}`);

      const pdfUrl = await fetchCrossrefPDF(paper.title, paper.authors);

      if (pdfUrl) {
        // Update in database
        const { error: updateError } = await supabase
          .from('visdrone_papers')
          .update({ pdf_url: pdfUrl })
          .eq('id', paper.id);

        if (updateError) {
          console.log(`  Failed to update database: ${updateError.message}`);
          failedCount++;
        } else {
          console.log(`  Updated successfully!`);
          updatedCount++;
          results.push({ id: paper.id, title: paper.title, pdf_url: pdfUrl, status: 'success' });
        }
      } else {
        results.push({ id: paper.id, title: paper.title, pdf_url: null, status: 'not_found' });
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n=== Summary ===');
    console.log(`Total papers: ${data.length}`);
    console.log(`Papers without PDF before: ${papersWithoutPDF.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Failed to update: ${failedCount}`);
    console.log(`Not found in Crossref: ${papersWithoutPDF.length - updatedCount - failedCount}`);

    // Save results to file
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'crossref_update_results.json');
    await fs.writeFile(outputPath, JSON.stringify({ updatedCount, failedCount, results }, null, 2), 'utf-8');
    console.log(`\nResults saved to: ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

updatePapersWithPDFLinks();
