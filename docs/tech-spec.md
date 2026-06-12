# 技术规格文档

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.x |
| 数据库 | Supabase (PostgreSQL) | 云端 |
| 文件存储 | Supabase Storage | 云端 |
| 部署 | Vercel | 免费层 |
| 日历组件 | react-day-picker | 最新 |
| 日期处理 | date-fns | 最新 |

## 项目结构

```
link-start/
├── .env.local                  # 环境变量（不提交到 Git）
├── .env.local.example          # 环境变量模板
├── docs/                       # 项目文档
│   ├── requirements.md         # 需求文档
│   ├── tech-spec.md            # 技术规格（本文件）
│   ├── design-spec.md          # 设计规范
│   └── execution-plan.md       # 执行计划
├── dev-logs/                   # 开发日志
│   └── YYYY-MM-DD.md           # 每日日志
├── supabase/
│   └── migrations/             # 数据库迁移文件
├── public/                     # 静态资源
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页 /
│   │   ├── globals.css         # 全局样式
│   │   ├── feed/page.tsx       # 动态页 /feed
│   │   ├── library/page.tsx    # 图书馆页 /library
│   │   ├── works/
│   │   │   ├── new/page.tsx    # 添加作品 /works/new
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # 作品详情 /works/[id]
│   │   │       └── edit/page.tsx # 编辑作品 /works/[id]/edit
│   │   └── api/                # API 路由
│   ├── components/             # React 组件
│   │   ├── ui/                 # 通用 UI 组件
│   │   ├── layout/             # 布局组件
│   │   ├── home/               # 主页专用组件
│   │   ├── feed/               # 动态页专用组件
│   │   ├── library/            # 图书馆页专用组件
│   │   └── works/              # 作品相关组件
│   ├── lib/                    # 工具和数据库层
│   │   ├── supabase.ts         # Supabase 客户端
│   │   ├── db.ts               # 数据库操作函数
│   │   └── utils.ts            # 通用工具函数
│   └── types/                  # TypeScript 类型定义
│       └── index.ts
```

## 数据库设计

### works 表
| 列名 | 类型 | 约束 |
|------|------|------|
| id | UUID | PK, gen_random_uuid() |
| title | TEXT | NULLABLE |
| author | TEXT | NULLABLE |
| synopsis | TEXT | NULLABLE |
| publication_date | DATE | NULLABLE |
| publisher | TEXT | NULLABLE |
| volume_count | INTEGER | NULLABLE |
| type | TEXT | CHECK (Novel, Anime, Manga) |
| completion_status | TEXT | CHECK (Ongoing, Completed, Abandoned) |
| cover_image_url | TEXT | NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

### tags 表
| 列名 | 类型 | 约束 |
|------|------|------|
| id | UUID | PK |
| name | TEXT | NOT NULL UNIQUE |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### work_tags 表（多对多）
| 列名 | 类型 | 约束 |
|------|------|------|
| work_id | UUID | FK → works(id) CASCADE |
| tag_id | UUID | FK → tags(id) CASCADE |
| | | PRIMARY KEY (work_id, tag_id) |

### reviews 表
| 列名 | 类型 | 约束 |
|------|------|------|
| id | UUID | PK |
| work_id | UUID | FK → works(id) CASCADE, NOT NULL |
| content | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

## API 设计

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/works | 列出作品（支持 type/tag/status/sort/search 筛选） |
| POST | /api/works | 创建作品 |
| GET | /api/works/[id] | 获取单个作品详情 |
| PUT | /api/works/[id] | 更新作品 |
| DELETE | /api/works/[id] | 删除作品 |
| GET | /api/tags?q= | 标签自动提示 |
| GET | /api/works/[id]/reviews | 获取作品书评列表 |
| POST | /api/works/[id]/reviews | 添加书评 |
| DELETE | /api/reviews/[id] | 删除书评 |
| POST | /api/upload | 上传封面图片 |
| GET | /api/feed?date= | 获取动态流 |
