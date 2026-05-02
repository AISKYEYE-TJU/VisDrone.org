---
name: "fetch-conference-papers"
description: "Fetch academic conference papers metadata from DBLP API and integrate into local paper library. Invoke when user needs to add new conference papers (e.g., AAAI, IJCAI, KDD) to the paper database or update existing conference data."
---

# Fetch Conference Papers Skill

This skill provides a standardized workflow for fetching academic conference papers metadata from DBLP API and integrating them into the local paper library.

## When to Use

- Adding a new conference to the paper database (e.g., AAAI, IJCAI, KDD, SIGIR)
- Updating existing conference paper data
- User asks to fetch papers from a specific conference
- User wants to expand the CCF-A paper library

## Supported Conferences

The current paper library includes:
- **CVPR** - IEEE/CVF Conference on Computer Vision and Pattern Recognition
- **ICCV** - IEEE/CVF International Conference on Computer Vision
- **ICLR** - International Conference on Learning Representations
- **NeurIPS** - Conference on Neural Information Processing Systems
- **ICML** - International Conference on Machine Learning
- **ACL** - Annual Meeting of the Association for Computational Linguistics
- **CHI** - ACM CHI Conference on Human Factors in Computing Systems
- **ICRA** - IEEE International Conference on Robotics and Automation
- **AAAI** - AAAI Conference on Artificial Intelligence

## Data Source

### DBLP API
- **API Endpoint**: `https://dblp.org/search/publ/api`
- **Query Format**: `toc:db/conf/{conference}/{conference}{year}.bht:`
- **Parameters**:
  - `q`: Query string
  - `h`: Number of results per page (max 1000)
  - `f`: Offset for pagination
  - `format`: json

### Example Query
```
https://dblp.org/search/publ/api?q=toc:db/conf/aaai/aaai2024.bht:&h=1000&format=json
```

## Data Format Specifications

### Paper Data Format

Each paper should contain the following fields:

```json
{
  "title": "Paper Title",
  "authors": ["Author 1", "Author 2"],
  "year": "2024",
  "conference": "AAAI",
  "venue": "AAAI",
  "pages": "123-130",
  "doi": "10.1609/AAAI.V38I1.12345",
  "paperUrl": "https://ojs.aaai.org/index.php/AAAI/article/view/12345",
  "pdfLink": "https://ojs.aaai.org/index.php/AAAI/article/view/12345/12345",
  "id": "conf/aaai/author24"
}
```

### ⚠️ CRITICAL: conference-index.json Format

The `conference-index.json` file MUST use **object format** (not array format) to match the frontend code expectations:

**✅ Correct Format (Object):**
```json
{
  "CVPR": {
    "total": 18452,
    "years": {
      "2024": true,
      "2023": true,
      "2022": true
    }
  },
  "AAAI": {
    "total": 17133,
    "years": {
      "2024": true,
      "2023": true
    }
  }
}
```

**❌ Wrong Format (Array):**
```json
[
  { "id": "cvpr", "name": "CVPR", "total_papers": 18452, "years": ["2024", "2023"] }
]
```

**Key Differences:**
- Use **object** with conference name as key, not array
- Field name is `total`, not `total_papers`
- `years` is an **object** with year as key and `true` as value, not an array

### ccf-papers-stats.json Format

```json
{
  "total_papers": 126872,
  "conference_counts": {
    "CVPR": 18452,
    "AAAI": 17133
  },
  "year_counts": {
    "2024": 25000,
    "2023": 24000
  },
  "recent_years": {
    "2024": 25000,
    "2023": 24000
  },
  "major_conferences": {
    "NeurIPS": 30727,
    "CVPR": 18452,
    "AAAI": 17133
  }
}
```

## Implementation Steps

### Step 1: Create Fetch Script

Create a Python script in `scripts/` directory:

