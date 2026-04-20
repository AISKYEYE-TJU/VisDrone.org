#!/usr/bin/env python3
"""
从 JS bundle 中提取所有 PDF 链接
"""

import re
import json

with open('visdrone_bundle.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

print(f"JS 文件大小: {len(js_content)} 字符")

pdf_links = []

patterns = [
    r'https://aiskyeye\.com/wp-content/uploads/[^\s"\'<>]+\.pdf',
    r'https://[^\s"\'<>]+\.pdf',
    r'/wp-content/uploads/[^\s"\'<>]+\.pdf',
]

for pattern in patterns:
    matches = re.findall(pattern, js_content)
    for m in matches:
        if m not in pdf_links:
            pdf_links.append(m)

print(f"\n找到 {len(pdf_links)} 个 PDF 链接:")

for link in sorted(set(pdf_links)):
    print(f"  {link}")

with open('found_pdfs.json', 'w', encoding='utf-8') as f:
    json.dump(pdf_links, f, ensure_ascii=False, indent=2)

print(f"\n保存到 found_pdfs.json")

# 分析链接模式
print("\n链接模式分析:")
base_urls = set()
for link in pdf_links:
    match = re.match(r'(https?://[^/]+)', link)
    if match:
        base_urls.add(match.group(1))

print(f"  基础URL: {base_urls}")

# 提取文件名模式
print("\n文件名模式:")
filenames = []
for link in pdf_links:
    match = re.search(r'/([^/]+\.pdf)$', link)
    if match:
        filenames.append(match.group(1))

for f in sorted(set(filenames))[:20]:
    print(f"  {f}")
