#!/usr/bin/env python3
"""
分析 visdrone.org 的 JavaScript bundle 寻找 API 端点
"""

from curl_cffi import requests as curl_requests
import re

def fetch_and_analyze_js():
    js_url = "https://visdrone.org/assets/index-BcjkN2Y9.js"

    print(f"获取 JavaScript 文件: {js_url}")
    response = curl_requests.get(js_url, impersonate="chrome120", timeout=60)
    js_content = response.text

    print(f"JS 文件大小: {len(js_content)} 字符")

    patterns = [
        (r'https?://[^\s"\']+api[^\s"\']*', 'API URLs'),
        (r'/api/[^\s"\']+', 'API Paths'),
        (r'supabase[^\s"\']*', 'Supabase'),
        (r'postgres[^\s"\']*', 'PostgreSQL'),
        (r'\.vercel\.app[^\s"\']*', 'Vercel'),
        (r'\.netlify[^\s"\']*', 'Netlify'),
        (r'firebase[^\s"\']*', 'Firebase'),
        (r'graphql[^\s"\']*', 'GraphQL'),
        (r'https://[^\s"\']+\.(pdf|PDF)', 'PDF URLs'),
        (r'paper_url', 'paper_url field'),
        (r'pdf_url', 'pdf_url field'),
    ]

    print("\n" + "=" * 60)
    print("分析 JavaScript 内容")
    print("=" * 60)

    for pattern, name in patterns:
        matches = re.findall(pattern, js_content)
        if matches:
            unique_matches = list(set(matches))[:10]
            print(f"\n{name} ({len(matches)} 个匹配):")
            for m in unique_matches:
                print(f"  {m[:100]}")

    with open('visdrone_bundle.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"\nJS 文件已保存到: visdrone_bundle.js")

    urls = re.findall(r'https?://[^\s"\'<>]+', js_content)
    print(f"\n总共找到 {len(urls)} 个 URL")

    api_urls = [u for u in urls if 'api' in u.lower() or 'supabase' in u.lower() or 'vercel' in u.lower()]
    if api_urls:
        print(f"\n可能的 API URL:")
        for u in list(set(api_urls))[:20]:
            print(f"  {u}")

    pdf_patterns = [
        r'["\']([^"\']+\.pdf)["\']',
        r'["\']([^"\']+paper[^"\']*)["\']',
        r'["\']([^"\']+publication[^"\']*)["\']',
    ]
    print("\n可能的 PDF 相关字符串:")
    for pattern in pdf_patterns:
        matches = re.findall(pattern, js_content, re.IGNORECASE)
        if matches:
            for m in list(set(matches))[:10]:
                if len(m) > 5 and len(m) < 200:
                    print(f"  {m}")

if __name__ == "__main__":
    fetch_and_analyze_js()
