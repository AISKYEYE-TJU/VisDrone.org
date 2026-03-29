#!/usr/bin/env node

import { papers } from '../src/data/visdrone/papers';
import { news } from '../src/data/visdrone/news';
import { datasets } from '../src/data/visdrone/datasets';
import { models } from '../src/data/visdrone/models';
import { teamMembers } from '../src/data/visdrone/team';
import { patents } from '../src/data/visdrone/patents';
import { awards } from '../src/data/visdrone/awards';
import {
  validateAllPapers,
  validateAllNews,
  validateDataset,
  validateModel,
  validateTeamMember,
  validatePatent,
  validateAward,
  printValidationResult,
} from '../src/utils/dataValidator';

console.log('🔍 开始数据验证...\n');

console.log('=== 验证论文 ===');
printValidationResult(validateAllPapers(papers), '论文');

console.log('\n=== 验证新闻 ===');
printValidationResult(validateAllNews(news), '新闻');

console.log('\n=== 验证数据集 ===');
datasets.forEach(d => {
  printValidationResult(validateDataset(d), `数据集: ${d.name}`);
});

console.log('\n=== 验证模型 ===');
models.forEach(m => {
  printValidationResult(validateModel(m), `模型: ${m.name}`);
});

console.log('\n=== 验证团队成员 ===');
teamMembers.forEach(t => {
  printValidationResult(validateTeamMember(t), `成员: ${t.name}`);
});

console.log('\n=== 验证专利 ===');
patents.forEach(p => {
  printValidationResult(validatePatent(p), `专利: ${p.title.substring(0, 20)}...`);
});

console.log('\n=== 验证奖项 ===');
awards.forEach(a => {
  printValidationResult(validateAward(a), `奖项: ${a.title.substring(0, 20)}...`);
});

console.log('\n✅ 验证完成!');
