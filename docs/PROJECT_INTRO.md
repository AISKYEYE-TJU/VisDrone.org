# VisDrone 实验室网站项目介绍

## 一、项目概述

VisDrone 实验室网站是一个展示天津大学智能计算研究院（TJU-ICRI）科研成果的综合性平台。网站采用现代化技术栈构建，支持实时数据管理和多语言展示。

**访问地址**：https://aiskyeye.com/visdrone

### 1.1 核心功能模块

| 模块 | 说明 | 数据来源 |
|------|------|----------|
| 首页 | 实验室概览、团队介绍 | TypeScript |
| 新闻动态 | 实验室最新消息 | TypeScript / Supabase |
| 研究成果-数据集 | VisDrone 系列数据集 | TypeScript / Supabase |
| 研究成果-模型 | AI 模型库（56个模型） | TypeScript / Supabase |
| 研究成果-论文 | 发表论文列表 | TypeScript / Supabase |
| 研究成果-专利 | 专利信息 | TypeScript / Supabase |
| 研究成果-获奖 | 获奖荣誉 | TypeScript / Supabase |
| 学术活动 | 组会、特邀报告、学术会议 | TypeScript / Supabase |
| 团队成员 | 教师、学生、博士后 | TypeScript |
| 关于我们 | 实验室介绍 | TypeScript |

### 1.2 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端架构                              │
├─────────────────────────────────────────────────────────────┤
│  Framework: React 18 + TypeScript                           │
│  Router: React Router v6                                     │
│  Styling: Tailwind CSS + shadcn/ui                          │
│  Icons: Lucide React                                         │
│  HTTP: @supabase/supabase-js                                │
│  Build: Vite                                                │
├─────────────────────────────────────────────────────────────┤
│                        数据层                                │
├─────────────────────────────────────────────────────────────┤
│  Primary: Supabase (云数据库)                                │
│  Fallback: TypeScript 本地文件                               │
│  Caching: IndexedDB 本地缓存                                 │
├─────────────────────────────────────────────────────────────┤
│                        部署                                  │
├─────────────────────────────────────────────────────────────┤
│  CI/CD: GitHub Actions                                      │
│  Hosting: GitHub Pages                                       │
│  Domain: aiskyeye.com                                       │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 团队与权限

| 角色 | 说明 | 权限范围 |
|------|------|----------|
| 管理员 | 系统管理员 | 全部功能 |
| 维护者 | 日常维护人员 | 数据更新、新闻发布 |

**默认管理员账户**：
- 邮箱：`admin@visdrone.org`
- 密码：`visdrone`

---

## 二、项目目录结构

```
VisDrone/
├── src/
│   ├── components/           # React 组件
│   │   └── ui/              # UI 组件库
│   ├── config/              # 配置文件
│   │   └── supabase.ts      # Supabase 配置
│   ├── data/                # TypeScript 数据文件
│   │   └── visdrone/        # VisDrone 数据
│   │       ├── news.ts      # 新闻数据
│   │       ├── datasets.ts  # 数据集数据
│   │       ├── models.ts    # 模型数据
│   │       ├── papers.ts    # 论文数据
│   │       ├── patents.ts   # 专利数据
│   │       ├── awards.ts    # 获奖数据
│   │       ├── team.ts      # 团队成员数据
│   │       └── seminars.ts  # 学术活动数据
│   ├── pages/               # 页面组件
│   │   └── visdrone/        # VisDrone 页面
│   │       ├── Home.tsx     # 首页
│   │       ├── Publications.tsx  # 研究成果
│   │       ├── Team.tsx     # 团队页面
│   │       ├── Seminars.tsx # 学术活动页面
│   │       └── admin/       # 管理后台
│   ├── services/            # 服务层
│   │   ├── visdroneService.ts      # 数据服务
│   │   ├── adminCrudService.ts     # 管理员CRUD
│   │   ├── githubFileService.ts     # GitHub文件服务
│   │   └── authService.ts          # 认证服务
│   ├── types/               # TypeScript 类型
│   │   └── visdrone/        # VisDrone 类型定义
│   └── hooks/               # React Hooks
├── docs/                    # 文档目录
├── public/                  # 静态资源
│   └── team/               # 团队成员头像
└── .github/
    └── workflows/          # GitHub Actions
```

