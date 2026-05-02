#!/usr/bin/env python3
"""
将 PDF 链接匹配到专利和获奖数据，并更新 visdroneService.ts
"""

import json
import re

# 专利 PDF 链接 (从 found_pdfs.json)
patent_pdfs = {
    "一种用于智能家电语音控制性能测试的机器人": "https://aiskyeye.com/wp-content/uploads/2025/04/一种用于智能家电语音控制性能测试的机器人.pdf",
    "一种基于集成异构图注意力网络的缺失多视图聚类方法": "https://aiskyeye.com/wp-content/uploads/2025/04/一种基于集成异构图注意力网络的缺失多视图聚类方法-发明专利证书.pdf",
    "一种基于机器人的实时语义地图生成方法及装置": "https://aiskyeye.com/wp-content/uploads/2025/04/一种基于机器人的实时语义地图生成方法及装置-发明专利证书.pdf",
    "一种用于智能终端语音交互的检测方法及系统": "https://aiskyeye.com/wp-content/uploads/2024/12/2022109603070一种用于智能终端语音交互的检测方法及系统-发明专利证书.pdf",
    "一种吊臂车作业场景下行人违规逗留的景深判别方法": "https://aiskyeye.com/wp-content/uploads/2024/11/15-一种吊臂车作业场景下行人违规逗留的景深判别方法.pdf",
    "一种用于多模态目标跟踪的对象感知图像融合方法": "https://aiskyeye.com/wp-content/uploads/2024/11/9一种用于多模态目标跟踪的对象感知图像融合方法.pdf",
    "一种基于全卷积神经网络的遥感图像语义分割方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/19-一种基于全卷积神经网络的遥感图像语义分割方法及装置.pdf",
    "基于递归图神经网络解决边缘过平滑的方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/18-基于递归图神经网络解决边缘过平滑的方法及装置.pdf",
    "一种基于时域注意力池化网络的动图分类方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/12-一种基于时域注意力池化网络的动图分类方法及装置.pdf",
    "一种考虑多粒度类相关性的对比式开放集识别方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/20-一种考虑多粒度类相关性的对比式开放集识别方法及装置.pdf",
    "一种基于不确定感知网络的双光车辆检测方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/10-一种基于不确定感知网络的双光车辆检测方法及装置.pdf",
    "一种基于语音交互的智能家电智能化水平测试系统及方法": "https://aiskyeye.com/wp-content/uploads/2024/11/1-一种基于语音交互的智能家电智能化水平测试系统及方法.pdf",
    "基于动态紧凑记忆嵌入的可变形单目标跟踪方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/16-基于动态紧凑记忆嵌入的可变形单目标跟踪方法及装置.pdf",
    "一种基于多智能体分层强化学习的迷宫导航方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/14-一种基于多智能体分层强化学习的迷宫导航方法及装置.pdf",
    "基于自适应相关滤波特征融合学习的视觉跟踪方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/17-基于自适应相关滤波特征融合学习的视觉跟踪方法及装置.pdf",
    "一种用于家电智能化水平测试的测试系统": "https://aiskyeye.com/wp-content/uploads/2024/11/2-一种用于家电智能化水平测试的测试系统-1.pdf",
    "基于自监督低秩网络的半监督图像语义分割方法及装置": "https://aiskyeye.com/wp-content/uploads/2024/11/11-基于自监督低秩网络的半监督图像语义分割方法及装置.pdf",
    "基于数据共享的多智能体协同跟踪方法、装置及存储介质": "https://aiskyeye.com/wp-content/uploads/2024/11/13-基于数据共享的多智能体协同跟踪方法、装置及存储介质.pdf",
    "一种人机协同的图像分割与标注方法": "https://aiskyeye.com/wp-content/uploads/2024/11/3-一种人机协同的图像分割与标注方法.pdf",
    "一种基于正射影像图对比的河道异常检测方法": "https://aiskyeye.com/wp-content/uploads/2024/11/5-一种基于正射影像图对比的河道异常检测方法.pdf",
    "一种基于全自动学习的目标检测方法": "https://aiskyeye.com/wp-content/uploads/2024/11/6-一种基于全自动学习的目标检测方法-1.pdf",
    "一种基于图正则光流注意力网络的动物计数方法": "https://aiskyeye.com/wp-content/uploads/2024/11/8-一种基于图正则光流注意力网络的动物计数方法.pdf",
    "一种人机协同的图像目标检测半自动标注方法": "https://aiskyeye.com/wp-content/uploads/2024/11/4-一种人机协同的图像目标检测半自动标注方法-1.pdf",
    "基于时空多尺度网络的人流密度估计、定位和跟踪方法": "https://aiskyeye.com/wp-content/uploads/2024/11/7-基于时空多尺度网络的人流密度估计、定位和跟踪方法-2.pdf",
}

