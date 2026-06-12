import Link from "next/link";
import { formatDate, truncate } from "@/lib/utils";
import type { FeedItem as FeedItemType } from "@/types";

interface FeedItemProps {
  item: FeedItemType;
}

export default function FeedItem({ item }: FeedItemProps) {
  return (
    <div className="relative pl-6 pb-6">
      {/* 时间线点 */}
      <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-white" />

      {/* 内容卡片 */}
      <div className="border border-gray-200 p-4 hover:border-gray-400 transition-colors">
        {/* 类型标签 */}
        <span className="inline-block mb-2 border border-black px-2 py-0.5 text-xs font-medium">
          {item.type === "work" ? "New Work" : "Review"}
        </span>

        {/* 时间 */}
        <span className="ml-2 text-xs text-gray-400">
          {formatDate(item.created_at)}
        </span>

        {/* 标题 */}
        <h3 className="mt-1 text-base font-medium">
          {item.type === "work" ? (
            <Link
              href={`/works/${item.id}`}
              className="hover:text-gray-600 transition-colors"
            >
              {item.title || "未命名作品"}
            </Link>
          ) : (
            <Link
              href={`/works/${item.work_id}`}
              className="hover:text-gray-600 transition-colors"
            >
              评《{item.title || "未命名作品"}》
            </Link>
          )}
        </h3>

        {/* 书评内容预览 */}
        {item.type === "review" && item.content && (
          <p className="mt-1 text-sm text-gray-500">
            {truncate(item.content, 100)}
          </p>
        )}
      </div>
    </div>
  );
}
