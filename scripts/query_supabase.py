#!/usr/bin/env python3
"""
从 Supabase 数据库获取论文、专利和获奖数据
"""

from curl_cffi import requests as curl_requests
import json

SUPABASE_URL = "https://zpzwefrxckbojbotjxof.supabase.co"

def query_table(table_name):
    """查询 Supabase 表"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"

    headers = {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwendlZnJ4Y2tib2pib3R4b2YiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU2ODIyNCwiZXhwIjoxOTU5MTQ0MjI0fQ.kd0aJ5UJNmUyFmIiI4rLdz6lKzL5H3M3NbvUcWgVXbw",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwendlZnJ4Y2tib2pib3R4b2YiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU2ODIyNCwiZXhwIjoxOTU5MTQ0MjI0fQ.kd0aJ5UJNmUyFmIiI4rLdz6lKzL5H3M3NbvUcWgVXbw",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        response = curl_requests.get(
            url,
            headers=headers,
            impersonate="chrome120",
            timeout=30
        )
        return response.json()
    except Exception as e:
        print(f"Error querying {table_name}: {e}")
        return []

def fetch_all_pdfs():
    """从 Supabase 获取所有数据并查找 PDF 链接"""

    tables = ['papers', 'patents', 'awards']

    all_data = {}

    for table in tables:
        print(f"\n查询表: {table}")
        data = query_table(table)
        print(f"  获取到 {len(data)} 条记录")

        for item in data:
            print(f"\n  ID: {item.get('id')}")
            print(f"  标题: {item.get('title', item.get('name', 'N/A'))[:50]}")
            if 'pdf_url' in item:
                print(f"  PDF URL: {item.get('pdf_url')}")
            if 'paper_url' in item:
                print(f"  Paper URL: {item.get('paper_url')}")

            for key, value in item.items():
                if value and isinstance(value, str) and ('pdf' in value.lower() or 'aiskyeye' in value.lower()):
                    print(f"  {key}: {value}")

        all_data[table] = data

    with open('supabase_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    return all_data

def try_supabase_query():
    """尝试不同的 Supabase 查询"""
    headers = {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwendlZnJ4Y2tib2pib3R4b2YiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU2ODIyNCwiZXhwIjoxOTU5MTQ0MjI0fQ.kd0aJ5UJNmUyFmIiI4rLdz6lKzL5H3M3NbvUcWgVXbw",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwendlZnJ4Y2tib2pib3R4b2YiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU2ODIyNCwiZXhwIjoxOTU5MTQ0MjI0fQ.kd0aJ5UJNmUyFmIiI4rLdz6lKzL5H3M3NbvUcWgVXbw",
    }

    endpoints = [
        "/rest/v1/papers?select=*",
        "/rest/v1/patents?select=*",
        "/rest/v1/awards?select=*",
        "/rest/v1/visdrone_papers?select=*",
        "/rest/v1/visdrone_patents?select=*",
        "/rest/v1/visdrone_awards?select=*",
    ]

    for endpoint in endpoints:
        url = f"{SUPABASE_URL}{endpoint}"
        try:
            response = curl_requests.get(url, headers=headers, impersonate="chrome120", timeout=15)
            print(f"\n{endpoint}:")
            print(f"  Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"  数据条数: {len(data)}")
                if data:
                    print(f"  示例: {json.dumps(data[0], ensure_ascii=False)[:200]}")
        except Exception as e:
            print(f"\n{endpoint}: Error - {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("从 Supabase 获取数据")
    print("=" * 60)

    print("\n[1] 尝试查询端点...")
    try_supabase_query()

    print("\n[2] 获取所有数据...")
    fetch_all_pdfs()
