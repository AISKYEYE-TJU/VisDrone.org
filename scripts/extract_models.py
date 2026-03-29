import re

with open('D:/TRAEProjects/VisDrone/src/data/visdrone/models.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all models with github, stars, features
pattern = r"\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',\s*\n\s*fullName:\s*'([^']+)',\s*\n\s*description:\s*'([^']+)',\s*\n\s*task:\s*'([^']+)',\s*\n\s*paper:\s*\{[^}]+\},\s*\n\s*features:\s*(\[[^\]]+\]),\s*\n\s*lowAltitudeTags:\s*(\[[^\]]+\]),\s*\n\s*github:\s*'([^']+)',\s*\n\s*(?:paperUrl:\s*'[^']*',\s*)?stars:\s*(\d+),\s*\n\s*forks:\s*(\d+)\s*\}"

models = re.findall(pattern, content, re.MULTILINE)

# Filter models with github and stars > 0
valid_models = [(m[0], m[1], m[3], m[5], m[7], int(m[8])) for m in models if m[7] and int(m[8]) > 0]

# Sort by stars descending
valid_models.sort(key=lambda x: x[5], reverse=True)

# Generate output
for i, (id, name, desc, features, github, stars) in enumerate(valid_models):
    # Parse features
    feature_list = [f.strip().strip("'\"") for f in features.strip('[]').split(',')]
    feature_list = [f for f in feature_list if f][:4]  # Take first 4 features
    
    # Convert to tags (simplified)
    tags = feature_list[:2] if feature_list else ['模型']

    print(f"  {{")
    print(f"    name: '{name}',")
    print(f"    url: '{github}',")
    desc_short = desc[:60] + '...' if len(desc) > 60 else desc
    print(f"    description: '{desc_short}',")
    tags_str = "', '".join(tags[:2])
    print(f"    tags: ['{tags_str}'],")
    print(f"    modelId: '{id}',")
    print(f"    stars: {stars}")
    if i < len(valid_models) - 1:
        print(f"  }},")
    else:
        print(f"  }}")

print(f"\n// Total: {len(valid_models)} repos with stars > 0")
print(f"// Total stars: {sum(m[5] for m in valid_models)}")
