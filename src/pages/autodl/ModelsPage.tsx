import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cloud, ArrowLeft, Code, Database, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const allModels: { name: string; provider: string; type: string; contextWindow: string; notes: string }[] = [
  { name: 'Kimi-K2.5', provider: '月之暗面', type: '文本生成, 代码生成, 多模态', contextWindow: '256K', notes: '-' },
  { name: 'DeepSeek-V3.2', provider: 'DeepSeek', type: '文本生成, 推理模型', contextWindow: '128K', notes: '-' },
  { name: 'Qwen3.5-397B-A17B', provider: '阿里云', type: '文本生成, 代码生成, 推理模型, 多模态, 智能体', contextWindow: '262K', notes: '输入 ≤ 128K, 128K <输入' },
  { name: 'MiniMax-M2.5', provider: 'MiniMax', type: '文本生成, 代码生成, 推理模型, 智能体', contextWindow: '200K', notes: '-' },
  { name: 'GLM-5', provider: '智谱AI', type: '文本生成, 推理模型, 代码生成, Prefix, Tools, Json', contextWindow: '200K', notes: '输入 ≤ 32K, 32K < 输入 ≤ 64K, 64K <输入' },
  { name: 'DeepSeek-R1-0528', provider: 'DeepSeek', type: '推理模型', contextWindow: '-', notes: '-' },
  { name: 'Doubao-Seed-2.0-Code Beta', provider: '字节跳动', type: '代码', contextWindow: '-', notes: '-' },
  { name: 'Doubao-Seed-Code', provider: '字节跳动', type: '代码', contextWindow: '-', notes: '-' },
  { name: 'MiniMax-M2.1', provider: 'MiniMax', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'MiniMax-M2', provider: 'MiniMax', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'GLM-4.6', provider: '智谱AI', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'Kimi-K2-0905', provider: '月之暗面', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'Qwen3-235B', provider: '阿里云', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'Yi-Large', provider: '零一万物', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'Baichuan 4', provider: '百川智能', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'InternLM3', provider: '上海AI实验室', type: '对话', contextWindow: '-', notes: '-' },
  { name: 'Hunyuan-Lite', provider: '腾讯', type: '对话', contextWindow: '-', notes: '-' }
];

const ModelsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
            <Cloud className="w-3 h-3 mr-1" />
            模型列表
          </Badge>
          <h1 className="text-3xl font-bold mb-3">所有支持的大模型</h1>
          <p className="text-muted-foreground max-w-2xl">
            浏览我们支持的所有大模型，包括最新的国产开源模型和商业模型
          </p>
        </motion.div>
        <Button variant="outline" asChild>
          <Link to="/oplclaw/autodl">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回 AutoDL
          </Link>
        </Button>
      </div>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle>完整模型列表</CardTitle>
          <CardDescription>所有可用的大模型及其详细信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">模型名称</th>
                  <th className="text-left py-3 px-2">提供商</th>
                  <th className="text-left py-3 px-2">类型</th>
                  <th className="text-left py-3 px-2">上下文窗口</th>
                  <th className="text-left py-3 px-2">备注</th>
                </tr>
              </thead>
              <tbody>
                {allModels.map((model, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{model.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{model.provider}</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {model.type.split(', ').map((type, j) => (
                          <Badge key={j} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{model.contextWindow}</td>
                    <td className="py-3 px-2 text-muted-foreground">{model.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* API Example */}
      <Card className="bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            快速开始
          </CardTitle>
          <CardDescription className="text-slate-400">
            简单几行代码即可调用
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-sm text-green-400 overflow-x-auto">
{`import requests

response = requests.post(
    "https://api.oplclaw.com/v1/chat/completions",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "model": "GLM-5",
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)

print(response.json())`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelsPage;