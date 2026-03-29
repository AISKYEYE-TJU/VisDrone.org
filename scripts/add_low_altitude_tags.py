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
    '人群': '低空环境感知',

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
    '模型压缩': '低空具身智能',
    '知识蒸馏': '低空具身智能',

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
    return sorted(list(tags))

# Find and replace each model's features line to add lowAltitudeTags
# Pattern to match features array
pattern = r"(features: (\[[^\]]+\]),)\n(\s+)(github:)"

# Process the file - we need to find all models and add lowAltitudeTags after features
lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if 'features:' in line and '[' in line and ']' in line:
        # Extract features array
        features_match = re.search(r"features: (\[[^\]]+\])", line)
        if features_match:
            features_str = features_match.group(1)
            # Parse features
            features = [f.strip().strip("'\"") for f in features_str.strip('[]').split(',')]
            features = [f for f in features if f]
            tags = get_low_altitude_tags(features)
            # Insert lowAltitudeTags line after features
            new_lines.append(line)
            # Find the line with github
            j = i + 1
            while j < len(lines) and 'github:' not in lines[j]:
                new_lines.append(lines[j])
                j += 1
            if j < len(lines):
                indent = '    '
                new_lines.append(f"{indent}lowAltitudeTags: {tags},")
                new_lines.append(lines[j])
                i = j + 1
                continue
    new_lines.append(line)
    i += 1

# Write the file
with open('D:/TRAEProjects/VisDrone/src/data/visdrone/models.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Added lowAltitudeTags to all models")

# Count total stars
stars_matches = re.findall(r"stars:\s*(\d+)", content)
total_stars = sum(int(m) for m in stars_matches)
print(f"Total stars: {total_stars}")
