import re

# Read the file
with open('D:/TRAEProjects/VisDrone/src/data/visdrone/models.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define tag mapping for low-altitude intelligence
tag_mapping = {
    # Low-altitude environment perception (低空环境感知)
    '低空图像融合': '低空环境感知',
    '红外可见光融合': '低空环境感知',
    '低空目标检测': '低空环境感知',
    '小目标检测': '低空环境感知',
    '多光谱检测': '低空环境感知',
    '行人检测': '低空环境感知',
    '车辆检测': '低空环境感知',
    '目标检测': '低空环境感知',
    '图像融合': '低空环境感知',
    '跟踪': '低空环境感知',
    '目标跟踪': '低空环境感知',
    '无人机跟踪': '低空环境感知',
    '人群计数': '低空环境感知',
    '多模态跟踪': '低空环境感知',
    '无人机单目标跟踪': '低空环境感知',
    '多无人机单目标跟踪': '低空环境感知',
    '多无人机多目标跟踪': '低空环境感知',

    # Low-altitude embodied intelligence (低空具身智能)
    '无人机': '低空具身智能',
    '终身学习': '低空具身智能',
    '持续学习': '低空具身智能',
    '增量学习': '低空具身智能',
    '半监督持续学习': '低空具身智能',
    '半监督学习': '低空具身智能',
    '弱监督': '低空具身智能',
    '零样本': '低空具身智能',
    '图像增强': '低空具身智能',
    '图像去雨': '低空具身智能',
    '图像去模糊': '低空具身智能',

    # Low-altitude swarm intelligence (低空群体智能)
    '多智能体协作': '低空群体智能',
    '多智能体': '低空群体智能',
    '社会化学习': '低空群体智能',
    '协作学习': '低空群体智能',
    '图学习': '低空群体智能',
    '多视图聚类': '低空群体智能',
    '图聚类': '低空群体智能',
    '多视图学习': '低空群体智能',
    '多模态聚类': '低空群体智能',
    '图神经网络': '低空群体智能',
}

def get_low_altitude_tags(features):
    tags = set()
    for f in features:
        for key, tag in tag_mapping.items():
            if key in f:
                tags.add(tag)
    if not tags:
        tags.add('低空环境感知')  # default
    return list(tags)

# Extract all models
model_pattern = r"\{\s*\n?\s*id:\s*'([^']+)',\s*\n?\s*name:\s*'([^']+)',\s*\n?\s*fullName:\s*'([^']+)',\s*\n?\s*description:\s*'([^']+)',\s*\n?\s*task:\s*'([^']+)',\s*\n?\s*paper:\s*\{[^}]+\},\s*\n?\s*features:\s*(\[[^\]]+\]),\s*\n?\s*github:\s*'([^']+)',\s*\n?\s*(?:paperUrl:\s*'([^']+)'|)\s*\n?\s*stars:\s*(\d+),\s*\n?\s*forks:\s*(\d+)\s*\}"

models = re.findall(model_pattern, content, re.MULTILINE)
print(f"Found {len(models)} models")

# Sort by stars (descending)
models_sorted = sorted(models, key=lambda x: int(x[9]), reverse=True)

# Print top 10
print("\nTop 10 models by stars:")
for i, m in enumerate(models_sorted[:10]):
    print(f"{i+1}. {m[1]} ({m[0]}): {m[9]} stars")

# Count total stars
total_stars = sum(int(m[9]) for m in models)
print(f"\nTotal stars: {total_stars}")
