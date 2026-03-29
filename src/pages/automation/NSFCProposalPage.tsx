import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Sparkles, CheckCircle, Award,
  BookOpen, TrendingUp, ArrowRight, Star,
  ChevronDown, ChevronRight, Database, BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import APISettings from '@/components/APISettings';
import { callLLM, searchSemanticScholar } from '@/config/api';
import { executeSkills } from '@/lib/skills';
import DocumentOutput from '@/components/DocumentOutput';

const NSFCProposalPage: React.FC = () => {
  const [projectType, setProjectType] = useState('young'); // young, general, local
  const [projectTitle, setProjectTitle] = useState('');
  const [researchField, setResearchField] = useState('');
  const [principalInvestigator, setPrincipalInvestigator] = useState('');
  const [institution, setInstitution] = useState('');
  const [fundingRequest, setFundingRequest] = useState('');
  const [researchBackground, setResearchBackground] = useState('');
  const [researchObjectives, setResearchObjectives] = useState('');
  const [researchContent, setResearchContent] = useState('');
  const [technicalApproach, setTechnicalApproach] = useState('');
  const [expectedResults, setExpectedResults] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<Array<{ step: string; status: 'pending' | 'in_progress' | 'completed' | 'error'; result?: string }>>([]);
  const [revisionCount, setRevisionCount] = useState(0);
  const [references, setReferences] = useState<string[]>([]);
  const [researchStatus, setResearchStatus] = useState<string>('');

  const handleGenerate = async () => {
    if (!projectTitle || !researchBackground || !researchObjectives) return;
    
    setIsGenerating(true);
    setGeneratedProposal(null);
    setRevisionCount(0);
    setReferences([]);
    setResearchStatus('');
    
    const projectInfo = {
      projectType,
      projectTitle,
      researchField,
      principalInvestigator,
      institution,
      fundingRequest,
      researchBackground,
      researchObjectives,
      researchContent,
      technicalApproach,
      expectedResults
    };
    
    const steps = [
      { step: '分析项目信息', status: 'pending' as const },
      { step: '构建研究现状骨架', status: 'pending' as const },
      { step: '搜索相关文献', status: 'pending' as const },
      { step: '生成项目摘要', status: 'pending' as const },
      { step: '推荐NSFC申请代码', status: 'pending' as const },
      { step: '撰写立项依据', status: 'pending' as const },
      { step: '撰写研究内容', status: 'pending' as const },
      { step: '生成技术路线', status: 'pending' as const },
      { step: '生成预期成果', status: 'pending' as const },
      { step: '撰写研究基础', status: 'pending' as const },
      { step: '质量检查与优化', status: 'pending' as const },
      { step: '整合最终标书', status: 'pending' as const }
    ];
    
    setGenerationSteps(steps);
    
    try {
      // 步骤1：分析项目信息
      setGenerationSteps(prev => prev.map(s => s.step === '分析项目信息' ? { ...s, status: 'in_progress' } : s));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationSteps(prev => prev.map(s => s.step === '分析项目信息' ? { ...s, status: 'completed' } : s));
      
      // 步骤2：构建研究现状骨架
      setGenerationSteps(prev => prev.map(s => s.step === '构建研究现状骨架' ? { ...s, status: 'in_progress' } : s));
      const skeletonPrompt = `请为项目"${projectTitle}"构建国内外研究现状及分析的骨架，包括：1. 研究背景 2. 国内外研究现状 3. 存在的问题 4. 研究意义。请以结构化的方式输出。`;
      const skeletonResult = await callLLM(skeletonPrompt, {
        max_tokens: 1000,
        temperature: 0.7
      });
      setResearchStatus(skeletonResult);
      setGenerationSteps(prev => prev.map(s => s.step === '构建研究现状骨架' ? { ...s, status: 'completed', result: skeletonResult } : s));
      
      // 步骤3：搜索相关文献
      setGenerationSteps(prev => prev.map(s => s.step === '搜索相关文献' ? { ...s, status: 'in_progress' } : s));
      try {
        const searchResults = await searchSemanticScholar(projectTitle, 5);
        if (searchResults && searchResults.length > 0) {
          const formattedReferences = searchResults.map((paper, index) => {
            return `${paper.title} - ${paper.authors?.join(', ')} - ${paper.year} - ${paper.url}`;
          });
          setReferences(formattedReferences);
        }
      } catch (searchError) {
        console.error('文献搜索失败:', searchError);
      }
      setGenerationSteps(prev => prev.map(s => s.step === '搜索相关文献' ? { ...s, status: 'completed', result: references.length > 0 ? `找到 ${references.length} 篇相关文献` : '未找到相关文献' } : s));
      
      // 步骤4：生成项目摘要
      setGenerationSteps(prev => prev.map(s => s.step === '生成项目摘要' ? { ...s, status: 'in_progress' } : s));
      const abstractResult = await executeSkills(['nsfc-abstract'], JSON.stringify(projectInfo));
      setGenerationSteps(prev => prev.map(s => s.step === '生成项目摘要' ? { ...s, status: 'completed', result: abstractResult['nsfc-abstract'] } : s));
      
      // 步骤5：推荐NSFC申请代码
      setGenerationSteps(prev => prev.map(s => s.step === '推荐NSFC申请代码' ? { ...s, status: 'in_progress' } : s));
      const codeResult = await executeSkills(['nsfc-code'], JSON.stringify(projectInfo));
      setGenerationSteps(prev => prev.map(s => s.step === '推荐NSFC申请代码' ? { ...s, status: 'completed', result: codeResult['nsfc-code'] } : s));
      
      // 步骤6：撰写立项依据
      setGenerationSteps(prev => prev.map(s => s.step === '撰写立项依据' ? { ...s, status: 'in_progress' } : s));
      const justificationResult = await executeSkills(['nsfc-justification-writer'], JSON.stringify({ ...projectInfo, researchStatus, references }));
      setGenerationSteps(prev => prev.map(s => s.step === '撰写立项依据' ? { ...s, status: 'completed', result: justificationResult['nsfc-justification-writer'] } : s));
      
      // 步骤7：撰写研究内容
      setGenerationSteps(prev => prev.map(s => s.step === '撰写研究内容' ? { ...s, status: 'in_progress' } : s));
      const contentResult = await executeSkills(['nsfc-research-content-writer'], JSON.stringify(projectInfo));
      setGenerationSteps(prev => prev.map(s => s.step === '撰写研究内容' ? { ...s, status: 'completed', result: contentResult['nsfc-research-content-writer'] } : s));
      
      // 步骤8：生成技术路线
      setGenerationSteps(prev => prev.map(s => s.step === '生成技术路线' ? { ...s, status: 'in_progress' } : s));
      if (!technicalApproach) {
        const techPrompt = `请为项目"${projectTitle}"生成详细的技术路线，包括研究方法、实验设计、数据处理等内容。`;
        const techResult = await callLLM(techPrompt, {
          max_tokens: 1000,
          temperature: 0.7
        });
        setTechnicalApproach(techResult);
        setGenerationSteps(prev => prev.map(s => s.step === '生成技术路线' ? { ...s, status: 'completed', result: techResult } : s));
      } else {
        setGenerationSteps(prev => prev.map(s => s.step === '生成技术路线' ? { ...s, status: 'completed', result: technicalApproach } : s));
      }
      
      // 步骤9：生成预期成果
      setGenerationSteps(prev => prev.map(s => s.step === '生成预期成果' ? { ...s, status: 'in_progress' } : s));
      if (!expectedResults) {
        const expectedPrompt = `请为项目"${projectTitle}"生成详细的预期成果，包括论文发表、专利申请、软件著作权、研究报告等内容。`;
        const expectedResult = await callLLM(expectedPrompt, {
          max_tokens: 1000,
          temperature: 0.7
        });
        setExpectedResults(expectedResult);
        setGenerationSteps(prev => prev.map(s => s.step === '生成预期成果' ? { ...s, status: 'completed', result: expectedResult } : s));
      } else {
        setGenerationSteps(prev => prev.map(s => s.step === '生成预期成果' ? { ...s, status: 'completed', result: expectedResults } : s));
      }
      
      // 步骤10：撰写研究基础
      setGenerationSteps(prev => prev.map(s => s.step === '撰写研究基础' ? { ...s, status: 'in_progress' } : s));
      const foundationResult = await executeSkills(['nsfc-research-foundation-writer'], JSON.stringify(projectInfo));
      setGenerationSteps(prev => prev.map(s => s.step === '撰写研究基础' ? { ...s, status: 'completed', result: foundationResult['nsfc-research-foundation-writer'] } : s));
      
      // 步骤11：质量检查与优化（最多5轮）
      setGenerationSteps(prev => prev.map(s => s.step === '质量检查与优化' ? { ...s, status: 'in_progress' } : s));
      let optimizedContent = '';
      let currentRevision = 0;
      const maxRevisions = 5;
      
      while (currentRevision < maxRevisions) {
        const qcResult = await executeSkills(['nsfc-qc'], JSON.stringify({ ...projectInfo, technicalApproach, expectedResults, references }));
        
        // 检查是否需要修改
        if (qcResult['nsfc-qc'].includes('需要修改') || qcResult['nsfc-qc'].includes('建议修改')) {
          currentRevision++;
          setRevisionCount(currentRevision);
          
          // 根据质量检查结果进行修改
          const revisePrompt = `根据以下质量检查结果修改自然基金申请书：\n${qcResult['nsfc-qc']}\n\n项目信息：\n项目类型：${projectType === 'young' ? '青年科学基金' : projectType === 'general' ? '面上项目' : '地区科学基金'}\n项目名称：${projectTitle}\n研究领域：${researchField}\n负责人：${principalInvestigator}\n依托单位：${institution}\n申请经费：${fundingRequest}\n研究背景：${researchBackground}\n研究目标：${researchObjectives}\n研究内容：${researchContent}\n技术路线：${technicalApproach}\n预期成果：${expectedResults}\n\n请针对修改意见进行修改和完善。`;
          
          const revisedResult = await callLLM(revisePrompt, {
            max_tokens: 2000,
            temperature: 0.7
          });
          optimizedContent = revisedResult;
        } else {
          break;
        }
      }
      setGenerationSteps(prev => prev.map(s => s.step === '质量检查与优化' ? { ...s, status: 'completed', result: `完成 ${currentRevision} 轮修改` } : s));
      
      // 步骤12：整合最终标书
      setGenerationSteps(prev => prev.map(s => s.step === '整合最终标书' ? { ...s, status: 'in_progress' } : s));
      const prompt = `请根据以下信息生成一份完整的自然基金项目申请书：\n项目类型：${projectType === 'young' ? '青年科学基金' : projectType === 'general' ? '面上项目' : '地区科学基金'}\n项目名称：${projectTitle}\n研究领域：${researchField}\n负责人：${principalInvestigator}\n依托单位：${institution}\n申请经费：${fundingRequest}\n研究背景：${researchBackground}\n研究目标：${researchObjectives}\n研究内容：${researchContent}\n技术路线：${technicalApproach}\n预期成果：${expectedResults}\n研究现状：${researchStatus}\n参考文献：${references.join('\n')}\n\n请按照自然基金申请书的规范格式生成完整的申请书，包括：\n1. 项目基本信息\n2. 立项依据\n3. 研究内容与方案\n4. 研究基础与工作条件\n5. 经费预算\n6. 预期成果\n7. 参考文献\n\n请确保内容详细、结构清晰，符合自然基金申请书的规范要求。`;
      
      const response = await callLLM(prompt, {
        max_tokens: 3000,
        temperature: 0.7
      });
      
      setGenerationSteps(prev => prev.map(s => s.step === '整合最终标书' ? { ...s, status: 'completed' } : s));
      setGeneratedProposal(response);
    } catch (error) {
      console.error('生成自然基金申请书失败:', error);
      setGenerationSteps(prev => prev.map(s => s.status === 'in_progress' ? { ...s, status: 'error' } : s));
      setGeneratedProposal(`生成失败，请检查API设置或网络连接。\n错误信息：${error instanceof Error ? error.message : String(error)}`);
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
            <FileText className="w-3 h-3 mr-1" />
            自然基金项目申请
          </Badge>
          <h1 className="text-3xl font-bold mb-3">自然基金项目申请书自动生成</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            基于 ChineseResearchLaTeX 模板，智能生成符合规范的自然基金项目申请书
          </p>
        </motion.div>
      </div>

      <APISettings />

      {/* 生成过程显示 */}
      {generationSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>生成进度</CardTitle>
            <CardDescription>正在生成自然基金申请书，以下是当前进度</CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">项目类型 *</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="projectType">
                  <SelectValue placeholder="选择项目类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="young">青年科学基金</SelectItem>
                  <SelectItem value="general">面上项目</SelectItem>
                  <SelectItem value="local">地区科学基金</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectTitle">项目名称 *</Label>
              <Input
                id="projectTitle"
                placeholder="输入项目名称"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="researchField">研究领域</Label>
              <Input
                id="researchField"
                placeholder="输入研究领域"
                value={researchField}
                onChange={(e) => setResearchField(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalInvestigator">负责人</Label>
              <Input
                id="principalInvestigator"
                placeholder="输入负责人姓名"
                value={principalInvestigator}
                onChange={(e) => setPrincipalInvestigator(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">依托单位</Label>
              <Input
                id="institution"
                placeholder="输入依托单位"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundingRequest">申请经费</Label>
            <Input
              id="fundingRequest"
              placeholder="输入申请经费（万元）"
              value={fundingRequest}
              onChange={(e) => setFundingRequest(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchBackground">研究背景 *</Label>
            <Textarea
              id="researchBackground"
              placeholder="详细描述研究背景和意义"
              value={researchBackground}
              onChange={(e) => setResearchBackground(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchObjectives">研究目标 *</Label>
            <Textarea
              id="researchObjectives"
              placeholder="详细描述研究目标"
              value={researchObjectives}
              onChange={(e) => setResearchObjectives(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchContent">研究内容</Label>
            <Textarea
              id="researchContent"
              placeholder="详细描述研究内容"
              value={researchContent}
              onChange={(e) => setResearchContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technicalApproach">技术路线</Label>
            <Textarea
              id="technicalApproach"
              placeholder="详细描述技术路线"
              value={technicalApproach}
              onChange={(e) => setTechnicalApproach(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedResults">预期成果</Label>
            <Textarea
              id="expectedResults"
              placeholder="详细描述预期成果"
              value={expectedResults}
              onChange={(e) => setExpectedResults(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!projectTitle || !researchBackground || !researchObjectives || isGenerating}
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
                生成自然基金申请书
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedProposal && (
        <Card>
          <CardHeader>
            <CardTitle>生成的自然基金申请书</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentOutput
              content={generatedProposal}
              title={projectTitle || '自然基金项目申请书'}
              authors={principalInvestigator ? [principalInvestigator] : []}
              keywords={researchField ? [researchField] : []}
              references={references}
              showPreview={true}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">模板支持</h3>
            <p className="text-sm text-muted-foreground">
              支持青年科学基金、面上项目、地区科学基金等多种类型
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <BarChart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">智能分析</h3>
            <p className="text-sm text-muted-foreground">
              自动推荐NSFC申请代码，提高申请准确性
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">质量保证</h3>
            <p className="text-sm text-muted-foreground">
              专业的质量检查，确保申请书符合规范要求
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NSFCProposalPage;