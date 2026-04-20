#!/usr/bin/env python3
"""
详细爬取 visdrone.org 论文、专利和获奖数据
使用 curl_cffi 模拟浏览器并保存完整响应
"""

from curl_cffi import requests as curl_requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from urllib.parse import urljoin

BASE_URL = "https://visdrone.org"

def fetch_page(url, impersonate="chrome120"):
    """使用 curl_cffi 获取页面内容"""
    try:
        response = curl_requests.get(
            url,
            impersonate=impersonate,
            timeout=60,
            headers={
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
            }
        )
        return response.text, response.url
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None, None

def find_pdf_links(html, base_url):
    """从 HTML 中提取所有 PDF 相关链接"""
    soup = BeautifulSoup(html, 'html.parser')
    pdf_links = []

    for link in soup.find_all('a', href=True):
        href = link.get('href', '')
        text = link.get_text(strip=True)

        if '.pdf' in href.lower() or 'pdf' in text.lower():
            full_url = urljoin(base_url, href)
            pdf_links.append({
                'url': full_url,
                'text': text,
                'href': href
            })

    for link in soup.find_all('a', href=True):
        href = link.get('href', '')
        if any(ext in href.lower() for ext in ['.pdf', 'paper', 'publication', 'download']):
            full_url = urljoin(base_url, href)
            pdf_links.append({
                'url': full_url,
                'text': link.get_text(strip=True),
                'href': href
            })

    return pdf_links

def extract_data_from_page(html, url):
    """从页面提取结构化数据"""
    soup = BeautifulSoup(html, 'html.parser')
    data = {
        'papers': [],
        'patents': [],
        'awards': [],
        'raw_text': []
    }

    text_content = soup.get_text(separator='\n', strip=True)
    lines = text_content.split('\n')

    for line in lines:
        line = line.strip()
        if line:
            data['raw_text'].append(line)

    pdf_links = find_pdf_links(html, url)
    if pdf_links:
        data['pdf_links'] = pdf_links

    scripts = soup.find_all('script')
    for script in scripts:
        if script.string:
            script_text = script.string
            if 'pdf' in script_text.lower() or 'paper' in script_text.lower():
                pdf_matches = re.findall(r'["\']([^"\']*\.pdf[^"\']*)["\']', script_text)
                for match in pdf_matches:
                    data['raw_text'].append(f"PDF_URL_FOUND: {match}")

    return data

def main():
    print("=" * 80)
    print("详细爬取 visdrone.org 数据")
    print("=" * 80)

    pages_to_check = [
        "https://visdrone.org/visdrone/publications",
        "https://visdrone.org/publications",
        "https://visdrone.org/patents",
        "https://visdrone.org/awards",
        "https://aiskyeye.com/publications/",
        "https://aiskyeye.com/patents/",
        "https://aiskyeye.com/awards/",
    ]

    all_data = {}

    for url in pages_to_check:
        print(f"\n{'='*60}")
        print(f"检查页面: {url}")
        print("=" * 60)

        html, final_url = fetch_page(url)

        if html:
            print(f"  获取到 HTML，长度: {len(html)} 字符")

            with open(f'raw_{url.replace("https://", "").replace("/", "_")}.html', 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"  保存到: raw_{url.replace('https://', '').replace('/', '_')}.html")

            data = extract_data_from_page(html, final_url)

            if data.get('pdf_links'):
                print(f"\n  找到 {len(data['pdf_links'])} 个 PDF 相关链接:")
                for link in data['pdf_links'][:20]:
                    print(f"    - {link['url']}")

            if data['raw_text']:
                print(f"\n  页面文本片段 (前30行):")
                for line in data['raw_text'][:30]:
                    if line and len(line) > 5:
                        print(f"    {line[:100]}")

            all_data[url] = data
        else:
            print(f"  获取失败!")

    print("\n" + "=" * 80)
    print("总结")
    print("=" * 80)

    for url, data in all_data.items():
        print(f"\n{url}:")
        if data.get('pdf_links'):
            print(f"  PDF链接数: {len(data['pdf_links'])}")
        print(f"  文本行数: {len(data['raw_text'])}")

    with open('visdrone_detailed_crawl.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    print(f"\n详细数据已保存到: visdrone_detailed_crawl.json")

if __name__ == "__main__":
    main()
