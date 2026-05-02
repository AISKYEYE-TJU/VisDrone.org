export const NEWS_CATEGORIES = [
  '学术交流',
  '学术活动',
  '平台建设',
  '科研项目',
  '学术成果',
  '竞赛获奖',
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];

export const PAPER_TYPES = ['conference', 'journal'] as const;
export type PaperType = typeof PAPER_TYPES[number];

export const PATENT_TYPES = ['发明', '实用新型', '外观设计'] as const;
export type PatentType = typeof PATENT_TYPES[number];

export const TEAM_ROLES = [
  'PI',
  'Professor',
  'PhD',
  'Master',
  'Visiting',
  'Alumni',
] as const;
export type TeamRole = typeof TEAM_ROLES[number];

export const DATASET_CATEGORIES = [
  '低空环境感知',
  '低空群体智能',
  '低空具身智能',
] as const;
export type DatasetCategory = typeof DATASET_CATEGORIES[number];

export const MODEL_TASKS = [
  '目标检测',
  '目标跟踪',
  '目标计数',
  '底层视觉',
  '图学习',
  '多模态学习',
  '多机协同',
  '持续学习',
  '半监督学习',
  '模型架构',
] as const;
export type ModelTask = typeof MODEL_TASKS[number];

export const MODEL_LOW_ALTITUDE_TAGS = [
  '低空智能感知',
  '低空具身智能',
  '低空群体智能',
] as const;
export type ModelLowAltitudeTag = typeof MODEL_LOW_ALTITUDE_TAGS[number];

export const SEMINAR_GROUP_OPTIONS = ['learning', 'multimodal', 'embodied'] as const;
export type SeminarGroup = typeof SEMINAR_GROUP_OPTIONS[number];

export const SEMINAR_GROUPS: { value: SeminarGroup; label: string }[] = [
  { value: 'learning', label: '学习范式' },
  { value: 'multimodal', label: '多模态学习' },
  { value: 'embodied', label: '具身智能' },
];

export const SEMINAR_TYPE_OPTIONS = ['group_meeting', 'invited_talk', 'workshop'] as const;
export type SeminarType = typeof SEMINAR_TYPE_OPTIONS[number];

export const SEMINAR_TYPES: { value: SeminarType; label: string }[] = [
  { value: 'group_meeting', label: '组会' },
  { value: 'invited_talk', label: '特邀报告' },
  { value: 'workshop', label: '学术会议' },
];
