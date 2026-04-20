# VisDrone 数据变更日志规范

## 一、规范目的

建立标准化的数据变更追踪机制，确保：
- **可追溯**：每次变更都有记录可查
- **可回滚**：支持问题数据的快速恢复
- **可协作**：多人维护时信息同步

## 二、变更日志位置

变更日志存储在数据文件同目录下：

```
src/data/visdrone/
├── news.ts
├── news.changelog.md      ← 变更日志
├── papers.ts
├── papers.changelog.md    ← 变更日志
├── datasets.ts
├── datasets.changelog.md  ← 变更日志
├── models.ts
├── models.changelog.md   ← 变更日志
├── patents.ts
├── patents.changelog.md   ← 变更日志
├── awards.ts
├── awards.changelog.md   ← 变更日志
└── team.ts
├── team.changelog.md      ← 变更日志
```

## 三、日志格式

### 3.1 标准条目格式

```markdown
## 2026-03-22

### ✨ 新增
- **[news-20260322-001]** 添加新闻：VisDrone团队获得吴文俊奖
  - ID: `news-20260322-001`
  - Category: `竞赛获奖`
  - Author: 张三

### 📝 修改
- **[dataset-1]** 更新数据集描述
  - 旧: `DroneVehicle是...`
  - 新: `DroneVehicle是一个基于无人机的...`

### 🗑️ 删除
- **[news-20260301-003]** 删除过期新闻
  - Reason: 内容已过期

---

## 2026-03-15

### ✨ 新增
- **[paper-20260315-001]** 添加论文：New Method for...
  - Venue: CVPR 2026
  - Authors: [list]
```

### 3.2 条目类型标识

| 标识 | 类型 | 说明 |
|------|------|------|
| ✨ | 新增 | 添加新数据 |
| 📝 | 修改 | 更新现有数据 |
| 🗑️ | 删除 | 删除数据 |
| 🔄 | 迁移 | ID 变更或格式迁移 |

## 四、Git Commit 规范

### 4.1 Commit Message 格式

```
{type}({module}): {action} #{id}

{optional description}
```

### 4.2 Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| feat | 新功能/数据 | `feat(news): add news-20260322-001` |
| fix | 修复问题 | `fix(paper): correct year for paper-xxx` |
| refactor | 重构 | `refactor(team): update member bio` |
| chore | 维护 | `chore: sync data from DB` |

### 4.3 示例

```bash
# 新增新闻
git commit -m "feat(news): add news-20260322-001 - 团队获奖新闻"

# 修改论文
git commit -m "fix(paper): update paper-20260315-001 year to 2025"

# 批量更新
git commit -m "chore(papers): batch update 2025 publications"
```

### 4.4 关联 Issue

```bash
git commit -m "feat(dataset): add VisDrone2026 dataset

Closes #123
Related: #456
```

## 五、备份与回滚

### 5.1 变更前备份

在修改数据前，建议创建备份：

```bash
# 备份单个文件
cp src/data/visdrone/news.ts src/data/visdrone/news.ts.bak.20260322

# 或使用 git
git add src/data/visdrone/news.ts
git stash push -m "backup before modifying news"
```

### 5.2 回滚操作

```bash
# 从 git 回滚
git checkout -- src/data/visdrone/news.ts

# 从 stash 恢复
git stash pop

# 回滚到特定 commit
git revert <commit-hash>
```

### 5.3 数据库回滚

```typescript
// 使用 Admin 后台的恢复功能
// 或手动执行 DELETE/INSERT
```

## 六、日志维护流程

### 6.1 日常维护

1. **变更前**：检查 changelog 最新条目
2. **变更时**：同步更新 changelog
3. **变更后**：验证数据 + commit

### 6.2 周审查

每周五检查 changelog，确保：
- 所有变更已记录
- 无遗漏条目
- 日志格式规范

### 6.3 月度归档

每月末：
1. 归档当月 changelog
2. 创建新的 changelog 文件
3. 更新总索引

## 七、Changelog 总索引

```markdown
# VisDrone 数据变更总索引

| 年月 | 文件 | 变更数量 |
|------|------|----------|
| 2026-03 | news.changelog.md | 12 |
| 2026-03 | papers.changelog.md | 8 |
| 2026-02 | news.changelog.md | 5 |
| ... | ... | ... |

---

## 按类型统计 (2026-03)

| 类型 | 数量 |
|------|------|
| ✨ 新增 | 15 |
| 📝 修改 | 4 |
| 🗑️ 删除 | 1 |
| 🔄 迁移 | 2 |
```

---

## 附录：常用命令

```bash
# 查看某文件的变更历史
git log --oneline -- src/data/visdrone/news.ts

# 查看某 ID 的所有变更
git log --oneline --all -S "news-20260322-001"

# 查看特定日期的变更
git log --oneline --since="2026-03-01" --until="2026-03-22"

# 查看某人提交
git log --oneline --author="zhangsan" -- src/data/visdrone/

# 搜索关键词
git log --oneline --grep="news"
```
