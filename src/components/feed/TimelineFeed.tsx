import FeedItemComponent from "./FeedItem";
import type { FeedItem } from "@/types";

interface TimelineFeedProps {
  items: FeedItem[];
}

export default function TimelineFeed({ items }: TimelineFeedProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-2">这一天还没有动态</p>
        <p className="text-sm">添加新作品或书评后就会出现在这里</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 时间线竖线 */}
      <div className="absolute left-[4px] top-2 bottom-0 w-px bg-gray-200" />

      {items.map((item) => (
        <FeedItemComponent key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
