import json

# Define low-altitude intelligence tags based on task analysis
low_altitude_tags = {
    # Low-altitude environment perception (低空环境感知)
    'gsip': ['图学习', '增量学习'],
    'pshd': ['持续学习', '知识蒸馏'],
    'srtod': ['低空目标检测', '小目标检测'],
    'mrrfs': ['目标检测', '零样本学习'],
    'sl': ['多智能体', '协作学习'],
    'mvdscn': ['多视图学习', '子空间聚类'],
    'gcp-opt': ['深度学习优化', '协方差池化'],
    'moe-fusion': ['低空图像融合', '红外可见光融合'],
    'mp+': ['预训练微调', '模型优化'],
    'transmdot': ['低空目标跟踪', '无人机跟踪'],
    'aca-gan': ['多模态合成', '图像生成'],
    'openmix': ['开放集识别', '数据增强'],
    'mvke-fc': ['人脸跨域', '多视图学习'],
    'smpd-mindspore': ['多光谱检测', '行人检测'],
    'cmedfl': ['跨模态学习', '终身学习'],
    'detfusion': ['低空图像融合', '红外可见光融合'],
    'irc': ['跨模态检测', '行人检测'],
    'ssid-kd': ['知识蒸馏', '模型压缩'],
    'mgecl': ['多粒度学习', '聚类'],
    'cdrs': ['行人重识别', '跨域学习'],
    'slrnet': ['手语识别', '多模态'],
    'dronevehicle': ['低空车辆检测', '无人机', 'RGB-IR'],
    'cmpd': ['多光谱检测', '行人检测'],
    'hybrid-supervised': ['语义分割', '弱监督'],
    'lhgn': ['多视图聚类', '超图学习'],
    'r2sql': ['自然语言', '数据库'],
    'domain-adaptation': ['域适应', '迁移学习'],
    'recderain': ['图像增强', '去雨'],
    'prenet': ['图像增强', '去雨'],
    '3g-net': ['点云处理', '三维几何'],
    'bat': ['跟踪', '目标跟踪'],
    'ihat': ['异构图', '多模态聚类'],
    'vmtmn': ['多视图', '度量学习'],
    'sltm': ['手语识别', '时空建模'],
    'dsmn': ['深度子空间', '多视图聚类'],
    'iagc': ['图聚类', '不完整多视图'],
    'dsran': ['再识别', '跨域'],
    'dhn': ['超分辨率', '深度哈希'],
    'dspl': ['伪标签', '半监督'],
    'mdcnet': ['变化检测', '差异分析'],
    'cogniac': ['协同学习', '图卷积'],
    'dmran': ['多模态', '关系聚合'],
    'drnet': ['跨域', '度量学习'],
    'dsfdn': ['特征分解', '人脸识别'],
    'drsnt': ['关系网络', '知识蒸馏'],
    'mianet': ['多目标跟踪', '无人机'],
}

# Tag mapping
tag_mapping = {
    '低空图像融合': '低空环境感知',
    '红外可见光融合': '低空环境感知',
    '低空目标检测': '低空环境感知',
    '小目标检测': '低空环境感知',
    '多光谱检测': '低空环境感知',
    '行人检测': '低空环境感知',
    '车辆检测': '低空环境感知',
    '目标检测': '低空环境感知',
    '跟踪': '低空环境感知',
    '目标跟踪': '低空环境感知',
    '无人机跟踪': '低空环境感知',
    '无人机': '低空具身智能',
    '多智能体协作': '低空群体智能',
    '多智能体': '低空群体智能',
    '社会化学习': '低空群体智能',
    '协作学习': '低空群体智能',
    '终身学习': '低空具身智能',
    '持续学习': '低空具身智能',
    '增量学习': '低空具身智能',
    '图学习': '低空群体智能',
    '多视图聚类': '低空群体智能',
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

# Read models.ts
with open('D:/TRAEProjects/VisDrone/src/data/visdrone/models.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse models (simplified - we'll rebuild the array)
import re

# Extract all model objects
model_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*fullName:\s*'([^']+)',\s*description:\s*'([^']+)',\s*task:\s*'([^']+)',\s*paper:\s*\{[^}]+\},\s*features:\s*(\[[^\]]+\]),\s*github:\s*'([^']+)',\s*stars:\s*(\d+),\s*forks:\s*(\d+)\s*\}"

# Actually, let's just manually rebuild the sorted list with tags

models_data = [
    {'id': 'gsip', 'stars': 4, 'features': ['图增量学习', '信息保存', '类增量学习', '图学习']},
    {'id': 'pshd', 'stars': 8, 'features': ['持续同调', '半监督学习', '持续学习', '知识蒸馏']},
    {'id': 'srtod', 'stars': 45, 'features': ['小目标检测', '差异图', '显著性检测']},
    {'id': 'mrrfs', 'stars': 7, 'features': ['记忆机制', '零样本检测', '特征合成', '目标检测']},
    {'id': 'sl', 'stars': 7, 'features': ['社会化学习', '多智能体协作', '持续学习', '知识共享']},
]

# Get total stars by parsing
total_stars = 0
import re
stars_matches = re.findall(r"stars:\s*(\d+)", content)
for m in stars_matches:
    total_stars += int(m)

print(f"Total stars: {total_stars}")
print(f"Number of models with stars: {len(stars_matches)}")
