#!/usr/bin/env python3
"""
从 visdrone.org JS bundle 提取论文 PDF 链接
"""

import re
import json

with open('visdrone_bundle.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 查找 aiskyeye.com 相关的论文链接
patterns = [
    r'https://aiskyeye\.com/wp-content/uploads/\d{4}/\d{2}/[^"\']+\.pdf',
]

paper_pdfs = []
for pattern in patterns:
    matches = re.findall(pattern, js_content)
    for m in matches:
        if '专利' not in m and '获奖' not in m and '证书' not in m:
            if m not in paper_pdfs:
                paper_pdfs.append(m)

print(f"找到 {len(paper_pdfs)} 个论文 PDF 链接:")

for link in sorted(set(paper_pdfs)):
    print(f"  {link}")

# 查找其他学术论文链接 (CVPR, NeurIPS, etc)
academic_patterns = [
    r'https://openaccess\.thecvf\.com/[^\s"\'<>]+\.pdf',
    r'https://papers\.nips\.cc/[^\s"\'<>]+\.pdf',
    r'https://proceedings\.neurips\.cc/[^\s"\'<>]+\.pdf',
    r'https://arxiv\.org/pdf/[^\s"\'<>]+\.pdf',
    r'https://www\.ijcai\.org/[^\s"\'<>]+\.pdf',
    r'https://raw\.githubusercontent\.com/[^\s"\'<>]+\.pdf',
]

academic_pdfs = []
for pattern in academic_patterns:
    matches = re.findall(pattern, js_content)
    for m in matches:
        if m not in academic_pdfs:
            academic_pdfs.append(m)

print(f"\n找到 {len(academic_pdfs)} 个学术论文 PDF 链接:")

for link in sorted(set(academic_pdfs)):
    print(f"  {link}")

# 提取所有 PDF 链接并去重
all_pdfs = paper_pdfs + academic_pdfs
print(f"\n总共: {len(all_pdfs)} 个 PDF 链接")

with open('all_paper_pdfs.json', 'w', encoding='utf-8') as f:
    json.dump({
        'aiskyeye_papers': list(set(paper_pdfs)),
        'academic_papers': list(set(academic_pdfs)),
        'all': list(set(all_pdfs))
    }, f, ensure_ascii=False, indent=2)

print("\n保存到 all_paper_pdfs.json")
