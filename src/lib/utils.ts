// 简单的 classname 合并工具函数
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// 格式化日期
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 格式化日期为短格式
export function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// 截断文本
export function truncate(text: string | null, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// 作品类型中文映射
export function workTypeLabel(type: string | null): string {
  const map: Record<string, string> = {
    Novel: "小说",
    Anime: "动画",
    Manga: "漫画",
  };
  return type ? map[type] || type : "—";
}

// 完结状态中文映射
export function statusLabel(status: string | null): string {
  const map: Record<string, string> = {
    Ongoing: "连载中",
    Completed: "已完结",
    Abandoned: "作者弃坑",
  };
  return status ? map[status] || status : "—";
}

// 可选值显示
export function optional(value: string | number | null | undefined, fallback = "—"): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}
