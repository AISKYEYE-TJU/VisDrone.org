---
name: "visdrone-maintenance"
description: "Manages VisDrone website content updates including news, models, datasets, papers, patents, awards, and team. Invoke when user wants to add/edit/delete website content or asks for website maintenance."
---

# VisDrone Website Maintenance

This skill manages all content updates for the VisDrone research team website.

## When to Use This Skill

Invoke this skill when:
- User wants to add/edit/delete news, models, datasets, papers, patents, awards, or team members
- User asks to update website content
- User wants to generate AI images for website
- User asks about website maintenance procedures
- User wants to export/import website data

## Website Data Sources

All website data is stored in TypeScript files under `src/data/visdrone/`:

| Module | File | Description |
|--------|------|-------------|
| News | `news.ts` | Team news and announcements |
| Models | `models.ts` | AI models and algorithms |
| Datasets | `datasets.ts` | Research datasets |
| Papers | `papers.ts` | Published papers |
| Patents | `patents.ts` | Granted patents |
| Awards | `awards.ts` | Awards and competitions |
| Team | `team.ts` | Team members |

## Quick Update Process

1. **Edit Data**: Modify the corresponding TypeScript file in `src/data/visdrone/`
2. **Build & Test**: Run `npm run dev` to preview changes
3. **Deploy**: Run `npm run build` and deploy the `dist/` folder

## Data Format Reference

### News
```typescript
{
  id: string;      // Unique ID (e.g., '1')
  title: string;   // News title
  url: string;     // Link to full article
  date: string;    // Date in 'YYYY-MM' format
  excerpt: string; // Short description
  image: string;  // Image URL (AI-generated recommended)
  category: string; // Category: 学术交流|学术活动|平台建设|科研项目|学术成果|竞赛获奖
}
```

### Model
```typescript
{
  id: string;
  name: string;      // Short name (e.g., 'R-CNN')
  fullName: string;  // Full name
  description: string;
  task: string;      // Task type: 目标检测|目标追踪|人群计数|图像融合|语义分割
  paper: { title: string; venue: string; year: number; url?: string };
  features: string[];
  github: string;
  stars?: number;    // Auto-updated
  forks?: number;
}
```

### Dataset
```typescript
{
  id: string;
  name: string;
  fullName: string;
  description: string;
  paper: { title: string; venue: string; year: number };
  features: string[];
  stats: { images: string; videos?: string; annotations: string; categories: number };
  github: string;
  githubInfo: { stars?: number; forks?: number; description: string; license: string };
}
```

### Paper
```typescript
{
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'conference' | 'journal';
  pdfUrl?: string;
  codeUrl?: string;
}
```

### Patent
```typescript
{
  id: string;
  title: string;
  inventors: string[];
  number: string;
  date: string;
  type: '发明' | '实用新型' | '外观设计';
  pdfUrl?: string;
}
```

### Award
```typescript
{
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  pdfUrl?: string;
}
```

### Team Member
```typescript
{
  id: string;
  name: string;
  role: string;  // 教授|副教授|副研究员|助理研究员|博士后|博士生|硕士生|本科生
  title?: string;
  bio?: string;
  researchInterests?: string[];
  email?: string;
  image?: string;
}
```

## AI Image Generation

Generate images using the Trae API:
```
https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=[DESCRIPTION]%20blue%20and%20cyan%20color%20scheme%20no%20text&image_size=landscape_16_9
```

### Image Prompt Examples
- Academic conference: `academic%20conference%20researchers%20networking`
- Competition award: `competition%20award%20ceremony%20trophy%20medal`
- Research project: `research%20project%20laboratory%20innovation`
- Drone detection: `drone%20aerial%20view%20object%20detection%20urban`

## Maintenance Documentation

Full documentation available at: `docs/VISDRONE_MAINTENANCE.md`

## GitHub Actions

Stars data is automatically updated daily via GitHub Actions:
- Workflow file: `.github/workflows/update-visdrone-data.yml`
- Trigger: Daily at 00:00 UTC
- Manual trigger: GitHub → Actions → Update VisDrone Data → Run workflow

## Important Notes

1. **ID Uniqueness**: Each data item must have a unique `id`
2. **Data Validation**: Ensure TypeScript syntax is correct
3. **Image URLs**: Use reliable image sources, AI-generated recommended
4. **Sorting**: Models and datasets are sorted by stars (descending)
5. **Commit Messages**: Use clear commit messages like "Add new paper to CVPR 2025"
