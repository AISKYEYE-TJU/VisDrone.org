// 脚本：根据模型描述自动更新任务类型
// 运行：npx tsx scripts/update-model-tasks.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpzwefrxckbojbotjxof.supabase.co';
const supabaseKey = 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly';

const supabase = createClient(supabaseUrl, supabaseKey);

// 任务类型关键词映射
const TASK_KEYWORDS: Record<string, string[]> = {
  '目标检测': ['检测', 'detection', 'yolo', 'rcnn', 'faster r-cnn', 'ssd', 'retinanet', '物体检测', '目标检测'],
  '目标跟踪': ['跟踪', 'tracking', 'track', 'mot', 'sot', '多目标跟踪', '单目标跟踪'],
  '目标计数': ['计数', 'counting', 'count', 'crowd', '人群计数', '密度估计'],
  '底层视觉': ['去雨', '去噪', '去模糊', '超分辨率', '增强', '去雾', 'derain', 'denoise', 'deblur', 'super-resolution', 'enhancement', 'low-level'],
  '图学习': ['图', 'graph', 'gnn', '图神经网络', '图卷积', '图注意力'],
  '多模态学习': ['多模态', 'multimodal', 'rgb-红外', '跨模态', 'infrared', 'thermal', '可见光-红外', '多光谱'],
  '多机协同': ['多机', '多无人机', 'swarm', 'multi-drone', 'multi-agent', '协同', 'cooperative', 'collaborative'],
  '持续学习': ['持续学习', '增量学习', 'continual', 'incremental', 'lifelong', '灾难性遗忘'],
  '半监督学习': ['半监督', 'semi-supervised', 'semi supervised', '少量标注', 'few-shot'],
  '模型架构': ['网络', '架构', 'backbone', 'transformer', 'resnet', 'vit', 'cnn', '神经网络设计']
};

function autoDetectTasks(model: any): string[] {
  const text = [
    model.name || '',
    model.full_name || '',
    model.description || '',
    (model.task || ''),
    (model.features || []).join(' ')
  ].join(' ').toLowerCase();

  const detectedTasks: string[] = [];

  for (const [task, keywords] of Object.entries(TASK_KEYWORDS)) {
    const isMatch = keywords.some(keyword => text.includes(keyword.toLowerCase()));
    if (isMatch) {
      detectedTasks.push(task);
    }
  }

  // 如果没有匹配到任何任务，默认设置为"模型架构"
  if (detectedTasks.length === 0) {
    detectedTasks.push('模型架构');
  }

  return detectedTasks;
}

async function updateModelTasks() {
  console.log('开始更新模型任务类型...');

  const { data: models, error } = await supabase
    .from('visdrone_models')
    .select('*');

  if (error) {
    console.error('获取模型失败:', error);
    return;
  }

  console.log(`找到 ${models?.length || 0} 个模型`);

  for (const model of models || []) {
    const newTasks = autoDetectTasks(model);
    console.log(`\n模型: ${model.name}`);
    console.log(`  旧任务: ${JSON.stringify(model.task)}`);
    console.log(`  新任务: ${JSON.stringify(newTasks)}`);

    const { error: updateError } = await supabase
      .from('visdrone_models')
      .update({ task: newTasks })
      .eq('id', model.id);

    if (updateError) {
      console.error(`  更新失败: ${updateError.message}`);
    } else {
      console.log('  更新成功');
    }
  }

  console.log('\n更新完成！');
}

updateModelTasks();
