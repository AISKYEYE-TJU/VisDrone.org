import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zpzwefrxckbojbotjxof.supabase.co', 'sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly');

const MULTI_DRONE_MODELS = ['ACA-GAN', 'ASNet', 'MIA-NET', 'SC', 'CDRS', 'SL'];

async function fixLowAltitudeTags() {
  console.log('修正低空智能标签...\n');

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
    const shouldBeGroup = MULTI_DRONE_MODELS.includes(model.name);
    const newTag = shouldBeGroup ? '低空群体智能' : '低空智能感知';
    const oldTag = model.low_altitude_tags?.[0] || '无';

    if (oldTag !== newTag) {
      console.log(`更新: ${model.name}`);
      console.log(`  旧标签: ${oldTag} -> 新标签: ${newTag}`);

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

  console.log('\n最终标签分布:');
  const { data: updatedModels } = await supabase
    .from('visdrone_models')
    .select('low_altitude_tags');

  const tagStats: Record<string, number> = {
    '低空智能感知': 0,
    '低空群体智能': 0
  };

  for (const model of updatedModels || []) {
    const tags = model.low_altitude_tags || [];
    if (tags.length > 0) {
      if (tags[0] === '低空智能感知') tagStats['低空智能感知']++;
      else if (tags[0] === '低空群体智能') tagStats['低空群体智能']++;
    }
  }

  console.log(`  低空智能感知: ${tagStats['低空智能感知']}`);
  console.log(`  低空群体智能: ${tagStats['低空群体智能']}`);
}

fixLowAltitudeTags();