# 获奖 PDF 链接
award_pdfs = {
    "昇腾AI创新大赛2024天津赛区金奖": "https://aiskyeye.com/wp-content/uploads/2024/11/26-昇腾AI创新大赛2024天津赛区金奖（2024年度）-1.pdf",
    "第九届": "https://aiskyeye.com/wp-content/uploads/2024/11/第九届互联网大学生创新创业大赛天津赛区金奖.pdf",
    "中国国际大学生创新大赛国际赛道银奖": "https://aiskyeye.com/wp-content/uploads/2024/11/中国国际大学生创新大赛国际赛道银奖.pdf",
    "CVPR 2023 Object Discovery Challenge冠军": "https://aiskyeye.com/wp-content/uploads/2024/11/CVPR-Object-Discovery-Challenge竞赛冠军（2023年度）.pdf",
    "CVPR 2023 CLVision Challenge": "https://aiskyeye.com/wp-content/uploads/2024/11/CLVision-Challenge-2023.pdf",
    "天津市科技进步二等奖": "https://aiskyeye.com/wp-content/uploads/2024/11/天津市科技进步二等奖.pdf",
    "第三届\"无人争锋\"挑战赛使命召唤冠军": "https://aiskyeye.com/wp-content/uploads/2024/11/24-第三届无人争锋挑战赛使命召唤冠军（2023年度）最小压缩版.pdf",
    "世界智能驾驶挑战赛智慧交通沙盘赛银奖": "https://aiskyeye.com/wp-content/uploads/2024/11/20-世界智能驾驶挑战赛智慧交通沙盘赛银奖（2023年度）-1.pdf",
    "CVPR 2022 VQA竞赛冠军": "https://aiskyeye.com/wp-content/uploads/2024/11/17-CVPR-2022-VQA竞赛冠军-（2022年度）.pdf",
    "挑战杯": "https://aiskyeye.com/wp-content/uploads/2024/11/16-挑战杯中国银行天津市大学生创业计划竞赛金奖（2022年度）.pdf",
    "第七届": "https://aiskyeye.com/wp-content/uploads/2024/11/14-第七届互联网大学生创新创业大赛天津赛区金奖2021年度.pdf",
    "CVPR 2021非完全数据挑战赛亚军": "https://aiskyeye.com/wp-content/uploads/2024/11/13-CVPR-2021非完全数据挑战赛亚军-（2021年度）.pdf",
    "吴文俊人工智能优秀青年奖": "https://aiskyeye.com/wp-content/uploads/2024/11/12-吴文俊人工智能优秀青年奖（2021年度）.pdf",
    "中国智能交通协会科技进步二等奖": "https://aiskyeye.com/wp-content/uploads/2024/11/2021智能交通协会科技进步奖二等奖.pdf",
    "ICME 2021最佳论文奖": "https://aiskyeye.com/wp-content/uploads/2024/11/icme2021-1.pdf",
    "CVPR 2020最有影响力15篇论文": "https://aiskyeye.com/wp-content/uploads/2024/11/9-CVPR-2020最有影响力15篇论文（2020年度）.pdf",
    "中国智能汽车大赛高速公路自动驾驶比赛一等奖": "https://aiskyeye.com/wp-content/uploads/2024/11/8-中国智能汽车大赛高速公路自动驾驶比赛一等奖（2020年度）-1.pdf",
    "天津市创新人才推进计划青年科技优秀人才": "https://aiskyeye.com/wp-content/uploads/2024/11/7-天津市创新人才推进计划青年科技优秀人才（2020年度）.pdf",
    "天津市青年人才托举工程": "https://aiskyeye.com/wp-content/uploads/2024/11/6-天津市青年人才托举工程（2019年度）.pdf",
    "天津市工程专业硕士学位硕士研究生优秀论文奖": "https://aiskyeye.com/wp-content/uploads/2024/11/5-天津市工程专业硕士学位硕士研究生优秀论文奖（2019年度）.pdf",
    "CCML2017最佳学生论文": "https://aiskyeye.com/wp-content/uploads/2024/11/4-CCML2017最佳学生论文（2017年度）-1.pdf",
    "PRICAI2016最佳论文提名奖": "https://aiskyeye.com/wp-content/uploads/2024/11/3-PRICAI2016最佳论文提名奖（2016年度）.pdf",
    "黑龙江省自然科学一等奖": "https://aiskyeye.com/wp-content/uploads/2024/11/2-黑龙江省自然科学一等奖（2016年度）-1.pdf",
    "黑龙江省高校科学技术一等奖": "https://aiskyeye.com/wp-content/uploads/2024/11/1-黑龙江省高校自然科学一等奖（2015年度）-4.pdf",
}

