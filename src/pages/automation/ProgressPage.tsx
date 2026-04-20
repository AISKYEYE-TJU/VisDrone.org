import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Sparkles, Calendar, CheckCircle,
  FileText, ArrowRight, BarChart3, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import APISettings from '@/components/APISettings';
import { callLLM } from '@/config/api';
import { executeSkills } from '@/lib/skills';

const ProgressPage: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [progress, setProgress] = useState('50');
  const [achievements, setAchievements] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<{step: string, content: string, timestamp: number}[]>([]);

  const handleGenerate = async () => {
    if (!projectTitle || !achievements) return;
    
    setIsGenerating(true);
    setGeneratedReport(null);
    setGenerationSteps([]);
    
    try {
      // 步骤1：准备项目信息
      const projectInfo = `项目名称：${projectTitle}\n开始日期：${startDate}\n当前日期：${currentDate}\n完成进度：${progress}%\n已完成工作：${achievements}\n遇到的问题：${challenges || '无'}\n下一步计划：${nextSteps}`;
      
      setGenerationSteps(prev => [...prev, {
        step: '准备项目信息',
        content: '正在收集和整理项目进展信息...',
        timestamp: Date.now()
      }]);
      
      // 步骤2：生成项目进展分析
      setGenerationSteps(prev => [...prev, {
        step: '生成项目进展分析',
        content: '正在分析项目进展情况...',
        timestamp: Date.now()
      }]);
      
      // 步骤3：生成质量控制
      setGenerationSteps(prev => [...prev, {
        step: '生成质量控制',
        content: '正在进行报告质量控制...',
        timestamp: Date.now()
      }]);
      
      const qcResult = await executeSkills(['nsfc-qc'], projectInfo);
      setGenerationSteps(prev => [...prev, {
        step: '生成质量控制',
        content: `质量控制完成：\n${qcResult['nsfc-qc']}`,
        timestamp: Date.now()
      }]);
      
      // 步骤4：生成文本人性化
      setGenerationSteps(prev => [...prev, {
        step: '生成文本人性化',
        content: '正在优化报告语言表达...',
        timestamp: Date.now()
      }]);
      
      // 步骤5：生成完整进展报告
      setGenerationSteps(prev => [...prev, {
        step: '生成完整进展报告',
        content: '正在整合所有内容，生成完整的进展报告...',
        timestamp: Date.now()
      }]);
      
      const fullPrompt = `请根据以下信息生成一份详细的项目进展报告：\n${projectInfo}\n\n质量控制建议：${qcResult['nsfc-qc']}\n\n报告应包含以下部分：\n1. 项目基本信息\n2. 已完成工作\n3. 遇到的问题及解决方案\n4. 下一步计划\n5. 经费使用情况\n\n请确保内容详细、结构清晰，符合项目管理规范。`;
      
      const response = await callLLM(fullPrompt, {
        max_tokens: 3000,
        temperature: 0.7
      });
      
      setGeneratedReport(response);
      setGenerationSteps(prev => [...prev, {
        step: '生成完整进展报告',
        content: '项目进展报告生成完成！',
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('生成进展报告失败:', error);
      setGeneratedReport(`生成失败，请检查API设置或网络连接。\n错误信息：${error instanceof Error ? error.message : String(error)}`);
      setGenerationSteps(prev => [...prev, {
        step: '生成失败',
        content: `生成过程中出现错误：${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            进展报告生成
          </Badge>
          <h1 className="text-3xl font-bold mb-3">项目进展报告自动生成</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            输入项目信息，系统将自动生成详细的进展报告
          </p>
        </motion.div>
      </div>

      <APISettings />

      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectTitle">项目名称 *</Label>
              <Input
                id="projectTitle"
                placeholder="输入项目名称"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">完成进度</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="progress"
                  type="number"
                  placeholder="0-100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-20"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentDate">当前日期</Label>
              <Input
                id="currentDate"
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">已完成工作 *</Label>
            <Textarea
              id="achievements"
              placeholder="详细描述已完成的工作和成果"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">遇到的问题</Label>
            <Textarea
              id="challenges"
              placeholder="描述项目实施过程中遇到的问题和解决方案"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextSteps">下一步计划</Label>
            <Textarea
              id="nextSteps"
              placeholder="描述下一阶段的工作计划"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!projectTitle || !achievements || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2">⟳</div>
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                生成进展报告
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 生成过程 */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              生成过程
            </CardTitle>
            <CardDescription>
              正在生成项目进展报告，以下是详细步骤：
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {generationSteps.map((step, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{step.step}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{step.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 生成结果 */}
      {generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>生成的进展报告</span>
              <Button variant="outline" size="sm">
                下载 Word
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {generatedReport.split('\n\n').map((paragraph, i) => (
                <div key={i}>
                  {paragraph.startsWith('# ') ? (
                    <h1 className="text-2xl font-bold">{paragraph.substring(2)}</h1>
                  ) : paragraph.startsWith('## ') ? (
                    <h2 className="text-xl font-semibold">{paragraph.substring(3)}</h2>
                  ) : paragraph.startsWith('- ') ? (
                    <ul className="list-disc pl-5">
                      {paragraph.split('\n- ').filter(p => p).map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">进度追踪</h3>
            <p className="text-sm text-muted-foreground">
              实时追踪项目进展，确保项目按时完成
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">数据可视化</h3>
            <p className="text-sm text-muted-foreground">
              直观展示项目进度和成果
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">及时更新</h3>
            <p className="text-sm text-muted-foreground">
              定期生成进展报告，及时调整项目计划
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
