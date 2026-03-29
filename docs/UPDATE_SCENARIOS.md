# VisDrone 网站更新场景示例

本文档展示了一些常见的更新场景，以及对应的Prompt示例。您可以直接使用这些示例，或根据实际情况修改。

---

## 场景1：添加新论文

**场景描述**：团队在CVPR 2025发表了一篇新论文，需要添加到网站。

**使用Prompt**：
```
请在VisDrone网站添加一篇会议论文：
- 论文标题：Vision Mamba: Efficient Visual State Space Models
- 作者：[实际作者列表]
- 会议名称：CVPR 2025
- 类型：会议论文
- PDF链接：https://arxiv.org/abs/xxxx.xxxxx
- 代码链接：https://github.com/xxx/vision-mamba

请更新 src/data/visdrone/papers.ts 文件，确保ID唯一。
```

---

## 场景2：更新模型Stars

**场景描述**：需要手动更新所有模型的GitHub stars数据。

**使用Prompt**：
```
请更新VisDrone网站的模型Stars数据，使用GitHub API获取最新的stars和forks数量。

仓库列表：
- https://github.com/VisDrone/VisDrone-Dataset
- https://github.com/VisDrone/Multi-Drone-Multi-Object-Detection-and-Tracking
- https://github.com/VisDrone/VisDrone

请更新 src/data/visdrone/models.ts 文件。
```

---

## 场景3：添加新团队成员

**场景描述**：新加入一名博士生，需要添加到团队页面。

**使用Prompt**：
```
请在VisDrone网站添加一个团队成员：
- 姓名：张三
- 角色：博士生
- 邮箱：zhangsan@tju.edu.cn
- 研究方向：目标检测、无人机视觉、深度学习
- 个人简介：2025年本科毕业于XX大学，现为XX大学博士研究生，主要研究...
- 头像：使用AI生成一个合适的头像

请更新 src/data/visdrone/team.ts 文件。
```

---

## 场景4：添加新闻动态

**场景描述**：团队参加了ICCV 2025会议，需要发布新闻。

**使用Prompt**：
```
请在VisDrone网站添加一条新闻：
- 标题：VisDrone团队参加ICCV 2025会议
- 链接：https://aiskyeye.com/iccv-2025/
- 日期：2025-10
- 摘要：近日，VisDrone团队参加了在韩国首尔举办的ICCV 2025国际计算机视觉会议...
- 分类：学术交流
- 配图：请生成一张学术会议的AI配图

请更新 src/data/visdrone/news.ts 文件。
```

---

## 场景5：添加新数据集

**场景描述**：团队发布了新的数据集，需要添加到网站。

**使用Prompt**：
```
请在VisDrone网站添加一个新数据集：
- 名称：VisDrone-Det
- 全称：VisDrone-Det: 无人机目标检测数据集
- 描述：这是一个专为无人机视角设计的大规模目标检测数据集...
- 论文标题：VisDrone-Det: A Large-Scale Benchmark for Drone-based Object Detection
- 论文会议：CVPR 2025
- 论文年份：2025
- GitHub链接：https://github.com/VisDrone/VisDrone-Det
- 数据集规模：50,000张图片
- 标注数量：500,000+标注
- 类别数量：10
- 特性：无人机视角、多尺度、遮挡场景

请更新 src/data/visdrone/datasets.ts 文件。
```

---

## 场景6：添加专利

**场景描述**：团队获得了一个新专利。

**使用Prompt**：
```
请在VisDrone网站添加一个专利：
- 专利名称：一种基于深度学习的无人机目标检测方法及系统
- 发明人：[发明人列表]
- 专利号：CN202510123456.7
- 申请日期：2025-01-15
- 专利类型：发明
- PDF链接：[可选]

请更新 src/data/visdrone/patents.ts 文件。
```

---

## 场景7：添加获奖信息

**场景描述**：团队在竞赛中获奖。

**使用Prompt**：
```
请在VisDrone网站添加一个获奖：
- 获奖名称：CVPR 2025无人机视觉挑战赛一等奖
- 获奖人：[获奖人列表]
- 获奖单位/竞赛：CVPR 2025 UAV Vision Challenge
- 获奖日期：2025-06
- 获奖等级：一等奖
- 证书链接：[可选]

请更新 src/data/visdrone/awards.ts 文件。
```

---

## 场景8：批量更新

**场景描述**：需要一次性更新多个内容。

**使用Prompt**：
```
请执行以下批量更新操作：

1. 添加新闻：团队获得2025年XX奖项
2. 添加论文：一篇ICME 2025论文
3. 添加团队成员：一名新博士后

请依次更新对应的数据文件，并确保ID不重复。
```

---

## 场景9：数据检查

**场景描述**：需要检查数据文件的完整性。

**使用Prompt**：
```
请检查VisDrone网站数据文件的完整性：
1. 检查所有TS文件是否有语法错误
2. 检查ID是否有重复
3. 检查必填字段是否完整（如模型必须有github链接）
4. 检查图片链接是否有效
5. 检查日期格式是否正确

请提供检查报告。
```

---

## 场景10：生成AI配图

**场景描述**：需要为新闻或页面生成配图。

**使用Prompt**：
```
请为VisDrone网站生成以下AI配图：

1. 主题：无人机航拍城市
   - 风格：蓝色和青色配色，现代科技感，无文字，横向16:9
   
2. 主题：学术会议现场
   - 风格：专业学术氛围，蓝色主调，无文字，横向16:9

请使用Trae API生成图片并提供可直接使用的URL。
```

---

## 使用流程总结

```
┌─────────────────────────────────────────────────────────────────┐
│                    VisDrone网站更新流程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 选择场景   →   根据您的需求选择对应的场景                    │
│                                                                 │
│  2. 复制Prompt   →   复制场景中的Prompt模板                    │
│                                                                 │
│  3. 填写信息   →   将方括号内容替换为实际信息                   │
│                                                                 │
│  4. 发送请求   →   将Prompt发送给AI助手处理                    │
│                                                                 │
│  5. 验证结果   →   检查更新的文件是否正确                      │
│                                                                 │
│  6. 提交代码   →   git add → commit → push                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 相关文档

- 维护指南：`docs/VISDRONE_MAINTENANCE.md`
- Prompt模板：`docs/PROMPT_TEMPLATES.md`
- Skill配置：`.trae/skills/visdrone-maintenance/SKILL.md`
