# VisDrone 网站维护手册

## 一、系统概述

VisDrone 网站基于 React + TypeScript 构建，使用 Supabase 作为云数据库，支持数据的实时更新和管理。

**技术栈**：
- 前端框架：React 18 + TypeScript
- 路由：React Router v6
- UI：Tailwind CSS + shadcn/ui
- 数据库：Supabase
- CI/CD：GitHub Actions
- 部署：GitHub Pages

---

## 二、数据文件说明

### 2.1 数据文件列表

| 文件 | 说明 | 主键格式 |
|------|------|----------|
| `news.ts` | 新闻动态 | `news-YYYYMMDD-XXX` |
| `datasets.ts` | 数据集 | `dataset-XXX` |
| `models.ts` | 模型 | `model-XXX` |
| `papers.ts` | 论文 | `paper-XXX` |
| `patents.ts` | 专利 | `patent-YYYYMMDD-XXX` |
| `awards.ts` | 获奖 | `award-XXX` |
| `team.ts` | 团队成员 | `member-XXX` |
| `seminars.ts` | 学术活动 | `l/m/e/t + 序号` |

### 2.2 学术活动数据

学术活动包含组会、特邀报告、学术会议三种类型：

```
seminars.ts
├── seminars[]     # 组会 (68条)
│   ├── l1-l19    # 学习范式组会
│   ├── m1-m21    # 多模态学习组会
│   └── e1-e28    # 具身智能组会
└── talks[]       # 特邀报告 (8条)
```

---

## 三、日常维护操作

### 3.1 添加新闻

**方式一：Admin 后台**
1. 访问 `/visdrone/admin`
2. 点击"新闻管理"
3. 点击"添加新闻"
4. 填写表单后保存

**方式二：手动编辑**
```typescript
// 编辑 src/data/visdrone/news.ts
{
  id: 'news-20260326-001',
  title: '新闻标题',
  link: 'https://...',
  date: '2026-03',
  summary: '简要描述...',
  category: 'achievement', // achievement|academic|activity|other
  image: 'https://...' // 可选
}
```

### 3.2 添加论文

```typescript
// 编辑 src/data/visdrone/papers.ts
{
  id: 'paper-001',  // 唯一ID
  title: '论文标题',
  authors: ['作者1', '作者2'],
  venue: 'CVPR 2025',
  year: 2025,
  type: 'conference', // conference | journal
  doi: '10.xxx/xxx',
  pdf_url: 'https://arxiv.org/...',
  github: 'https://github.com/...', // 可选
}
```

### 3.3 添加模型

```typescript
// 编辑 src/data/visdrone/models.ts
{
  id: 'unique-model-id',  // 唯一ID（URL slug）
  name: 'ModelName',
  full_name: 'Full Model Name',
  description: '模型描述...',
  task: '任务类型',
  paper_title: '对应论文标题',
  paper_venue: '会议/期刊',
  paper_year: 2025,
  github: 'https://github.com/...',
  stars: 100,  // GitHub stars 数
  features: ['特性1', '特性2'],
}
```

### 3.4 添加学术活动

**组会**：
```typescript
{
  id: 'l20',  // 学习范式第20个
  title: '论文标题',
  date: '2026-03-26',
  type: 'group_meeting',
  group: 'learning', // learning | multimodal | embodied
  ppt_url: 'https://...',  // 可选
  paper_url: 'https://...', // 可选
}
```

**特邀报告**：
```typescript
{
  id: 't9',  // 第9个特邀报告
  title: '报告标题',
  date: '2026',
  type: 'invited_talk',
  ppt_url: 'https://...',
}
```

---

## 四、数据同步

### 4.1 同步到 Supabase

当 TypeScript 文件更新后，需要同步到 Supabase：

1. 登录 Admin 后台 `/visdrone/admin`
2. 进入"数据同步"页面
3. 点击对应模块的"同步到数据库"按钮

**注意**：
- 首次同步前需在 Supabase 中添加对应表的 `group` 列
- SQL: `ALTER TABLE visdrone_seminars ADD COLUMN "group" TEXT DEFAULT 'learning';`

### 4.2 GitHub Actions 自动同步

每次 `git push` 后，GitHub Actions 会自动：
1. 构建项目
2. 同步数据到 Supabase
3. 部署到 GitHub Pages

### 4.3 RLS 策略

如果 Supabase 同步失败，检查表是否启用了 RLS：
```sql
ALTER TABLE visdrone_seminars DISABLE ROW LEVEL SECURITY;
```

---

## 五、常见问题处理

### 5.1 TypeScript 编译错误

```bash
# 检查类型错误
npx tsc --noEmit

# 常见错误修复
# - 缺少分号
# - 类型不匹配
# - 导入路径错误
```

### 5.2 Supabase 连接失败

1. 检查环境变量配置
2. 确认 Supabase 项目状态
3. 检查 RLS 策略设置

### 5.3 GitHub Actions 构建失败

1. 查看 Actions 日志
2. 常见问题：
   - 依赖安装失败 → 清除缓存重新安装
   - 类型错误 → 本地 `npm run typecheck` 检查
   - 环境变量缺失 → 检查 GitHub Secrets 配置

---

## 六、数据库表结构

### 6.1 visdrone_seminars 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 (l1, m2, t3...) |
| title | TEXT | 标题 |
| date | TEXT | 日期 |
| type | TEXT | 类型 |
| group | TEXT | 分组 |
| ppt_url | TEXT | PPT链接 |
| paper_url | TEXT | 论文链接 |
| video_url | TEXT | 视频链接 |
| speaker | TEXT | 演讲者 |
| abstract | TEXT | 摘要 |

### 6.2 添加新字段

如果需要添加新字段到数据库表：

```sql
ALTER TABLE visdrone_seminars ADD COLUMN new_field TEXT;
```

然后更新对应的 TypeScript 类型定义和映射函数。

---

## 七、备份与恢复

### 7.1 数据备份

1. **Supabase Dashboard**：在 Supabase 控制台手动导出数据
2. **Git 备份**：所有 TS 文件都在 Git 版本控制中

### 7.2 回滚操作

```bash
# 回滚单个文件
git checkout <previous-commit> -- src/data/visdrone/xxx.ts

# 回滚所有更改
git reset --hard <previous-commit>
```

---

## 八、联系与支持

如有问题，请联系项目维护者或查看相关文档：
- 项目文档：`docs/`
- GitHub Issues：https://github.com/AISKYEYE-TJU/VisDrone.org/issues
