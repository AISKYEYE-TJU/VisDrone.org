import json
import os

# 读取 OpenClaw 配置文件
config_path = os.path.expanduser("~/.openclaw/openclaw.json")

with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 更新模型配置为正确的 Autodl API 端点
config['models']['providers']['autodl']['baseUrl'] = "https://www.autodl.art/api/v1"

# 保存更新后的配置
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("OpenClaw 配置已更新！")
print(f"API 端点：{config['models']['providers']['autodl']['baseUrl']}")
print(f"默认模型：{config['agents']['defaults']['model']['primary']}")