```python
import os
import json
import requests
import time

def fetch_papers_from_dblp(conference, year, offset=0, h=1000):
    """Fetch papers from DBLP API"""
    api_url = "https://dblp.org/search/publ/api"
    query = f"toc:db/conf/{conference.lower()}/{conference.lower()}{year}.bht:"
    
    params = {
        'q': query,
        'h': h,
        'f': offset,
        'format': 'json'
    }
    
    response = requests.get(api_url, params=params, timeout=120)
    return response.json() if response.status_code == 200 else None

def parse_dblp_data(data, year, conference):
    """Parse DBLP API response"""
    papers = []
    if not data or 'result' not in data:
        return papers, 0
    
    hits = data['result'].get('hits', {})
    total = int(hits.get('@total', 0))
    hit_list = hits.get('hit', [])
    
    for hit in hit_list:
        info = hit.get('info', {})
        paper = {
            'title': info.get('title', ''),
            'authors': [],
            'year': str(year),
            'conference': conference,
            'venue': conference,
            'pages': info.get('pages', ''),
            'doi': info.get('doi', ''),
            'paperUrl': info.get('ee', ''),
            'pdfLink': info.get('ee', ''),
            'id': info.get('key', '')
        }
        
        # Parse authors
        authors_info = info.get('authors', {})
        if authors_info:
            author_list = authors_info.get('author', [])
            if isinstance(author_list, list):
                paper['authors'] = [a.get('text', '') for a in author_list if isinstance(a, dict)]
            elif isinstance(author_list, dict):
                paper['authors'] = [author_list.get('text', '')]
        
        if paper['title']:
            papers.append(paper)
    
    return papers, total

def fetch_all_papers(conference, year, max_retries=3):
    """Fetch all papers for a conference year"""
    all_papers = []
    offset = 0
    retry_count = 0
    
    while True:
        data = fetch_papers_from_dblp(conference, year, offset)
        if data:
            papers, total = parse_dblp_data(data, year, conference)
            all_papers.extend(papers)
            print(f"Fetched {len(papers)} papers, total: {len(all_papers)}/{total}")
            
            if len(all_papers) >= total or len(papers) < 1000:
                break
            offset += 1000
            retry_count = 0
            time.sleep(10)
        else:
            retry_count += 1
            if retry_count >= max_retries:
                break
            time.sleep(30)
    
    return all_papers
```

### Step 2: PDF Link Optimization

For conferences with specific PDF hosting (like AAAI), convert DOI to direct PDF links:

```python
def optimize_pdf_links(papers, conference):
    """Optimize PDF links for specific conferences"""
    if conference == 'AAAI':
        for paper in papers:
            doi = paper.get('doi', '')
            if doi and '10.1609/AAAI' in doi:
                article_id = doi.split('.')[-1]
                paper['pdfLink'] = f"https://ojs.aaai.org/index.php/AAAI/article/view/{article_id}/{article_id}"
                paper['paperUrl'] = f"https://ojs.aaai.org/index.php/AAAI/article/view/{article_id}"
    return papers
```

### Step 3: Save Data

```python
def save_papers(papers, conference, year):
    """Save papers to JSON file"""
    output_dir = f'public/cvf-papers/{conference}'
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, f'{year}.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(papers)} papers to {output_file}")
```

### Step 4: Update Index Files (CRITICAL)

After adding new papers, MUST update the index files with correct format:

```python
def get_papers_from_directory(conf_dir):
    """从目录获取论文数据"""
    papers = []
    if os.path.exists(conf_dir):
        json_files = glob.glob(os.path.join(conf_dir, '*.json'))
        for json_file in json_files:
            with open(json_file, 'r', encoding='utf-8') as f:
                file_papers = json.load(f)
            papers.extend(file_papers)
    return papers

def update_conference_index():
    """更新会议索引文件 - 使用对象格式以匹配前端代码"""
    
    cvf_dir = 'public/cvf-papers'
    conferences = ['CVPR', 'ICCV', 'ICLR', 'NeurIPS', 'ICML', 'ACL', 'CHI', 'ICRA', 'AAAI']
    
    # ⚠️ 使用对象格式，匹配前端代码期望的格式
    conference_index = {}
    
    for conf in conferences:
        conf_dir = os.path.join(cvf_dir, conf)
        chunks_dir = os.path.join(cvf_dir, 'chunks', conf)
        
        years_dict = {}
        total_papers = 0
        
        # 优先检查主目录
        if os.path.exists(conf_dir):
            json_files = glob.glob(os.path.join(conf_dir, '*.json'))
            for json_file in json_files:
                year = os.path.basename(json_file).replace('.json', '')
                if year.isdigit():
                    with open(json_file, 'r', encoding='utf-8') as f:
                        papers = json.load(f)
                    years_dict[year] = True  # ⚠️ 使用对象格式
                    total_papers += len(papers)
        
        # 只有当主目录没有数据时，才使用 chunks 目录
        if not years_dict and os.path.exists(chunks_dir):
            json_files = glob.glob(os.path.join(chunks_dir, '*.json'))
            for json_file in json_files:
                year = os.path.basename(json_file).replace('.json', '')
                if year.isdigit():
                    with open(json_file, 'r', encoding='utf-8') as f:
                        papers = json.load(f)
                    years_dict[year] = True
                    total_papers += len(papers)
        
        if years_dict:
            conference_index[conf] = {
                'total': total_papers,  # ⚠️ 使用 'total' 而不是 'total_papers'
                'years': years_dict     # ⚠️ 使用对象格式
            }
    
    index_file = os.path.join(cvf_dir, 'conference-index.json')
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(conference_index, f, ensure_ascii=False, indent=2)
```

### Step 5: Update Statistics

