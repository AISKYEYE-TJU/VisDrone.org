import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Settings, Check, Save } from 'lucide-react';
import { API_CONFIG, getModelForScenario, getFallbackModelsForScenario } from '@/config/api';

interface APISettingsProps {
  onSave?: (config: typeof API_CONFIG) => void;
  scenario?: string; // 可选的场景名称
  showModel?: boolean; // 是否显示模型选择
}

const APISettings: React.FC<APISettingsProps> = ({ onSave, scenario, showModel = true }) => {
  // 根据场景获取推荐模型
  const scenarioModel = scenario ? getModelForScenario(scenario) : API_CONFIG.model;
  const [config, setConfig] = useState({ ...API_CONFIG, model: scenarioModel });
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // 当场景变化时更新模型
  useEffect(() => {
    if (scenario) {
      const model = getModelForScenario(scenario);
      setConfig(prev => ({ ...prev, model }));
    }
  }, [scenario]);

  const handleChange = (key: keyof typeof API_CONFIG, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    // 这里可以添加保存到本地存储或服务器的逻辑
    localStorage.setItem('apiConfig', JSON.stringify(config));
    setIsSaved(true);
    if (onSave) {
      onSave(config);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: '你是一个助手' },
            { role: 'user', content: 'Hello' }
          ],
          temperature: 0.7,
          max_tokens: 100
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          setTestResult({ success: true, message: 'API测试成功！' });
        } else {
          setTestResult({ success: false, message: 'API响应格式错误' });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestResult({ success: false, message: errorData.error?.message || `API错误: ${response.status}` });
      }
    } catch (error: any) {
      setTestResult({ success: false, message: `测试失败: ${error.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              大模型 API 设置
            </CardTitle>
            <CardDescription>配置和测试大模型 API 连接</CardDescription>
          </div>
          <Button onClick={handleSave} disabled={isSaved}>
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="baseUrl">API 基础 URL</Label>
          <Input
            id="baseUrl"
            value={config.baseUrl}
            onChange={(e) => handleChange('baseUrl', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiKey">API 密钥</Label>
          <Input
            id="apiKey"
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
          />
        </div>
        {showModel && (
          <div className="space-y-2">
            <Label htmlFor="model">模型名称</Label>
            <Input
              id="model"
              value={config.model}
              onChange={(e) => handleChange('model', e.target.value)}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxTokens">最大 Token 数</Label>
            <Input
              id="maxTokens"
              type="number"
              value={config.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeout">超时时间 (ms)</Label>
            <Input
              id="timeout"
              type="number"
              value={config.timeout}
              onChange={(e) => handleChange('timeout', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxRetries">最大重试次数</Label>
            <Input
              id="maxRetries"
              type="number"
              value={config.maxRetries}
              onChange={(e) => handleChange('maxRetries', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retryDelay">重试延迟 (ms)</Label>
            <Input
              id="retryDelay"
              type="number"
              value={config.retryDelay}
              onChange={(e) => handleChange('retryDelay', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <Button
          onClick={handleTest}
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? '测试中...' : '测试 API 连接'}
        </Button>
        {testResult && (
          <Alert variant={testResult.success ? 'default' : 'destructive'}>
            <AlertTitle>{testResult.success ? '测试成功' : '测试失败'}</AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default APISettings;