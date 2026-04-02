import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpzwefrxckbojbotjxof.supabase.co', 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly');

async function assignLowAltitudeTags() {
  console.log('开始根据任务类型分配低空智能标签...\n');

  const { data: models, error } = await supabase
    .from('visdrone_models')
    .select('id, name, task, low_altitude_tags');

  if (error) {
    console.error('获取模型失败:', error);
    return;
  }

  console.log(`共有 ${models?.length || 0} 个模型\n`);

  const LOW_ALTITUDE_TAGS = ['低空智能感知', '低空群体智能'];
  let updateCount = 0;

  for (const model of models || []) {
    const taskArray = Array.isArray(model.task) ? model.task : [];
    const taskText = taskArray.join(' ').toLowerCase();

    let newTag = '低空智能感知';

    if (taskText.includes('多机协同') ||
        taskText.includes('swarm') ||
        taskText.includes('multi-drone') ||
        taskText.includes('multi drone')) {
      newTag = '低空群体智能';
    }

    const oldTag = model.low_altitude_tags?.[0] || '无';

    if (oldTag !== newTag) {
      console.log(`更新: ${model.name}`);
      console.log(`  旧标签: ${oldTag}`);
      console.log(`  新标签: ${newTag}`);
      console.log(`  任务: ${taskArray.join(', ')}`);

      const { error: updateError } = await supabase
        .from('visdrone_models')
        .update({ low_altitude_tags: [newTag] })
        .eq('id', model.id);

      if (updateError) {
        console.error(`  更新失败: ${updateError.message}`);
      } else {
        updateCount++;
      }
    }
  }

  console.log(`\n更新完成，共更新 ${updateCount} 个模型`);

  console.log('\n验证最终标签分布:');
  const { data: updatedModels } = await supabase
    .from('visdrone_models')
    .select('low_altitude_tags');

  const tagStats: Record<string, number> = {};
  for (const tag of LOW_ALTITUDE_TAGS) {
    tagStats[tag] = 0;
  }

  for (const model of updatedModels || []) {
    const tags = model.low_altitude_tags || [];
    if (tags.length > 0 && LOW_ALTITUDE_TAGS.includes(tags[0])) {
      tagStats[tags[0]]++;
    }
  }

  for (const [tag, count] of Object.entries(tagStats)) {
    console.log(`  ${tag}: ${count}`);
  }
}

assignLowAltitudeTags();
