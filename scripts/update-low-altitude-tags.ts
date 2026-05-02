// 脚本：统一低空智能标签
// 运行：npx tsx scripts/update-low-altitude-tags.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpzwefrxckbojbotjxof.supabase.co';
const supabaseKey = 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly';

const supabase = createClient(supabaseUrl, supabaseKey);

// 低空智能标签选项（标准分类）
const LOW_ALTITUDE_TAGS = [
  '低空智能感知',
  '低空具身智能',
  '低空群体智能'
];

async function unifyLowAltitudeTags() {
  console.log('开始统一低空智能标签...\n');

  const { data: models, error } = await supabase
    .from('visdrone_models')
    .select('id, name, low_altitude_tags');

  if (error) {
    console.error('获取模型失败:', error);
    return;
  }

  console.log(`共有 ${models?.length || 0} 个模型\n`);

  let updateCount = 0;

  for (const model of models || []) {
    const tags = model.low_altitude_tags || [];
    let needUpdate = false;
    let newTags: string[] = [];

    if (tags.length === 0) {
      // 无标签的模型，设置为"低空智能感知"（默认）
      newTags = ['低空智能感知'];
      needUpdate = true;
    } else {
      // 检查是否都是标准标签
      const allStandard = tags.every(t => LOW_ALTITUDE_TAGS.includes(t));
      if (!allStandard) {
        // 有非标准标签，只保留第一个并转为标准标签
        newTags = [tags[0]];
        needUpdate = true;
      } else if (tags.length > 1) {
        // 有多个标签，只保留第一个
        newTags = [tags[0]];
        needUpdate = true;
      }
    }

    if (needUpdate) {
      console.log(`更新: ${model.name}`);
      console.log(`  旧标签: ${JSON.stringify(tags)}`);
      console.log(`  新标签: ${JSON.stringify(newTags)}`);

      const { error: updateError } = await supabase
        .from('visdrone_models')
        .update({ low_altitude_tags: newTags })
        .eq('id', model.id);

      if (updateError) {
        console.error(`  更新失败: ${updateError.message}`);
      } else {
        updateCount++;
      }
    }
  }

  console.log(`\n更新完成，共更新 ${updateCount} 个模型`);

  // 重新查询验证
  console.log('\n验证更新后的标签分布:');
  const { data: updatedModels } = await supabase
    .from('visdrone_models')
    .select('low_altitude_tags');

  const tagStats: Record<string, number> = {};
  for (const tag of LOW_ALTITUDE_TAGS) {
    tagStats[tag] = 0;
  }
  tagStats['无标签'] = 0;

  for (const model of updatedModels || []) {
    const tags = model.low_altitude_tags || [];
    if (tags.length === 0) {
      tagStats['无标签']++;
    } else {
      const firstTag = tags[0];
      if (LOW_ALTITUDE_TAGS.includes(firstTag)) {
        tagStats[firstTag]++;
      }
    }
  }

  for (const [tag, count] of Object.entries(tagStats)) {
    console.log(`  ${tag}: ${count}`);
  }
}

unifyLowAltitudeTags();
