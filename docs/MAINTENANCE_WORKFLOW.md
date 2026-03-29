# VisDrone 网站运维工作流

## 一、日常维护流程

### 1.1 新闻更新

```
┌─────────────────────────────────────────────────────────────┐
│                     新闻更新流程                             │
├─────────────────────────────────────────────────────────────┤
│  1. 登录 Admin 后台 (http://localhost:5173/visdrone/admin) │
│  2. 进入"新闻管理"模块                                      │
│  3. 点击"添加新闻"                                         │
│  4. 填写表单：                                             │
│     - 标题：新闻标题                                        │
│     - 链接：原文URL                                        │
│     - 日期：YYYY-MM 格式                                   │
│     - 摘要：简短描述                                        │
│     - 分类：选择分类                                       │
│     - 图片：上传或输入URL                                  │
│  5. 点击"保存"                                             │
│  6. 更新 changelog                                         │
│  7. 提交 git commit                                        │
└─────────────────────────────────────────────────────────────┘
```

**命令行更新**：

```bash
# 1. 编辑数据文件
vim src/data/visdrone/news.ts

# 2. 验证语法
npx tsc --noEmit

# 3. 提交变更
git add src/data/visdrone/news.ts
git commit -m "feat(news): add news-$(date +%Y%m%d)-001 - 新闻标题"

# 4. 推送
git push
```

### 1.2 论文添加

```bash
# 1. 获取论文信息
# - 标题 title
# - 作者 authors (数组)
# - 期刊/会议 venue
# - 年份 year
# - 类型 type (conference/journal)

# 2. 编辑 papers.ts
vim src/data/visdrone/papers.ts

# 3. 按年份降序插入（确保 ID 连续）
# - 最新年份在前
# - ID 从 1 开始连续编号

# 4. 提交
git commit -m "feat(paper): add paper-YYYYMMDD-001 - 论文标题"
```

### 1.3 团队成员管理

```
添加成员：
1. 准备照片 → 放入 public/team/姓名.jpg
2. 编辑 team.ts → 添加成员对象
3. 更新 changelog
4. 提交

移除成员（毕业生）：
1. 将成员 role 改为 'Alumni'
2. 移动到毕业生列表（按年级排序）
3. 更新 changelog
4. 提交
```

## 二、数据验证流程

### 2.1 本地验证

```bash
# TypeScript 类型检查
npm run typecheck

# 或
npx tsc --noEmit

# 启动开发服务器检查
npm run dev

# 访问页面验证显示
# http://localhost:8080/visdrone
```

### 2.2 自动化验证

```bash
# 运行 lint
npm run lint

# 构建测试
npm run build
```

## 三、部署流程

### 3.1 开发环境

```bash
npm run dev
# 访问 http://localhost:8080
```

### 3.2 生产环境构建

```bash
# 1. 确保所有变更已提交
git status

# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖
npm install

# 4. 构建
npm run build

# 5. 检查 dist/ 目录
ls -la dist/
```

### 3.3 部署检查清单

```
□ 所有数据文件已更新
□ TypeScript 编译无错误
□ 页面可正常访问
□ 控制台无 Error 级别日志
□ 所有图片/资源可正常加载
□ 提交信息已记录到 changelog
□ Git commit 已完成
```

## 四、数据库同步流程

### 4.1 数据同步到数据库

```bash
# 1. 导出数据为 JSON
# Admin 后台 → 数据同步 → 导出到数据库

# 2. 或使用脚本
npm run sync:to-db
```

### 4.2 数据从数据库导出

```bash
# 1. 从数据库导出
# Admin 后台 → 数据同步 → 从数据库导入

# 2. 验证导出数据
# 检查数据完整性
```

### 4.3 数据不一致处理

```
发现问题数据：
1. 定位问题数据（哪个模块、什么错误）
2. 确定数据源（TS 文件 vs 数据库）
3. 决定保留哪个版本
4. 更新冲突数据
5. 记录变更原因
6. 验证修复
```

## 五、应急处理

### 5.1 数据回滚

```bash
# 回滚到上一个 commit
git checkout -- src/data/visdrone/news.ts

# 查看历史版本
git log --oneline -5 src/data/visdrone/news.ts

# 恢复到特定版本
git checkout <commit-hash> -- src/data/visdrone/news.ts
```

### 5.2 数据库回滚

```bash
# Admin 后台操作
# 进入"数据同步"模块
# 选择"从备份恢复"
# 选择恢复点
```

### 5.3 服务异常排查

```
常见问题排查：
1. 页面空白 → 检查控制台错误
2. 数据不显示 → 检查 API 调用
3. 图片加载失败 → 检查图片 URL
4. 编译错误 → 检查 TypeScript 类型
```

## 六、定期维护任务

### 6.1 每周任务

- [ ] 检查 changelog 是否有遗漏
- [ ] 验证 GitHub Stars 更新（GitHub Actions）
- [ ] 检查是否有 broken links
- [ ] 备份重要数据

### 6.2 每月任务

- [ ] 归档月度 changelog
- [ ] 清理过期新闻
- [ ] 更新毕业生名单
- [ ] 备份数据库
- [ ] 检查依赖更新

### 6.3 每学期任务

- [ ] 更新团队成员信息
- [ ] 审核论文列表
- [ ] 更新合作单位信息
- [ ] 审查并更新文档

## 七、权限与协作

### 7.1 角色说明

| 角色 | 权限 |
|------|------|
| 管理员 | 全部权限 |
| 编辑 | 新闻、论文更新 |
| 查看 | 只读访问 |

### 7.2 代码审查

```bash
# 创建 feature branch
git checkout -b feature/add-news-20260322

# 提交 PR
git push origin feature/add-news-20260322

# Code Review 后合并
git checkout main
git merge feature/add-news-20260322
```

---

## 附录：常用命令速查

```bash
# 开发
npm run dev                    # 启动开发服务器
npm run build                  # 构建生产版本

# 验证
npm run lint                   # 代码检查
npx tsc --noEmit             # TypeScript 检查

# Git
git status                    # 查看状态
git log --oneline -5         # 最近5条提交
git diff                      # 查看变更

# 数据
git add .                     # 暂存所有变更
git commit -m "message"       # 提交
git push                      # 推送
```
