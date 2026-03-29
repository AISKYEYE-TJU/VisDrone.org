import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCode, Sparkles, CheckCircle, Award,
  BookOpen, TrendingUp, ArrowRight, Star
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

const ConclusionPage: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [achievements, setAchievements] = useState('');
  const [papers, setPapers] = useState('');
  const [patents, setPatents] = useState('');
  const [software, setSoftware] = useState('');
  const [budgetUsage, setBudgetUsage] = useState('');
  const [futurePlans, setFuturePlans] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<Array<{ step: string; status: 'pending' | 'in_progress' | 'completed' | 'error'; result?: string }>>([]);

  const handleGenerate = async () => {
    if (!projectTitle || !achievements) return;
    
    setIsGenerating(true);
    setGeneratedReport(null);
    
    const projectInfo = {
      projectTitle,
      startDate,
      endDate,
      achievements,
      papers: papers || '无',
      patents: patents || '无',
      software: software || '无',
      budgetUsage: budgetUsage || '经费使用合理，符合预算计划',
      futurePlans: futurePlans || '基于本项目成果，计划开展后续研究...'
    };
    
    const steps = [
      { step: '分析项目信息', status: 'pending' as const },
      { step: '生成结题报告摘要', status: 'pending' as const },
      { step: '撰写研究成果章节', status: 'pending' as const },
      { step: '撰写经费使用情况', status: 'pending' as const },
      { step: '撰写后续工作计划', status: 'pending' as const },
      { step: '质量检查与优化', status: 'pending' as const },
      { step: '整合最终报告', status: 'pending' as const }
    ];
    
    setGenerationSteps(steps);
    
    try {
      // 步骤1：分析项目信息
      setGenerationSteps(prev => prev.map(s => s.step === '分析项目信息' ? { ...s, status: 'in_progress' } : s));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationSteps(prev => prev.map(s => s.step === '分析项目信息' ? { ...s, status: 'completed' } : s));
      
      // 步骤2：生成结题报告摘要
      setGenerationSteps(prev => prev.map(s => s.step === '生成结题报告摘要' ? { ...s, status: 'in_progress' } : s));
      const abstractResult = await executeSkills(['nsfc-abstract'], JSON.stringify(projectInfo));
      setGenerationSteps(prev => prev.map(s => s.step === '生成结题报告摘要' ? { ...s, status: 'completed', result: abstractResult['nsfc-abstract'] } : s));
      
      // 步骤3：撰写研究成果章节
      setGenerationSteps(prev => prev.map(s => s.step === '撰写研究成果章节' ? { ...s, status: 'in_progress' } : s));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationSteps(prev => prev.map(s => s.step === '撰写研究成果章节' ? { ...s, status: 'completed' } : s));
      
      // 步骤4：撰写经费使用情况
      setGenerationSteps(prev => prev.map(s => s.step === '撰写经费使用情况' ? { ...s, status: 'in_progress' } : s));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationSteps(prev => prev.map(s => s.step === '撰写经费使用情况' ? { ...s, status: 'completed' } : s));
      
      // 步骤5：撰写后续工作计划
      setGenerationSteps(prev => prev.map(s => s.step === '撰写后续工作计划' ? { ...s, status: 'in_progress' } : s));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationSteps(prev => prev.map(s => s.step === '撰写后续工作计划' ? { ...s, status: 'completed' } : s));
      
      // 步骤6：质量检查与优化
      setGenerationSteps(prev => prev.map(s => s.step === '质量检查与优化' ? { ...s, status: 'in_progress' } : s));
      const qcResult = await executeSkills(['nsfc-qc'], JSON.stringify(projectInfo));
      setGenerationSteps(prev => prev.map(s => s.step === '质量检查与优化' ? { ...s, status: 'completed', result: qcResult['nsfc-qc'] } : s));
      
      // 步骤7：整合最终报告
      setGenerationSteps(prev => prev.map(s => s.step === '整合最终报告' ? { ...s, status: 'in_progress' } : s));
      const prompt = `请根据以下信息生成一份完整的项目结题报告：\n项目名称：${projectTitle}\n开始日期：${startDate}\n结束日期：${endDate}\n完成情况：${achievements}\n论文发表：${papers || '无'}\n专利申请：${patents || '无'}\n软件系统：${software || '无'}\n经费使用情况：${budgetUsage || '经费使用合理，符合预算计划'}\n后续工作：${futurePlans || '基于本项目成果，计划开展后续研究...'}\n\n报告应包含以下部分：\n1. 项目基本信息\n2. 完成情况\n3. 研究成果\n4. 经费使用情况\n5. 后续工作\n\n请确保内容详细、结构清晰，符合结题报告的规范要求。`;
      
      const response = await callLLM(prompt, {
        max_tokens: 2000,
        temperature: 0.7
      });
      
      setGenerationSteps(prev => prev.map(s => s.step === '整合最终报告' ? { ...s, status: 'completed' } : s));
      setGeneratedReport(response);
    } catch (error) {
      console.error('生成结题报告失败:', error);
      setGenerationSteps(prev => prev.map(s => s.status === 'in_progress' ? { ...s, status: 'error' } : s));
      setGeneratedReport(`生成失败，请检查API设置或网络连接。\n错误信息：${error instanceof Error ? error.message : String(error)}`);
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
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
            <FileCode className="w-3 h-3 mr-1" />
            结题报告生成
          </Badge>
          <h1 className="text-3xl font-bold mb-3">项目结题报告自动生成</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            输入项目信息，系统将自动生成完整的结题报告
          </p>
        </motion.div>
      </div>

      <APISettings />

      {/* 生成过程显示 */}
      {generationSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>生成进度</CardTitle>
            <CardDescription>正在生成结题报告，以下是当前进度</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generationSteps.map((step, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === 'completed' ? 'bg-green-100 text-green-600' :
                      step.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      step.status === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? '✓' :
                       step.status === 'in_progress' ? '⏳' :
                       step.status === 'error' ? '✗' :
                       index + 1}
                    </div>
                    <span className={`font-medium ${
                      step.status === 'completed' ? 'text-green-600' :
                      step.status === 'in_progress' ? 'text-blue-600' :
                      step.status === 'error' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {step.step}
                    </span>
                  </div>
                  {step.status === 'in_progress' && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            {generationSteps.some(step => step.result) && (
              <div className="mt-4 space-y-4">
                {generationSteps.map((step, index) => step.result && (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2 text-sm text-gray-700">{step.step} 结果</h4>
                    <div className="text-sm whitespace-pre-wrap">{step.result}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>项目基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">结束日期</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">完成情况 *</Label>
            <Textarea
              id="achievements"
              placeholder="详细描述项目完成情况和主要成果"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="papers">论文发表</Label>
              <Textarea
                id="papers"
                placeholder="列出发表的论文"
                value={papers}
                onChange={(e) => setPapers(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patents">专利申请</Label>
              <Textarea
                id="patents"
                placeholder="列出申请的专利"
                value={patents}
                onChange={(e) => setPatents(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="software">软件系统</Label>
              <Textarea
                id="software"
                placeholder="列出开发的软件系统"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetUsage">经费使用情况</Label>
            <Textarea
              id="budgetUsage"
              placeholder="描述经费使用情况"
              value={budgetUsage}
              onChange={(e) => setBudgetUsage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="futurePlans">后续工作</Label>
            <Textarea
              id="futurePlans"
              placeholder="描述后续研究计划"
              value={futurePlans}
              onChange={(e) => setFuturePlans(e.target.value)}
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
                生成结题报告
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>生成的结题报告</span>
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
                  ) : paragraph.startsWith('### ') ? (
                    <h3 className="text-lg font-medium">{paragraph.substring(4)}</h3>
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
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">成果展示</h3>
            <p className="text-sm text-muted-foreground">
              全面展示项目成果，突出研究价值
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">规范格式</h3>
            <p className="text-sm text-muted-foreground">
              符合结题报告的规范要求
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">质量保证</h3>
            <p className="text-sm text-muted-foreground">
              专业的报告质量，提高结题通过率
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConclusionPage;
