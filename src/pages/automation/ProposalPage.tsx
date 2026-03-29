import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Sparkles, Brain, Calendar, TrendingUp,
  CheckCircle, BookOpen, Lightbulb, ArrowRight, Clock
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

const ProposalPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('computer-science');
  const [funding, setFunding] = useState('national');
  const [duration, setDuration] = useState('36');
  const [budget, setBudget] = useState('500000');
  const [abstract, setAbstract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<{step: string, content: string, timestamp: number}[]>([]);

  const handleGenerate = async () => {
    if (!title || !abstract) return;
    
    setIsGenerating(true);
    setGeneratedProposal(null);
    setGenerationSteps([]);
    
    try {
      // 步骤1：准备项目信息
      const projectInfo = `项目标题：${title}\n研究领域：${domain}\n基金类型：${funding}\n研究周期：${duration}个月\n预算：${budget}元\n项目摘要：${abstract}`;
      
      setGenerationSteps(prev => [...prev, {
        step: '准备项目信息',
        content: '正在收集和整理项目基本信息...',
        timestamp: Date.now()
      }]);
      
      // 步骤2：生成摘要
      setGenerationSteps(prev => [...prev, {
        step: '生成项目摘要',
        content: '正在生成项目摘要...',
        timestamp: Date.now()
      }]);
      
      const abstractResult = await executeSkills(['nsfc-abstract'], projectInfo);
      setGenerationSteps(prev => [...prev, {
        step: '生成项目摘要',
        content: `摘要生成完成：\n${abstractResult['nsfc-abstract']}`,
        timestamp: Date.now()
      }]);
      
      // 步骤3：生成立项依据
      setGenerationSteps(prev => [...prev, {
        step: '生成立项依据',
        content: '正在生成立项依据...',
        timestamp: Date.now()
      }]);
      
      const justificationResult = await executeSkills(['nsfc-justification-writer'], projectInfo);
      setGenerationSteps(prev => [...prev, {
        step: '生成立项依据',
        content: `立项依据生成完成：\n${justificationResult['nsfc-justification-writer']}`,
        timestamp: Date.now()
      }]);
      
      // 步骤4：生成研究内容
      setGenerationSteps(prev => [...prev, {
        step: '生成研究内容',
        content: '正在生成研究内容...',
        timestamp: Date.now()
      }]);
      
      const researchContentResult = await executeSkills(['nsfc-research-content-writer'], projectInfo);
      setGenerationSteps(prev => [...prev, {
        step: '生成研究内容',
        content: `研究内容生成完成：\n${researchContentResult['nsfc-research-content-writer']}`,
        timestamp: Date.now()
      }]);
      
      // 步骤5：生成研究基础
      setGenerationSteps(prev => [...prev, {
        step: '生成研究基础',
        content: '正在生成研究基础...',
        timestamp: Date.now()
      }]);
      
      const researchFoundationResult = await executeSkills(['nsfc-research-foundation-writer'], projectInfo);
      setGenerationSteps(prev => [...prev, {
        step: '生成研究基础',
        content: `研究基础生成完成：\n${researchFoundationResult['nsfc-research-foundation-writer']}`,
        timestamp: Date.now()
      }]);
      
      // 步骤6：生成完整申请书
      setGenerationSteps(prev => [...prev, {
        step: '生成完整申请书',
        content: '正在整合所有内容，生成完整的项目申请书...',
        timestamp: Date.now()
      }]);
      
      const fullPrompt = `请根据以下信息生成一份完整的项目申请书：\n${projectInfo}\n\n已生成的内容：\n1. 项目摘要：${abstractResult['nsfc-abstract']}\n2. 立项依据：${justificationResult['nsfc-justification-writer']}\n3. 研究内容：${researchContentResult['nsfc-research-content-writer']}\n4. 研究基础：${researchFoundationResult['nsfc-research-foundation-writer']}\n\n请整合以上内容，生成一份结构完整、逻辑清晰的项目申请书，包含以下部分：\n1. 项目摘要\n2. 研究背景\n3. 研究目标\n4. 技术路线\n5. 预期成果\n6. 经费预算\n7. 研究团队\n\n请确保内容专业、结构清晰，符合学术规范。`;
      
      const response = await callLLM(fullPrompt, {
        max_tokens: 3000,
        temperature: 0.7
      });
      
      setGeneratedProposal(response);
      setGenerationSteps(prev => [...prev, {
        step: '生成完整申请书',
        content: '项目申请书生成完成！',
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('生成项目申请书失败:', error);
      setGeneratedProposal(`生成失败，请检查API设置或网络连接。\n错误信息：${error instanceof Error ? error.message : String(error)}`);
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
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <FileText className="w-3 h-3 mr-1" />
            项目申请书生成
          </Badge>
          <h1 className="text-3xl font-bold mb-3">自动撰写项目申请书</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            输入基本信息，系统将自动生成结构完整的项目申请书
          </p>
        </motion.div>
      </div>

      <APISettings />

      <Card>
        <CardHeader>
          <CardTitle>项目基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">项目标题 *</Label>
              <Input
                id="title"
                placeholder="输入项目标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">研究领域</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger>
                  <SelectValue placeholder="选择研究领域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">计算机科学</SelectItem>
                  <SelectItem value="artificial-intelligence">人工智能</SelectItem>
                  <SelectItem value="biology">生物学</SelectItem>
                  <SelectItem value="medicine">医学</SelectItem>
                  <SelectItem value="engineering">工程学</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funding">基金类型</Label>
              <Select value={funding} onValueChange={setFunding}>
                <SelectTrigger>
                  <SelectValue placeholder="选择基金类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">国家自然科学基金</SelectItem>
                  <SelectItem value="provincial">省级基金</SelectItem>
                  <SelectItem value="industry">企业合作</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">研究周期（月）</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="选择研究周期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12个月</SelectItem>
                  <SelectItem value="24">24个月</SelectItem>
                  <SelectItem value="36">36个月</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">预算（元）</Label>
              <Input
                id="budget"
                type="number"
                placeholder="输入预算"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">项目摘要 *</Label>
            <Textarea
              id="abstract"
              placeholder="简要描述项目的研究背景、目标和意义（200-500字）"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!title || !abstract || isGenerating}
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
                生成项目申请书
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
              正在生成项目申请书，以下是详细步骤：
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
      {generatedProposal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>生成的项目申请书</span>
              <Button variant="outline" size="sm">
                下载 Word
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {generatedProposal.split('\n\n').map((paragraph, i) => (
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
                  ) : paragraph.startsWith('1. ') ? (
                    <ol className="list-decimal pl-5">
                      {paragraph.split('\n').filter(p => p).map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ol>
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
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">智能生成</h3>
            <p className="text-sm text-muted-foreground">
              基于大语言模型，自动生成结构完整的项目申请书
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">质量保证</h3>
            <p className="text-sm text-muted-foreground">
              遵循学术规范，结构清晰，内容专业
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">多格式输出</h3>
            <p className="text-sm text-muted-foreground">
              支持 Word、PDF、Markdown 格式下载
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalPage;
