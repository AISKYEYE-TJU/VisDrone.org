#!/usr/bin/env python3
"""
使用 curl_cffi 爬取 visdrone.org 数据
尝试不同的API端点和请求方式
"""

from curl_cffi import requests as curl_requests
from bs4 import BeautifulSoup
import json
import re

def try_api_endpoints():
    """尝试可能的 API 端点"""
    base_urls = [
        "https://visdrone.org",
        "https://www.visdrone.org",
        "https://api.visdrone.org",
    ]

    endpoints = [
        "/api/publications",
        "/api/papers",
        "/api/patents",
        "/api/awards",
        "/api/data",
        "/wp-json/wp/v2/publications",
        "/wp-json/wp/v2/papers",
    ]

    results = {}

    for base in base_urls:
        for endpoint in endpoints:
            url = base + endpoint
            try:
                response = curl_requests.get(
                    url,
                    impersonate="chrome120",
                    timeout=15,
                    headers={
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    }
                )
                if response.status_code == 200 and len(response.text) > 100:
                    print(f"✓ Found: {url} ({len(response.text)} chars)")
                    results[url] = response.text[:2000]
            except Exception as e:
                pass

    return results

def try_supabase_api():
    """尝试 Supabase API"""
    urls = [
        "https://visdrone.org/api/papers",
        "https://visdrone.org/.netlify/functions/papers",
        "https://visdrone.vercel.app/api/papers",
    ]

    for url in urls:
        try:
            response = curl_requests.get(url, impersonate="chrome120", timeout=15)
            if response.status_code == 200:
                print(f"✓ Found: {url}")
                print(response.text[:500])
        except:
            pass

def analyze_main_page():
    """分析主页 HTML 寻找线索"""
    url = "https://visdrone.org/visdrone/publications"

    response = curl_requests.get(
        url,
        impersonate="chrome120",
        timeout=30,
        headers={
            "Accept": "text/html,*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        }
    )

    html = response.text

    print(f"HTML 长度: {len(html)}")

    soup = BeautifulSoup(html, 'html.parser')

    scripts = soup.find_all('script', src=True)
    print(f"\n外部脚本 ({len(scripts)} 个):")
    for s in scripts[:10]:
        src = s.get('src', '')
        print(f"  {src}")

    inline_scripts = soup.find_all('script', string=True)
    print(f"\n内联脚本 ({len(inline_scripts)} 个):")

    for s in inline_scripts:
        text = str(s.string)[:500] if s.string else ""
        if text and len(text) > 50:
            print(f"  --- 内联脚本 ---")
            print(text[:300])

    links = soup.find_all('link', href=True)
    print(f"\n链接 ({len(links)} 个):")
    for l in links[:15]:
        href = l.get('href', '')
        if 'json' in href or 'api' in href or 'sw' in href:
            print(f"  {href}")

    with open('visdrone_main_page.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("\n完整 HTML 已保存到: visdrone_main_page.html")

if __name__ == "__main__":
    print("=" * 60)
    print("尝试查找 visdrone.org API")
    print("=" * 60)

    print("\n[1] 尝试 API 端点...")
    results = try_api_endpoints()

    print("\n[2] 尝试 Supabase API...")
    try_supabase_api()

    print("\n[3] 分析主页结构...")
    analyze_main_page()

    if results:
        print("\n找到的数据:")
        for url, data in results.items():
            print(f"\n{url}:")
            print(data[:500])
