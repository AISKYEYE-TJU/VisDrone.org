import json
import os

# 读取 OpenClaw 配置文件
config_path = os.path.expanduser("~/.openclaw/openclaw.json")

with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 删除 Qwen 认证信息
if 'auth' in config:
    del config['auth']

# 更新模型配置为 Autodl
config['models'] = {
    "providers": {
        "autodl": {
            "baseUrl": "https://api.autodl.art/v1",
            "apiKey": "oIaeS3cg8kbmCLpyNjDwqgW23Y2b3X0dC4I8zf3yOmXEpiMD",
            "api": "openai-completions",
            "models": [
                {
                    "id": "Kimi-K2.5",
                    "name": "Kimi K2.5",
                    "reasoning": False,
                    "input": ["text"],
                    "cost": {
                        "input": 0,
                        "output": 0,
                        "cacheRead": 0,
                        "cacheWrite": 0
                    },
                    "contextWindow": 128000,
                    "maxTokens": 8192
                }
            ]
        }
    }
}

# 更新代理配置使用 Autodl 模型
config['agents'] = {
    "defaults": {
        "model": {
            "primary": "autodl/Kimi-K2.5",
            "fallbacks": []
        },
        "models": {
            "autodl/Kimi-K2.5": {
                "alias": "kimi"
            }
        },
        "workspace": "C:\\Users\\ipc\\.openclaw\\workspace",
        "compaction": {
            "mode": "safeguard"
        },
        "maxConcurrent": 4,
        "subagents": {
            "maxConcurrent": 8
        }
    }
}

# 删除 Qwen 相关插件
if 'plugins' in config and 'entries' in config['plugins']:
    if 'qwen-portal-auth' in config['plugins']['entries']:
        del config['plugins']['entries']['qwen-portal-auth']

# 保存更新后的配置
backup_path = config_path + '.backup'
with open(backup_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print(f"配置备份已保存到：{backup_path}")
print("\n更新后的配置:")
print(json.dumps(config, indent=2, ensure_ascii=False))
