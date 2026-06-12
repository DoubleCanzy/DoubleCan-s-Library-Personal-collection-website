# 设计规范文档

## 设计理念
- **简洁直观**：减少视觉噪音，让作品本身成为焦点
- **黑白主调**：极简配色，通过黑白灰层次表达信息结构
- **留白优先**：足够的呼吸空间，避免拥挤

## 色彩方案

| 用途 | 颜色 |
|------|------|
| 页面背景 | `white` (#FFFFFF) |
| 主文字 | `black` (#000000) |
| 次要文字 | `gray-600` (#4B5563) |
| 卡片背景 | `white` |
| 卡片边框 | `black` |
| 主要按钮背景 | `black` |
| 主要按钮文字 | `white` |
| 次要按钮背景 | `white` |
| 次要按钮文字/边框 | `black` |
| 输入框底线 | `black` |
| 悬停状态 | `gray-100` (#F3F4F6) |
| 标签徽章背景 | `black` |
| 标签徽章文字 | `white` |
| 侧栏背景 | `gray-50` (#F9FAFB) |
| 侧栏边框 | `gray-200` (#E5E7EB) |
| 禁用状态 | 透明度 40% |

## 排版

- **字体**：Inter（系统无衬线字体后备）
- **标题**：font-semibold，按层级使用 text-lg / text-xl / text-2xl
- **正文**：text-base，行高舒适
- **辅助文字**：text-sm，text-gray-600
- **按钮**：font-medium

## 间距系统

- 页面内边距：`p-6` 或 `p-8`
- 卡片间距：`gap-4` 或 `gap-6`
- 表单字段间距：`gap-4`
- 区块间距：`mb-8`

## 组件规范

### 按钮
- 圆角：无（直角）
- 主要按钮：`bg-black text-white border border-black`
- 次要按钮：`bg-white text-black border border-black`
- 悬浮效果：`hover:bg-gray-800`（主要）/ `hover:bg-gray-100`（次要）

### 输入框
- 风格：下划线 (`border-b-2 border-black`)
- 聚焦：`focus:border-gray-400`

### 卡片
- 白底黑边框：`border border-black`
- 无圆角

### 标签徽章
- 黑底白字小标签：`bg-black text-white text-sm px-3 py-1`

### 侧栏
- 浅灰背景 + 右边框：`bg-gray-50 border-r border-gray-200`

## 页面布局

### 主页
- 画廊宫格：`grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`
- Link Start 按钮：居中，大号，页面底部

### 动态页
- 两栏布局：侧栏固定 320px，主内容区自适应
- 时间线：左侧边框 + 圆点指示器

### 图书馆页
- 两栏布局：侧栏固定 320px，主内容区自适应
- 宫格：同主页画廊
