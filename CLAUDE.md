# CLAUDE.md — DoubleCan's Library

## 项目概述
这是一个个人作品收藏网站（图书馆系统），使用 Next.js + Supabase + Tailwind CSS 构建。用户可以上传小说/动画/漫画的封面和信息，添加书评和标签，通过画廊、动态时间线、图书馆三种方式浏览作品。

## 文档指引

| 文档 | 路径 | 说明 |
|------|------|------|
| 需求文档 | [docs/requirements.md](docs/requirements.md) | 用户故事、功能清单、优先级 |
| 技术规格 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、项目结构、数据库设计、API 设计 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 色彩、排版、组件规范、页面布局 |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) | 阶段划分、当前进度、下一步任务 |

## 开发日志
每日开发日志存放在 [dev-logs/](dev-logs/) 文件夹中，以 `YYYY-MM-DD.md` 命名。

## 工作原则

1. **分步推进**：一次只完成一个阶段，确认无误后再进入下一步
2. **先读文档**：写代码前先查阅 `docs/` 中的规范和计划
3. **每日记录**：每次工作结束后更新 `dev-logs/` 中的日志
4. **保持同步**：进度变化时更新 `docs/execution-plan.md` 的状态
5. **先骨架后血肉**：先确保页面结构和路由通畅，再细化交互
6. **随时可验证**：每个阶段完成都能在浏览器中看到实际效果

## 关键文件速查

| 用途 | 文件路径 |
|------|----------|
| 根布局 | `src/app/layout.tsx` |
| 全局样式 | `src/app/globals.css` |
| 类型定义 | `src/types/index.ts` |
| 工具函数 | `src/lib/utils.ts` |
| Supabase 客户端 | `src/lib/supabase.ts` |
| 数据库操作 | `src/lib/db.ts` |
| 数据库迁移 | `supabase/migrations/00001_initial_schema.sql` |
| 环境变量 | `.env.local` |

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Storage)
- react-day-picker (日历组件)
- date-fns (日期处理)

## 启动命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```
