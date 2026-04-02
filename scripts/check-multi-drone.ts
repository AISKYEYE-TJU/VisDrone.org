import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpzwefrxckbojbotjxof.supabase.co', 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly');

const MULTI_DRONE_KEYWORDS = ['多机协同', '多机', 'swarm', 'multi-drone', 'multi agent', '多无人机', 'collaborative', 'cooperative'];

async function checkMultiDroneModels() {
  console.log('查找多机协同相关模型...\n');

  const { data: models, error } = await supabase
    .from('visdrone_models')
    .select('id, name, task, description');

  if (error) {
    console.error('获取模型失败:', error);
    return;
  }

  console.log('多机协同相关模型:');
  for (const model of models || []) {
    const taskStr = Array.isArray(model.task) ? model.task.join(' ') : (typeof model.task === 'string' ? model.task : '');
    const descStr = model.description || '';
    const text = (taskStr + ' ' + descStr).toLowerCase();

    const isMultiDrone = MULTI_DRONE_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
    if (isMultiDrone) {
      console.log(`  ${model.name}`);
      console.log(`    任务: ${taskStr}`);
    }
  }

  console.log('\n全部模型及其任务:');
  for (const model of models || []) {
    const taskStr = Array.isArray(model.task) ? model.task.join(', ') : (typeof model.task === 'string' ? model.task : '无');
    console.log(`${model.name}: ${taskStr}`);
  }
}

checkMultiDroneModels();
