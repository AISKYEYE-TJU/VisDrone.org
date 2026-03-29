import requests
import json
import time

def fetch_crossref_pdf(title, authors):
    """Query Crossref API to get PDF link for a paper"""
    try:
        query = requests.utils.quote(title)
        url = f"https://api.crossref.org/works?query={query}&rows=1"

        headers = {
            'User-Agent': 'VisDrone-Research/1.0 (mailto:visdrone@tju.edu.cn)'
        }

        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            return None

        data = response.json()
        items = data.get('message', {}).get('items', [])

        if not items:
            return None

        work = items[0]

        # Try to find PDF URL
        pdf_url = None

        # Check DOI URL
        if work.get('DOI'):
            pdf_url = f"https://doi.org/{work['DOI']}"

        # Check for PDF links
        if work.get('link'):
            for link in work['link']:
                if 'pdf' in link.get('content-type', '').lower() or link.get('rel') == 'self':
                    pdf_url = link.get('URL')
                    break

        return pdf_url

    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    # Load papers
    with open('src/data/papers_cloud.json', 'r', encoding='utf-8-sig') as f:
        papers_data = json.load(f)

    papers = papers_data.get('value', papers_data)

    print(f"Total papers: {len(papers)}")

    # Find papers without PDF
    papers_without_pdf = [p for p in papers if not p.get('pdf_url') or p['pdf_url'] == '#']
    print(f"Papers without PDF: {len(papers_without_pdf)}")

    results = []
    updated = 0

    for i, paper in enumerate(papers_without_pdf[:20]):  # Process first 20 without PDF
        title = paper.get('title', '')
        print(f"\n[{i+1}/{len(papers_without_pdf)}] Processing: {title[:60]}...")

        pdf_url = fetch_crossref_pdf(title, paper.get('authors', []))

        if pdf_url:
            print(f"  Found: {pdf_url}")
            results.append({
                'id': paper.get('id'),
                'title': title,
                'pdf_url': pdf_url,
                'status': 'success'
            })
            updated += 1
        else:
            print(f"  Not found")
            results.append({
                'id': paper.get('id'),
                'title': title,
                'pdf_url': None,
                'status': 'not_found'
            })

        time.sleep(0.5)  # Rate limiting

    print(f"\n=== Summary ===")
    print(f"Updated: {updated}")
    print(f"Not found: {len(results) - updated}")

    # Save results
    with open('src/data/crossref_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("\nResults saved to src/data/crossref_results.json")

if __name__ == "__main__":
    main()
