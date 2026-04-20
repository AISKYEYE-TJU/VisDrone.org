import json
import requests
import time

# Load models data
with open('src/data/models_export.json', 'r', encoding='utf-8-sig') as f:
    models_data = json.load(f)

# Load papers data
with open('src/data/papers_cloud.json', 'r', encoding='utf-8-sig') as f:
    papers_data = json.load(f)

papers = papers_data.get('value', papers_data)
models = models_data.get('value', models_data)

print(f"Models: {len(models)}")
print(f"Papers: {len(papers)}")

# Create matching: match model github to paper by paper_title similarity
updates = []
matches = 0

for model in models:
    model_github = model.get('github')
    model_title = model.get('paper_title', '').lower()

    if not model_github or not model_title:
        continue

    # Find matching paper
    for paper in papers:
        paper_title = paper.get('title', '').lower()

        # Check if titles match (simplified matching)
        if model_title in paper_title or paper_title in model_title:
            if not paper.get('github'):
                updates.append({
                    'paper_id': paper.get('id'),
                    'paper_title': paper.get('title'),
                    'model_name': model.get('name'),
                    'github': model_github
                })
                matches += 1
                break

print(f"\nMatched {matches} papers with GitHub links")
print("\nUpdates to make:")

for u in updates:
    print(f"  {u['paper_id']}: {u['paper_title'][:50]}...")
    print(f"    <- {u['github']}")

# Save updates list
with open('src/data/github_updates.json', 'w', encoding='utf-8') as f:
    json.dump(updates, f, ensure_ascii=False, indent=2)

print(f"\nSaved {len(updates)} updates to src/data/github_updates.json")