# 专利数据
patents = [
    {"id": "1", "title": "基于多视图知识集成和频率一致性的人脸跨域翻译方法", "inventors": ["曹兵", "王清和", "朱鹏飞", "胡清华", "赵佳鸣", "毕志伟", "亓国栋", "孙一铭", "高毓聪", "曹亚如"], "number": "CN 120088145 B", "date": "2025"},
    {"id": "2", "title": "基于分布不确定性的多模态特征迁移人群计数方法及装置", "inventors": ["曹亚如", "朱鹏飞", "曹兵", "孙一铭", "胡清华"], "number": "CN 120088144 B", "date": "2025"},
    {"id": "3", "title": "基于递归式融合转换单元的多模态图像合成方法及装置", "inventors": ["赵佳鸣", "曹兵", "朱鹏飞", "胡清华"], "number": "ZL 2025 1 0028210.X", "date": "2025-11-04"},
    {"id": "4", "title": "基于推理高效的动态优化早退模型、方法、系统及设备", "inventors": ["罗立伟", "王旗龙", "任冬伟", "朱鹏飞", "胡清华"], "number": "ZL 2024 1 1921894.8", "date": "2025-10-31"},
    {"id": "5", "title": "一种基于动态相对性增强的图像融合方法及装置", "inventors": ["徐兴歆", "曹兵", "朱鹏飞", "胡清华"], "number": "ZL 2025 1 0093976.6", "date": "2025-12-26"},
    {"id": "6", "title": "基于文本引导的视频到文本离散的视频识别方法及装置", "inventors": ["王月新", "朱文成", "朱鹏飞", "胡清华"], "number": "ZL 2024 1 1711502.5", "date": "2025-10-28"},
    {"id": "7", "title": "人群计数的方法、装置、电子设备、存储介质", "inventors": ["朱鹏飞", "张敬林", "王星", "张问银", "王九如", "王兴华"], "number": "ZL 2024 1 0543567.7", "date": "2024-08-30"},
    {"id": "8", "title": "一种无人机多模态跟踪方法", "inventors": ["朱鹏飞", "张敬林", "王星", "张问银", "王九如", "王兴华"], "number": "ZL 2024 1 0369741.0", "date": "2024-06-25"},
    {"id": "9", "title": "一种基于弱监督双流视觉语言交互的答案定位方法及装置", "inventors": ["朱鹏飞", "刘轶", "陈冠林", "胡清华"], "number": "ZL 2023 1 0067972.1", "date": "2025-08-26"},
    {"id": "10", "title": "一种基于关系嵌入的图像合成的方法、装置及存储介质", "inventors": ["朱鹏飞", "贾安", "汪廉杰", "刘洋"], "number": "ZL 2021 1 1457354.5", "date": "2025-02-07"},
]

