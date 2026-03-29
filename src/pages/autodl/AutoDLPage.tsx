import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cloud, Brain, Zap, Key, BarChart3, CreditCard,
  Check, Star, ArrowRight, Code, Database, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const models: { name: string; provider: string; type: string; contextWindow: string; notes: string }[] = [
  { name: 'Kimi-K2.5', provider: '月之暗面', type: '文本生成, 代码生成, 多模态', contextWindow: '256K', notes: '-' },
  { name: 'DeepSeek-V3.2', provider: 'DeepSeek', type: '文本生成, 推理模型', contextWindow: '128K', notes: '-' },
  { name: 'Qwen3.5-397B-A17B', provider: '阿里云', type: '文本生成, 代码生成, 推理模型, 多模态, 智能体', contextWindow: '262K', notes: '输入 ≤ 128K, 128K <输入' },
  { name: 'MiniMax-M2.5', provider: 'MiniMax', type: '文本生成, 代码生成, 推理模型, 智能体', contextWindow: '200K', notes: '-' },
  { name: 'GLM-5', provider: '智谱AI', type: '文本生成, 推理模型, 代码生成, Prefix, Tools, Json', contextWindow: '200K', notes: '输入 ≤ 32K, 32K < 输入 ≤ 64K, 64K <输入' },
  { name: 'DeepSeek-R1-0528', provider: 'DeepSeek', type: '推理模型', contextWindow: '-', notes: '-' }
];

const pricingPlans = [
  {
    name: '免费版',
    price: '0',
    period: '永久免费',
    description: '适合个人学习和小规模使用',
    features: [
      '每月 1000 次 API 调用',
      '基础模型访问',
      '社区支持',
      '标准响应速度'
    ],
    cta: '免费开始',
    popular: false
  },
  {
    name: '专业版',
    price: '99',
    period: '每月',
    description: '适合科研工作者和学生',
    features: [
      '每月 50000 次 API 调用',
      '全部模型访问',
      '优先技术支持',
      '快速响应速度',
      'API 密钥管理',
      '用量统计分析'
    ],
    cta: '立即订阅',
    popular: true
  },
  {
    name: '团队版',
    price: '299',
    period: '每月',
    description: '适合研究团队和实验室',
    features: [
      '每月 200000 次 API 调用',
      '全部模型访问',
      '专属技术支持',
      '最快响应速度',
      '团队协作功能',
      '私有部署选项'
    ],
    cta: '联系销售',
    popular: false
  }
];

const AutoDLPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
            <Cloud className="w-3 h-3 mr-1" />
            AutoDL 服务
          </Badge>
          <h1 className="text-3xl font-bold mb-3">国产开源大模型 API 服务</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            聚焦国产开源大模型，提供 DeepSeek、Qwen、GLM 等主流模型 API 服务，支撑自动化科研系统和科研智能体运行
          </p>
        </motion.div>
        <div className="mt-6">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cloud%20computing%20service%2C%20AI%20models%20in%20cloud%2C%20technology%20infrastructure%2C%20no%20text%2C%20no%20words%2C%20no%20letters%2C%20clean%20modern%20design&image_size=landscape_16_9" 
            alt="AutoDL 服务" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {
          [
            { label: '可用模型', value: '50+' },
            { label: 'API 可用性', value: '99.9%' },
            { label: '平均延迟', value: '<500ms' },
            { label: '服务用户', value: '10k+' }
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">高性能推理</h3>
            <p className="text-sm text-muted-foreground">
              优化的推理引擎，毫秒级响应，支持高并发请求
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">密钥管理</h3>
            <p className="text-sm text-muted-foreground">
              安全的 API 密钥管理，支持多密钥、权限控制
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">用量统计</h3>
            <p className="text-sm text-muted-foreground">
              实时用量监控，详细调用日志，成本分析报告
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Models */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>模型广场</CardTitle>
              <CardDescription>支持的主流大模型</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <a href="https://www.autodl.art/large-model/market" target="_blank" rel="noopener noreferrer">
                查看全部 <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
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
                {models.map((model, i) => (
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

      {/* Pricing */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">价格方案</h2>
          <p className="text-muted-foreground">选择适合你的方案</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit mb-2 bg-blue-500">最受欢迎</Badge>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">¥{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                    <a href="https://www.autodl.art/large-model/market" target="_blank" rel="noopener noreferrer">
                      {plan.cta}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

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

      {/* Outlet for subroutes */}
      <Outlet />
    </div>
  );
};

export default AutoDLPage;