```python
def update_ccf_stats():
    """更新CCF论文统计信息 - 避免重复统计"""
    
    cvf_dir = 'public/cvf-papers'
    conferences = ['CVPR', 'ICCV', 'ICLR', 'NeurIPS', 'ICML', 'ACL', 'CHI', 'ICRA', 'AAAI']
    
    conference_counts = {}
    year_counts = {}
    total_papers = 0
    
    for conf in conferences:
        conf_dir = os.path.join(cvf_dir, conf)
        chunks_dir = os.path.join(cvf_dir, 'chunks', conf)
        
        # 优先使用主目录，如果主目录有数据则不使用 chunks 目录
        papers = get_papers_from_directory(conf_dir)
        
        # 只有当主目录没有数据时，才使用 chunks 目录
        if not papers:
            papers = get_papers_from_directory(chunks_dir)
        
        conf_total = len(papers)
        total_papers += conf_total
        
        for paper in papers:
            year = str(paper.get('year', 'unknown'))
            if year not in year_counts:
                year_counts[year] = 0
            year_counts[year] += 1
        
        if conf_total > 0:
            conference_counts[conf] = conf_total
    
    sorted_year_counts = dict(sorted(year_counts.items(), key=lambda x: x[0]))
    
    stats = {
        'total_papers': total_papers,
        'conference_counts': conference_counts,
        'year_counts': sorted_year_counts,
        'recent_years': {y: sorted_year_counts.get(y, 0) for y in ['2025', '2024', '2023', '2022', '2021']},
        'major_conferences': {c: conference_counts.get(c, 0) for c in ['NeurIPS', 'ICML', 'ICLR', 'CVPR', 'AAAI']}
    }
    
    stats_file = os.path.join(cvf_dir, 'ccf-papers-stats.json')
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
```

## Important Notes

### DBLP API Stability & Rate Limiting

DBLP API can be unstable and may return errors or rate-limit responses. Best practices:

1. **Test API First**: Always test with a small request (h=5) to check if API is available
2. **Delay Between Requests**: Use 15-30 second delays between requests to avoid rate limiting
3. **Handle Errors Gracefully**: 
   - 200: Success
   - 403/429: Rate limited - wait longer and retry
   - 500/503: Server error - wait and retry
4. **Incremental Fetching**: Fetch one year at a time to minimize risk
5. **Check Existing Data**: Skip years that already have data to avoid duplicates
6. **User-Agent**: Include proper User-Agent header

### Example Error Handling
```python
headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; AcademicBot/1.0)'
}

response = requests.get(url, headers=headers, timeout=30)
if response.status_code == 200:
    data = response.json()
elif response.status_code in [403, 429]:
    print("Rate limited, waiting 60s...")
    time.sleep(60)
    # Retry
elif response.status_code in [500, 503]:
    print("Server error, waiting 30s...")
    time.sleep(30)
    # Retry
```

### Avoid Duplicate Counting
- **Main directory** (`public/cvf-papers/{CONF}/`) takes priority
- **Chunks directory** (`public/cvf-papers/chunks/{CONF}/`) is fallback only
- Never count both directories for the same conference
- Check existing years before fetching to avoid duplicates

### Conference-Specific PDF Links
- **AAAI**: Use DOI link directly: `https://doi.org/{doi}` (most reliable)
- **CVPR/ICCV**: `https://openaccess.thecvf.com/content/{year}/...`
- **ICLR**: `https://openreview.net/pdf?id={id}`
- **NeurIPS**: `https://papers.nips.cc/paper_files/paper/{year}/...`
- **CHI**: Use DOI link: `https://doi.org/{doi}`

## File Locations

```
public/cvf-papers/
├── {CONFERENCE}/           # Main paper data (priority)
│   ├── 2024.json
│   └── 2025.json
├── chunks/                 # Chunked paper data (fallback)
│   └── {CONFERENCE}/
├── ccf-papers-stats.json   # Statistics
├── papers-index.json       # Paper index
└── conference-index.json   # Conference index (MUST be object format!)

scripts/
├── fetch_{conf}_from_dblp.py    # Conference-specific fetch script
└── update_aaai_to_library.py    # Index update script (reference implementation)
```

## Example Usage

```bash
# Fetch AAAI papers for years 2013-2025
python scripts/fetch_aaai_from_dblp.py

# Update all index files (MUST run after fetching)
python scripts/update_aaai_to_library.py
```

## Troubleshooting

1. **Empty results**: Check conference name format in DBLP URL
2. **Rate limiting**: Increase delay between requests
3. **Missing PDF links**: Some papers may not have PDF available
4. **Duplicate data**: Ensure you're not counting both main and chunks directories
5. **Frontend shows 0 papers**: Check `conference-index.json` format - must be object format with `total` and `years` as object

## Reference Implementation

See `scripts/update_aaai_to_library.py` for the complete working implementation that handles:
- Fetching papers from DBLP API
- PDF link optimization for AAAI
- Index file updates with correct format
- Avoiding duplicate counting