---

## 三、数据管理架构

### 3.1 数据流架构

```
┌──────────────────────────────────────────────────────────────────┐
│                         数据读取流程                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  用户请求 → visdroneService → ① Supabase 数据库                  │
│                              ↓ (如失败)                          │
│                           ② TypeScript 文件                      │
│                              ↓ (如失败)                          │
│                           ③ IndexedDB 缓存                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 数据同步机制

| 方向 | 说明 | 触发方式 |
|------|------|----------|
| TS → Supabase | 将 TS 文件数据同步到云数据库 | Admin 后台"数据同步"按钮 |
| Supabase → TS | 将数据库数据导出到 TS 文件 | 需手动导出 |
| GitHub → Supabase | GitHub Actions 自动同步 | 每次 git push |

### 3.3 Supabase 表结构

| 表名 | 说明 | 主键 |
|------|------|------|
| visdrone_news | 新闻 | id |
| visdrone_datasets | 数据集 | id |
| visdrone_models | 模型 | id |
| visdrone_papers | 论文 | id |
| visdrone_patents | 专利 | id |
| visdrone_awards | 获奖 | id |
| visdrone_team | 团队成员 | id |
| visdrone_seminars | 学术活动 | id |

---

## 四、Admin 管理后台

### 4.1 功能模块

访问地址：`https://aiskyeye.com/visdrone/admin`

| 模块 | 功能 |
|------|------|
| 看板 | 统计各模块数据数量 |
| 新闻管理 | 添加/编辑/删除新闻 |
| 数据集管理 | 添加/编辑/删除数据集 |
| 模型管理 | 添加/编辑/删除模型 |
| 论文管理 | 添加/编辑/删除论文 |
| 专利管理 | 添加/编辑/删除专利 |
| 获奖管理 | 添加/编辑/删除获奖 |
| 团队管理 | 添加/编辑/删除团队成员 |
| 学术活动 | 添加/编辑/删除组会/特邀报告 |
| 数据同步 | TS 文件与数据库双向同步 |

### 4.2 学术活动类型

| 类型 | 值 | 说明 |
|------|-----|------|
| 组会 | group_meeting | 实验室组会报告 |
| 特邀报告 | invited_talk | 邀请的学术报告 |
| 学术会议 | workshop | 参加的学术会议 |

### 4.3 学术活动分组

| 分组 | 值 | 说明 |
|------|-----|------|
| 学习范式 | learning | 学习范式研究组 |
| 多模态学习 | multimodal | 多模态学习研究组 |
| 具身智能 | embodied | 具身智能研究组 |

---

## 五、快速开始

### 5.1 本地开发

```bash
# 克隆项目
git clone https://github.com/AISKYEYE-TJU/VisDrone.org.git
cd VisDrone.org

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:8080/visdrone
```

### 5.2 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 5.3 代码检查

```bash
# TypeScript 类型检查
npm run typecheck

# ESLint 检查
npm run lint
```

---

## 六、相关文档

| 文档 | 说明 |
|------|------|
| `docs/VISDRONE_MAINTENANCE.md` | 完整维护手册 |
| `docs/ADMIN_GUIDE.md` | Admin 后台使用指南 |
| `docs/MAINTENANCE_WORKFLOW.md` | 运维工作流程 |
| `docs/UPDATE_SCENARIOS.md` | 更新场景示例 |
| `docs/PROMPT_TEMPLATES.md` | Prompt 模板 |
| `docs/DATABASE_SETUP.md` | 数据库配置指南 |
| `docs/ID_NAMING_CONVENTION.md` | ID 命名规范 |
| `docs/DATA_CHANGELOG_GUIDE.md` | 变更日志指南 |
