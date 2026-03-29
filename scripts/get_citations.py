import requests
import json
import time

def get_citation_count(title, year=None):
    """Query Semantic Scholar for citation count"""
    try:
        query = requests.utils.quote(title[:200])  # Limit query length
        url = f"https://api.semanticscholar.org/graph/v1/paper/search?query={query}&fields=citationCount,title,year&limit=3"

        headers = {
            'User-Agent': 'VisDrone-Research/1.0 (mailto:visdrone@tju.edu.cn)'
        }

        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code != 200:
            return None

        data = response.json()
        papers = data.get('data', [])

        if not papers:
            return None

        # Try to find best match by year if available
        best_match = None
        for paper in papers:
            if year and paper.get('year') == year:
                best_match = paper
                break

        # Use first result if no year match
        if not best_match:
            best_match = papers[0]

        return best_match.get('citationCount', 0)

    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    # Load papers from cloud
    papers = [
        {"id": "paper-5", "title": "CtrlFuse: Mask-Prompt Guided Controllable Infrared and Visible Image Fusion", "year": 2026},
        {"id": "paper-37", "title": "Every Node is Different: Dynamically Fusing Self-Supervised Tasks for Attributed Graph Clustering", "year": 2024},
    ]

    results = []
    for paper in papers:
        print(f"Querying: {paper['title'][:60]}...")
        citations = get_citation_count(paper['title'], paper.get('year'))
        print(f"  Citations: {citations}")
        results.append({
            'id': paper['id'],
            'title': paper['title'],
            'citations': citations
        })
        time.sleep(0.5)

    with open('src/data/citation_test.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("\nResults saved to src/data/citation_test.json")

if __name__ == "__main__":
    main()