# 获奖数据
awards = [
    {"id": "1", "title": "吴文俊人工智能科学技术奖科技进步一等奖", "authors": ["朱鹏飞", "齐俊桐", "于宏志", "胡清华", "孙一铭", "仇梓峰", "王明明", "王煜", "曹兵", "靳锴", "瞿关明", "任冬伟", "张云", "赵少阳", "平原"], "venue": "中国人工智能学会", "date": "2024"},
    {"id": "2", "title": "昇腾AI创新大赛2024全国总决赛高校赛道铜奖", "authors": ["冯杰康", "李想", "姚海屿", "姚鑫杰"], "venue": "华为", "date": "2024"},
    {"id": "3", "title": "昇腾AI创新大赛2024天津赛区金奖", "authors": ["冯杰康", "姚海屿", "姚鑫杰", "李想"], "venue": "华为", "date": "2024"},
    {"id": "4", "title": "第九届\"互联网+\"大学生创新创业大赛天津赛区金奖", "authors": ["赵秋多", "王沛", "姚海屿", "周鑫", "王铭宇", "张鹏程"], "venue": "天津大学", "date": "2023"},
    {"id": "5", "title": "中国国际大学生创新大赛国际赛道银奖", "authors": ["张庭赫", "Suhaib Suhaib"], "venue": "", "date": "2023"},
    {"id": "6", "title": "CVPR 2023 Object Discovery Challenge冠军", "authors": ["王茂林", "陈曦", "穆郡贤"], "venue": "CVPR", "date": "2023"},
    {"id": "7", "title": "CVPR 2023 CLVision Challenge 亚军", "authors": ["朱之林", "范妍", "陈慧彤", "季罗娜", "姚鑫杰", "穆郡贤"], "venue": "CVPR", "date": "2023"},
    {"id": "8", "title": "天津市科技进步二等奖", "authors": ["谢津平", "朱鹏飞", "王旗龙", "奚歌", "张云姣", "詹昊", "许健", "曹兵"], "venue": "天津市人民政府", "date": "2023"},
    {"id": "9", "title": "天津大学十佳杰出青年(教工)", "authors": ["朱鹏飞"], "venue": "天津大学", "date": "2023"},
    {"id": "10", "title": "第三届\"无人争锋\"挑战赛使命召唤冠军", "authors": ["平原", "刘海超", "杨嘉豪", "吴冲", "杨光", "孙立远", "刘效朋", "陶柏安", "姚海屿", "朱鹏飞"], "venue": "", "date": "2023"},
]

def match_patent_pdf(patent_title):
    """匹配专利 PDF"""
    for key, url in patent_pdfs.items():
        if key in patent_title or patent_title in key:
            return url
    return None

def match_award_pdf(award_title):
    """匹配获奖 PDF"""
    for key, url in award_pdfs.items():
        if key in award_title:
            return url
    return None

# 生成更新的专利数据
print("=" * 60)
print("专利 PDF 链接匹配结果")
print("=" * 60)

matched_patents = []
for p in patents:
    pdf_url = match_patent_pdf(p["title"])
    p["pdf_url"] = pdf_url if pdf_url else None
    matched_patents.append(p)
    status = "✓" if pdf_url else "✗"
    print(f"{status} {p['title'][:30]}... -> {pdf_url if pdf_url else '无链接'}")

print(f"\n匹配成功: {sum(1 for p in matched_patents if p['pdf_url'])}/{len(matched_patents)}")

# 生成更新的获奖数据
print("\n" + "=" * 60)
print("获奖 PDF 链接匹配结果")
print("=" * 60)

matched_awards = []
for a in awards:
    pdf_url = match_award_pdf(a["title"])
    a["pdf_url"] = pdf_url if pdf_url else None
    matched_awards.append(a)
    status = "✓" if pdf_url else "✗"
    print(f"{status} {a['title'][:30]}... -> {pdf_url if pdf_url else '无链接'}")

print(f"\n匹配成功: {sum(1 for a in matched_awards if a['pdf_url'])}/{len(matched_awards)}")

# 生成 TypeScript 代码
print("\n" + "=" * 60)
print("生成 TypeScript 代码")
print("=" * 60)

ts_patents = "const defaultPatents: Patent[] = [\n"
for p in matched_patents:
    inventors_str = json.dumps(p["inventors"], ensure_ascii=False)
    pdf_str = f"'{p['pdf_url']}'" if p["pdf_url"] else "undefined"
    ts_patents += f"  {{ id: '{p['id']}', title: '{p['title']}', inventors: {inventors_str}, number: '{p['number']}', date: '{p['date']}', type: '发明', pdf_url: {pdf_str} }},\n"
ts_patents += "];\n"

ts_awards = "const defaultAwards: Award[] = [\n"
for a in matched_awards:
    authors_str = json.dumps(a["authors"], ensure_ascii=False)
    pdf_str = f"'{a['pdf_url']}'" if a["pdf_url"] else "undefined"
    ts_awards += f"  {{ id: '{a['id']}', title: \"{a['title']}\", authors: {authors_str}, venue: '{a['venue']}', date: '{a['date']}', pdf_url: {pdf_str} }},\n"
ts_awards += "];\n"

print("\n专利 TypeScript 代码片段:")
print(ts_patents[:500])

print("\n获奖 TypeScript 代码片段:")
print(ts_awards[:500])

# 保存结果
with open("updated_patents_awards.ts", "w", encoding="utf-8") as f:
    f.write("// 专利数据\n")
    f.write(ts_patents)
    f.write("\n// 获奖数据\n")
    f.write(ts_awards)

print("\n已保存到 updated_patents_awards.ts")
