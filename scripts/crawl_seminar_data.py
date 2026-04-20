#!/usr/bin/env python3
"""
使用curl_cffi绕过SSL限制爬取 VisDrone 学术活动数据
需要安装: pip install curl_cffi
"""

try:
    from curl_cffi import requests as curl_requests
    HAS_CURL = True
except ImportError:
    HAS_CURL = False
    print("警告: curl_cffi未安装，将使用普通requests")
    print("建议运行: pip install curl_cffi")

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from urllib.parse import urljoin
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://aiskyeye.com"

def fetch_page_curl(url):
    """使用curl_cffi获取页面内容"""
    if not HAS_CURL:
        return None
    try:
        response = curl_requests.get(url, impersonate="chrome120", timeout=30)
        return response.text
    except Exception as e:
        print(f"curl_cffi Error: {e}")
        return None

def fetch_page_requests(url):
    """使用requests获取页面内容"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }
        response = requests.get(url, headers=headers, timeout=30, verify=False)
        response.encoding = 'utf-8'
        return response.text
    except Exception as e:
        print(f"requests Error: {e}")
        return None

def fetch_page(url):
    """获取页面内容"""
    print(f"  正在获取: {url}")
    
    # 先尝试curl_cffi
    if HAS_CURL:
        html = fetch_page_curl(url)
        if html:
            print(f"  使用curl_cffi成功获取")
            return html
    
    # 再尝试requests
    html = fetch_page_requests(url)
    if html:
        print(f"  使用requests成功获取")
        return html
    
    return None

def parse_seminar_page(html):
    """解析研讨会页面"""
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')
    
    all_seminars = []
    group_index = 0
    group_names = ['learning', 'multimodal', 'embodied']
    
    for table in tables:
        rows = table.find_all('tr')
        
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 3:
                date_cell = cells[0]
                title_cell = cells[1]
                files_cell = cells[2] if len(cells) > 2 else None
                
                date_text = date_cell.get_text(strip=True)
                date_match = re.search(r'(\d{4})年(\d{1,2})月(\d{1,2})日', date_text)
                if date_match:
                    date = f"{date_match.group(1)}-{date_match.group(2).zfill(2)}-{date_match.group(3).zfill(2)}"
                else:
                    date = date_text
                
                title = title_cell.get_text(strip=True)
                
                ppt_url = None
                paper_url = None
                
                if files_cell:
                    links = files_cell.find_all('a')
                    for link in links:
                        href = link.get('href', '')
                        text = link.get_text(strip=True).lower()
                        
                        if href and href != '#':
                            full_url = urljoin(BASE_URL, href)
                            if 'ppt' in text or '.ppt' in href.lower():
                                ppt_url = full_url
                            elif '论文' in text or 'paper' in text or '.pdf' in href.lower():
                                paper_url = full_url
                            elif not ppt_url:
                                ppt_url = full_url
                            elif not paper_url:
                                paper_url = full_url
                
                if title and date:
                    seminar = {
                        'date': date,
                        'title': title,
                        'ppt_url': ppt_url,
                        'paper_url': paper_url,
                        'group': group_names[group_index] if group_index < len(group_names) else 'other'
                    }
                    all_seminars.append(seminar)
        
        group_index += 1
    
    return all_seminars

def parse_talk_page(html):
    """解析特邀讲座页面"""
    soup = BeautifulSoup(html, 'html.parser')
    talks = []
    
    content = soup.find('div', class_='entry-content') or soup.find('article') or soup.find('body')
    
    if content:
        for link in content.find_all('a'):
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            if href and ('.ppt' in href.lower() or '.pdf' in href.lower() or text):
                full_url = urljoin(BASE_URL, href)
                talk = {
                    'title': text if text else '特邀报告',
                    'date': '2024',
                    'ppt_url': full_url,
                    'paper_url': None
                }
                talks.append(talk)
    
    return talks

def generate_typescript_data(seminars, talks):
    """生成TypeScript格式的数据"""
    seminar_lines = []
    for i, s in enumerate(seminars):
        group = s.get('group', 'learning')
        ppt = f"'{s['ppt_url']}'" if s.get('ppt_url') else "'#'"
        paper = f"'{s['paper_url']}'" if s.get('paper_url') else None
        
        title_escaped = s['title'].replace("'", "\\'")
        line = f"  {{ id: 's{i+1}', title: '{title_escaped}', date: '{s['date']}', type: 'seminar', group: '{group}', ppt_url: {ppt}"
        if paper:
            line += f", paper_url: {paper}"
        line += " },"
        seminar_lines.append(line)
    
    talk_lines = []
    for i, t in enumerate(talks):
        ppt = f"'{t['ppt_url']}'" if t.get('ppt_url') else "'#'"
        paper = f"'{t['paper_url']}'" if t.get('paper_url') else None
        
        title_escaped = t['title'].replace("'", "\\'")
        line = f"  {{ id: 't{i+1}', title: '{title_escaped}', date: '{t['date']}', type: 'talk', ppt_url: {ppt}"
        if paper:
            line += f", paper_url: {paper}"
        line += " },"
        talk_lines.append(line)
    
    return seminar_lines, talk_lines

def main():
    print("=" * 60)
    print("VisDrone 学术活动数据爬虫")
    print("=" * 60)
    
    seminar_url = "https://aiskyeye.com/%e7%a0%94%e8%ae%a8%e4%bc%9a/"
    talk_url = "https://aiskyeye.com/talk/"
    
    print("\n[1/2] 爬取研讨会数据...")
    seminar_html = fetch_page(seminar_url)
    seminars = parse_seminar_page(seminar_html) if seminar_html else []
    print(f"  找到 {len(seminars)} 条研讨会记录")
    
    print("\n[2/2] 爬取特邀讲座数据...")
    talk_html = fetch_page(talk_url)
    talks = parse_talk_page(talk_html) if talk_html else []
    print(f"  找到 {len(talks)} 条特邀讲座记录")
    
    output_data = {
        'seminars': seminars,
        'talks': talks,
        'crawled_at': datetime.now().isoformat()
    }
    
    with open('crawled_seminar_data.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    print(f"\n数据已保存到: crawled_seminar_data.json")
    
    seminar_lines, talk_lines = generate_typescript_data(seminars, talks)
    
    with open('seminar_data_ts.txt', 'w', encoding='utf-8') as f:
        f.write("// 研讨会数据\n")
        f.write("const defaultSeminars: SeminarEvent[] = [\n")
        f.write("\n".join(seminar_lines))
        f.write("\n];\n\n")
        f.write("// 特邀讲座数据\n")
        f.write("const defaultTalks: SeminarEvent[] = [\n")
        f.write("\n".join(talk_lines))
        f.write("\n];\n")
    print(f"TypeScript数据已保存到: seminar_data_ts.txt")
    
    print("\n" + "=" * 60)
    print("统计信息:")
    print(f"  研讨会总数: {len(seminars)}")
    groups = {}
    for s in seminars:
        g = s.get('group', 'other')
        groups[g] = groups.get(g, 0) + 1
    for g, count in groups.items():
        print(f"    - {g}: {count}条")
    print(f"  特邀讲座总数: {len(talks)}")
    ppt_count = sum(1 for s in seminars if s.get('ppt_url') and s['ppt_url'] != '#')
    paper_count = sum(1 for s in seminars if s.get('paper_url') and s['paper_url'] != '#')
    print(f"  有效PPT链接: {ppt_count}")
    print(f"  有效论文链接: {paper_count}")
    print("=" * 60)

if __name__ == "__main__":
    main()
