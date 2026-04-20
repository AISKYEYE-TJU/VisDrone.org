import type { NewsItem, Paper, Dataset, Model, TeamMember, Patent, Award } from '@/types/visdrone';
import {
  NEWS_CATEGORIES,
  PAPER_TYPES,
  TEAM_ROLES,
  DATASET_CATEGORIES,
  PATENT_TYPES,
} from '@/types/visdrone/constants';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  module: string;
  id: string;
  field: string;
  message: string;
}

export interface ValidationWarning {
  module: string;
  id: string;
  field: string;
  message: string;
}

export function validateNewsItem(item: NewsItem): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'news', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.title) errors.push({ module: 'news', id: item.id, field: 'title', message: '标题不能为空' });
  if (!item.url) errors.push({ module: 'news', id: item.id, field: 'url', message: '链接不能为空' });
  if (!item.date) errors.push({ module: 'news', id: item.id, field: 'date', message: '日期不能为空' });
  if (!item.excerpt) errors.push({ module: 'news', id: item.id, field: 'excerpt', message: '摘要不能为空' });

  if (!NEWS_CATEGORIES.includes(item.category as any)) {
    warnings.push({
      module: 'news',
      id: item.id,
      field: 'category',
      message: `分类 "${item.category}" 不在标准分类列表中`
    });
  }

  if (item.date && !/^\d{4}-\d{2}$/.test(item.date)) {
    errors.push({ module: 'news', id: item.id, field: 'date', message: '日期格式应为 YYYY-MM' });
  }

  if (item.image && !item.image.startsWith('http') && !item.image.startsWith('/')) {
    warnings.push({
      module: 'news',
      id: item.id,
      field: 'image',
      message: '图片路径建议使用绝对 URL 或以 / 开头'
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validatePaper(item: Paper): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'paper', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.title) errors.push({ module: 'paper', id: item.id, field: 'title', message: '标题不能为空' });
  if (!item.authors || item.authors.length === 0) {
    errors.push({ module: 'paper', id: item.id, field: 'authors', message: '作者列表不能为空' });
  }
  if (!item.venue) errors.push({ module: 'paper', id: item.id, field: 'venue', message: '期刊/会议不能为空' });
  if (!item.year) errors.push({ module: 'paper', id: item.id, field: 'year', message: '年份不能为空' });

  if (item.year && (item.year < 2000 || item.year > 2030)) {
    warnings.push({
      module: 'paper',
      id: item.id,
      field: 'year',
      message: `年份 ${item.year} 超出合理范围 (2000-2030)`
    });
  }

  if (item.type && !PAPER_TYPES.includes(item.type)) {
    errors.push({
      module: 'paper',
      id: item.id,
      field: 'type',
      message: `类型 "${item.type}" 必须是 ${PAPER_TYPES.join(' 或 ')}`
    });
  }

  if (item.pdfUrl && !item.pdfUrl.startsWith('http')) {
    warnings.push({ module: 'paper', id: item.id, field: 'pdfUrl', message: 'PDF URL 建议使用完整 URL' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateDataset(item: Dataset): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'dataset', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.name) errors.push({ module: 'dataset', id: item.id, field: 'name', message: '名称不能为空' });
  if (!item.full_name) errors.push({ module: 'dataset', id: item.id, field: 'full_name', message: '全称不能为空' });
  if (!item.description) errors.push({ module: 'dataset', id: item.id, field: 'description', message: '描述不能为空' });
  if (!item.github) warnings.push({ module: 'dataset', id: item.id, field: 'github', message: '建议提供 GitHub 链接' });

  if (item.category && !DATASET_CATEGORIES.includes(item.category as any)) {
    warnings.push({
      module: 'dataset',
      id: item.id,
      field: 'category',
      message: `分类 "${item.category}" 不在标准分类中`
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateModel(item: Model): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'model', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.name) errors.push({ module: 'model', id: item.id, field: 'name', message: '名称不能为空' });
  if (!item.description) errors.push({ module: 'model', id: item.id, field: 'description', message: '描述不能为空' });
  if (!item.task) errors.push({ module: 'model', id: item.id, field: 'task', message: '任务类型不能为空' });
  if (!item.github) warnings.push({ module: 'model', id: item.id, field: 'github', message: '建议提供 GitHub 链接' });

  return { valid: errors.length === 0, errors, warnings };
}

export function validateTeamMember(item: TeamMember): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'team', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.name) errors.push({ module: 'team', id: item.id, field: 'name', message: '姓名不能为空' });
  if (!item.role) errors.push({ module: 'team', id: item.id, field: 'role', message: '角色不能为空' });
  if (!item.bio) errors.push({ module: 'team', id: item.id, field: 'bio', message: '个人简介不能为空' });

  if (item.role && !TEAM_ROLES.includes(item.role as any)) {
    warnings.push({
      module: 'team',
      id: item.id,
      field: 'role',
      message: `角色 "${item.role}" 不在标准角色列表中`
    });
  }

  if (item.email && !item.email.includes('@')) {
    warnings.push({ module: 'team', id: item.id, field: 'email', message: '邮箱格式可能不正确' });
  }

  if (item.homepage && !item.homepage.startsWith('http')) {
    warnings.push({ module: 'team', id: item.id, field: 'homepage', message: '个人主页建议使用完整 URL' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validatePatent(item: Patent): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'patent', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.title) errors.push({ module: 'patent', id: item.id, field: 'title', message: '标题不能为空' });
  if (!item.number) errors.push({ module: 'patent', id: item.id, field: 'number', message: '专利号不能为空' });
  if (!item.date) errors.push({ module: 'patent', id: item.id, field: 'date', message: '日期不能为空' });

  if (item.type && !PATENT_TYPES.includes(item.type)) {
    errors.push({
      module: 'patent',
      id: item.id,
      field: 'type',
      message: `类型必须是 ${PATENT_TYPES.join(' 或 ')}`
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateAward(item: Award): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!item.id) errors.push({ module: 'award', id: item.id || 'unknown', field: 'id', message: 'ID 不能为空' });
  if (!item.title) errors.push({ module: 'award', id: item.id, field: 'title', message: '奖项名称不能为空' });
  if (!item.date) errors.push({ module: 'award', id: item.id, field: 'date', message: '日期不能为空' });

  return { valid: errors.length === 0, errors, warnings };
}

export function validateAllNews(items: NewsItem[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  items.forEach(item => {
    const result = validateNewsItem(item);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return { valid: allErrors.length === 0, errors: allErrors, warnings: allWarnings };
}

export function validateAllPapers(items: Paper[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  items.forEach(item => {
    const result = validatePaper(item);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return { valid: allErrors.length === 0, errors: allErrors, warnings: allWarnings };
}

export function printValidationResult(result: ValidationResult, module: string): void {
  if (result.valid) {
    console.log(`✅ ${module}: 验证通过`);
  } else {
    console.error(`❌ ${module}: 验证失败`);
    result.errors.forEach(e => {
      console.error(`   [${e.module}:${e.id}] ${e.field}: ${e.message}`);
    });
  }

  if (result.warnings.length > 0) {
    console.warn(`⚠️  ${module}: ${result.warnings.length} 个警告`);
    result.warnings.forEach(w => {
      console.warn(`   [${w.module}:${w.id}] ${w.field}: ${w.message}`);
    });
  }
}
