// 从 ChineseResearchLaTeX 仓库提取的技能
import { callLLM } from '@/config/api';

// 技能类型定义
export interface Skill {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

// 从 ChineseResearchLaTeX 仓库提取的技能
export const chineseResearchSkills: Skill[] = [
  // 文献调研阶段
  {
    id: 'get-review-theme',
    name: '综述主题提取',
    description: '从文件/图片/URL/自然语言描述提取结构化综述主题',
    instructions: `你是一个专业的综述主题提取专家。请从用户提供的输入源中提取结构化的综述主题。

要求：
1. 识别输入类型（文件、图片、URL、自然语言描述）
2. 提取核心主题、关键词和核心问题
3. 生成结构化的输出，包括主题、关键词、核心问题
4. 输出结果应清晰、准确，便于后续的文献综述使用`
  },
  {
    id: 'systematic-literature-review',
    name: '系统综述生成',
    description: 'AI自定检索词，多源检索→去重→AI逐篇阅读并评分，生成专家级综述',
    instructions: `你是一个专业的系统综述专家。请根据用户提供的主题，生成一份专家级的系统综述。

要求：
1. 基于主题自主规划检索词
2. 进行多源检索（Semantic Scholar、arXiv等）
3. 对文献进行去重和相关性评分
4. 生成结构清晰、内容全面的综述
5. 包含参考文献列表和详细分析
6. 支持不同级别的综述深度（Premium、Standard、Basic）`
  },
  {
    id: 'check-review-alignment',
    name: '引用语义一致性检查',
    description: 'AI检查综述正文引用与文献内容的语义一致性，减少幻觉引用',
    instructions: `你是一个专业的学术引用检查专家。请检查用户提供的综述文档中引用与文献内容的语义一致性。

要求：
1. 检查引用的文献是否真实存在
2. 核查引用内容与文献原文是否一致
3. 识别并标记可能的幻觉引用
4. 提供详细的检查报告
5. 只修复致命性引用错误，不做文体优化`
  },
  
  // 标书准备阶段
  {
    id: 'guide-updater',
    name: '项目指南优化',
    description: '基于文献综述结果优化项目指南，明确研究方向和亮点',
    instructions: `你是一个专业的项目指南优化专家。请根据用户提供的文献综述结果，优化项目指南。

要求：
1. 梳理文献综述的核心发现
2. 明确研究的价值和必要性
3. 分析研究现状和存在的问题
4. 提炼研究的亮点和创新点
5. 为后续标书写作提供清晰的方向指引`
  },
  {
    id: 'transfer_old_latex_to_new',
    name: '标书智能迁移',
    description: '将旧标书内容迁移到新模板',
    instructions: `你是一个专业的标书迁移专家。请将用户提供的旧标书内容迁移到新模板。

要求：
1. 分析旧标书的结构和内容
2. 理解新模板的格式要求
3. 将旧内容适配到新模板中
4. 保持内容的完整性和准确性
5. 确保迁移后的标书符合新模板的格式要求`
  },
  
  // 标书写作阶段
  {
    id: 'nsfc-justification-writer',
    name: 'NSFC 立项依据撰写',
    description: '理论创新导向的立项依据写作，构建四段闭环叙事',
    instructions: `你是一个专业的NSFC立项依据撰写专家。请根据用户提供的项目信息，撰写理论创新导向的立项依据。

要求：
1. 构建"价值与必要性 → 现状与不足 → 科学问题/科学假设 → 切入点"四段闭环叙事
2. 识别并改写"绝对化/填补空白"等高风险表述
3. 防止用方法学术语稀释科学问题主线
4. 逻辑严谨，论证充分
5. 符合NSFC立项依据的格式要求`
  },
  {
    id: 'nsfc-research-content-writer',
    name: 'NSFC 研究内容撰写',
    description: '研究内容编排，同步生成特色创新和年度计划',
    instructions: `你是一个专业的NSFC研究内容撰写专家。请根据用户提供的项目信息，撰写研究内容章节。

要求：
1. 详细阐述研究内容和技术路线
2. 同步生成"特色与创新"和"三年年度计划"
3. 确保子目标带"指标/对照/验证方案"三件套
4. 创新点用"相对坐标系"表达
5. 逻辑清晰，结构合理
6. 符合NSFC研究内容的格式要求`
  },
  {
    id: 'nsfc-research-foundation-writer',
    name: 'NSFC 研究基础撰写',
    description: '研究基础编排，同步生成工作条件和风险应对措施',
    instructions: `你是一个专业的NSFC研究基础撰写专家。请根据用户提供的项目信息，撰写研究基础章节。

要求：
1. 详细阐述研究团队的研究基础
2. 同步生成"工作条件"和"风险应对措施"
3. 用"证据链 + 条件对位 + 风险预案"证明项目可行性
4. 突出研究团队的优势和能力
5. 符合NSFC研究基础的格式要求`
  },
  {
    id: 'nsfc-roadmap',
    name: 'NSFC 技术路线图生成',
    description: '从NSFC标书自动生成可打印、A4可读的技术路线图',
    instructions: `你是一个专业的技术路线图设计专家。请根据用户提供的项目信息，生成NSFC技术路线图。

要求：
1. 设计清晰、逻辑严谨的技术路线图
2. 突出关键研究步骤和技术节点
3. 考虑研究的时间顺序和依赖关系
4. 提供可编辑的源文件和可嵌入的渲染结果
5. 确保路线图符合NSFC的要求`
  },
  {
    id: 'nsfc-schematic',
    name: 'NSFC 原理图生成',
    description: '将标书中的研究机制、算法架构转成原理图/机制图',
    instructions: `你是一个专业的科学原理图设计专家。请根据用户提供的项目信息，生成NSFC原理图/机制图。

要求：
1. 设计清晰、专业的原理图/机制图
2. 准确表达研究的核心机制和原理
3. 使用规范的科学符号和标注
4. 提供可编辑的源文件和可嵌入的渲染结果
5. 确保图的质量和美观度`
  },
  {
    id: 'nsfc-abstract',
    name: 'NSFC 摘要撰写',
    description: '标题建议 + 中英文摘要生成，符合NSFC长度要求',
    instructions: `你是一个专业的NSFC标书摘要撰写专家。请根据用户提供的项目信息，撰写一份高质量的NSFC标书摘要。

要求：
1. 提供标题建议（1个推荐标题 + 5个候选标题及理由）
2. 输出中英文双语版本
3. 中文摘要≤400字含标点
4. 英文摘要≤4000字符含标点
5. 英文为中文的忠实翻译，不新增信息
6. 突出项目的创新性和研究价值
7. 语言专业、准确、简洁`
  },
  {
    id: 'nsfc-code',
    name: 'NSFC 申请代码推荐',
    description: '根据标书内容推荐5组NSFC申请代码（主/次）及理由',
    instructions: `你是一个专业的NSFC申请代码推荐专家。请根据用户提供的项目信息，推荐5组NSFC申请代码（主/次）及理由。

要求：
1. 推荐5组申请代码（主/次）
2. 为每组代码提供详细的推荐理由
3. 代码选择应与项目研究内容高度相关
4. 考虑代码的适用性和竞争激烈程度
5. 推荐理由可追溯到标书要点和代码库推荐描述`
  },
  
  // 质量保障
  {
    id: 'nsfc-qc',
    name: 'NSFC 质量控制',
    description: '标书只读质量控制，检查文风、引用风险、篇幅结构、逻辑清晰度',
    instructions: `你是一个专业的NSFC标书质量控制专家。请对用户提供的NSFC标书进行质量检查。

要求：
1. 检查文风的一致性和专业性
2. 评估引用的真实性和相关性
3. 分析篇幅结构的合理性
4. 评估逻辑的清晰度和连贯性
5. 提供具体的改进建议
6. 输出标准化的质量控制报告`
  },
  {
    id: 'nsfc-ref-alignment',
    name: 'NSFC 引用对齐',
    description: '参考文献与正文引用一致性核查（只读）',
    instructions: `你是一个专业的学术引用检查专家。请核查用户提供的NSFC标书正文引用与参考文献的一致性。

要求：
1. 检查bibkey是否存在
2. 检查BibTeX字段完备性与格式
3. 生成结构化输入供AI逐条评估"引用-语义"是否匹配
4. 只生成审核报告，不直接修改标书正文或.bib
5. 保持客观、专业的分析`
  },
  {
    id: 'nsfc-reviewers',
    name: 'NSFC 评审模拟',
    description: '模拟领域专家视角对NSFC标书进行多维度评审',
    instructions: `你是一个专业的NSFC标书评审专家。请模拟领域专家视角，对用户提供的NSFC标书进行多维度评审。

要求：
1. 从创新性、可行性、基础与团队等多个维度进行评审
2. 输出分级问题（P0/P1/P2）与可执行修改建议
3. 支持并行多组评审与跨组共识聚合
4. 给出客观、专业的评审结论
5. 帮助用户了解标书的潜在问题和改进方向`
  },
  {
    id: 'nsfc-length-aligner',
    name: 'NSFC 篇幅调整',
    description: '检查标书篇幅并给出扩写/压缩建议，符合国自然篇幅标准',
    instructions: `你是一个专业的学术文本篇幅调整专家。请检查用户提供的NSFC标书文本，给出扩写/压缩建议。

要求：
1. 分析文本的篇幅情况
2. 识别需要扩写或压缩的部分
3. 提供具体的扩写/压缩建议
4. 确保调整后的文本符合国自然篇幅标准
5. 保持文本的学术质量和逻辑结构`
  },
  {
    id: 'nsfc-humanization',
    name: 'NSFC 文本人性化',
    description: '去除NSFC标书中的AI机器味，使文本更像专家亲笔撰写',
    instructions: `你是一个专业的学术文本润色专家。请对用户提供的NSFC标书文本进行人性化处理。

要求：
1. 保持文本的学术专业性
2. 增强文本的流畅性和自然度
3. 使文本更符合学术写作风格
4. 保留原文的核心内容和逻辑结构
5. 提升文本的可读性和说服力
6. 使文本读起来像资深领域专家亲笔撰写`
  },
  
  // 模板开发阶段
  {
    id: 'make_latex_model',
    name: '样式对齐优化',
    description: '基于PDF/Word模板高保真优化LaTeX样式',
    instructions: `你是一个专业的LaTeX样式优化专家。请根据用户提供的PDF/Word模板，优化LaTeX样式。

要求：
1. 分析PDF/Word模板的样式特点
2. 优化LaTeX模板以实现像素级对齐
3. 仅修改必要的配置文件
4. 保持LaTeX的编译稳定性
5. 确保优化后的样式符合模板要求`
  },
  {
    id: 'complete_example',
    name: '智能示例生成',
    description: '智能示例生成和补全，填充空白章节',
    instructions: `你是一个专业的学术内容生成专家。请根据用户提供的主题，生成智能示例内容。

要求：
1. 基于主题生成相关的示例内容
2. 填充空白章节，使文档完整
3. 内容应专业、准确、符合学术规范
4. 保持与模板的格式一致性
5. 生成的内容应具有参考价值`
  }
];

// 技能执行函数
export const executeSkill = async (skillId: string, input: string): Promise<string> => {
  const skill = chineseResearchSkills.find(s => s.id === skillId);
  if (!skill) {
    throw new Error(`技能 ${skillId} 不存在`);
  }

  const prompt = `${skill.instructions}

输入信息：
${input}

请根据以上信息执行技能，输出结果。`;

  const response = await callLLM(prompt, {
    max_tokens: 1000,
    temperature: 0.7
  });

  return response;
};

// 批量执行技能
export const executeSkills = async (skillIds: string[], input: string): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};

  for (const skillId of skillIds) {
    try {
      const result = await executeSkill(skillId, input);
      results[skillId] = result;
    } catch (error) {
      results[skillId] = `执行技能失败: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return results;
};

// 获取技能列表
export const getSkills = (): Skill[] => {
  return chineseResearchSkills;
};

// 根据ID获取技能
export const getSkillById = (skillId: string): Skill | undefined => {
  return chineseResearchSkills.find(s => s.id === skillId);
};