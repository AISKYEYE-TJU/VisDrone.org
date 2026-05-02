# VisDrone 数据 ID 命名规范

## 一、规范目的

统一数据 ID 命名规则，确保：
- **唯一性**：每个数据项拥有全局唯一 ID
- **可读性**：通过 ID 可快速识别数据类型和时间
- **可排序**：ID 支持自然排序，便于管理

## 二、ID 格式

### 2.1 通用格式

```
{module}-{YYYYMMDD}-{sequence}
```

| 部分 | 说明 | 示例 |
|------|------|------|
| `{module}` | 模块标识 | `news`, `paper`, `dataset`, `model`, `patent`, `award`, `team` |
| `{YYYYMMDD}` | 日期 | `20260322` |
| `{sequence}` | 序号 | `001`, `002` (当日内自增) |

### 2.2 各模块 ID 规范

| 模块 | ID 示例 | 说明 |
|------|---------|------|
| 新闻 | `news-20260322-001` | 日期+序号 |
| 论文 | `paper-20260322-001` | 日期+序号 |
| 数据集 | `dataset-20260322-001` | 日期+序号 |
| 模型 | `model-20260322-001` | 日期+序号 |
| 专利 | `patent-20260322-001` | 日期+序号 |
| 奖项 | `award-20260322-001` | 日期+序号 |
| 团队成员 | `team-20260322-001` | 日期+序号 |

## 三、ID 生成规则

### 3.1 新增数据

1. 确定模块类型
2. 确定日期（使用当天日期）
3. 查询当日最大序号，生成下一序号
4. 组合生成完整 ID

### 3.2 序号计算

```typescript
// 示例：计算当日序号
function generateSequence(module: string, date: string): string {
  const existing = getExistingIdsForDate(module, date);
  const nextSeq = existing.length + 1;
  return nextSeq.toString().padStart(3, '0');
}

// 生成完整 ID
function generateId(module: string, date: Date): string {
  const dateStr = formatDate(date); // YYYYMMDD
  const seq = generateSequence(module, dateStr);
  return `${module}-${dateStr}-${seq}`;
}
```

## 四、ID 迁移指南

### 4.1 现有 ID 格式

| 模块 | 当前格式 | 示例 |
|------|----------|------|
| 新闻 | 数字 | `1`, `2`, `3` |
| 论文 | `paper-{n}` | `paper-1`, `paper-2` |
| 数据集 | 数字 | `1`, `2`, `3` |
| 模型 | 数字 | `1`, `2` |
| 专利 | 数字 | `1`, `2` |
| 奖项 | 数字 | `1`, `2` |
| 团队成员 | 数字 | `1`, `2` |

### 4.2 迁移策略

**渐进式迁移**：
1. 新增数据使用新格式
2. 现有数据保持不变
3. 在维护文档中记录历史 ID 映射

### 4.3 ID 映射表

```typescript
// 在数据文件中保留旧 ID 作为 reference
const ID_MAPPING = {
  // 新闻
  '1': 'news-20240115-001',  // 旧:新

  // 论文
  'paper-1': 'paper-20260322-001',
  'paper-2': 'paper-20260322-002',

  // 数据集
  '1': 'dataset-20240101-001',  // VisDrone
  '2': 'dataset-20240101-002',  // DroneVehicle
};
```

## 五、使用场景

### 5.1 Admin 后台

Admin 后台自动处理 ID 生成，确保唯一性。

### 5.2 数据库

```sql
-- 示例：查询特定日期的新闻
SELECT * FROM visdrone_news
WHERE id LIKE 'news-20260322-%'
ORDER BY id;
```

### 5.3 Git Commit

```bash
# 推荐 commit message 格式
git commit -m "feat(news): add news-20260322-001 - 新论文发表"

# ID 在 commit message 中方便追溯
git log --grep="news-20260322"
```

## 六、约束与验证

### 6.1 ID 校验规则

```typescript
const ID_PATTERN = /^(news|paper|dataset|model|patent|award|team)-\d{8}-\d{3}$/;

function isValidId(id: string): boolean {
  return ID_PATTERN.test(id);
}
```

### 6.2 数据库 CHECK 约束

```sql
ALTER TABLE visdrone_news
ADD CONSTRAINT check_news_id_format
CHECK (id ~ '^(news)-\d{8}-\d{3}$');
```

---

## 附录：现有数据 ID 映射参考

| 模块 | 旧 ID | 建议新 ID | 备注 |
|------|-------|-----------|------|
| 新闻 | `1` | `news-20240115-001` | 首个新闻 |
| 论文 | `paper-1` | `paper-20260322-001` | 2026年第一篇 |
| 数据集 | `1` | `dataset-20240101-001` | VisDrone |
| 专利 | `1` | `patent-20240101-001` | 首个专利 |
| 奖项 | `1` | `award-20240101-001` | 首个奖项 |
