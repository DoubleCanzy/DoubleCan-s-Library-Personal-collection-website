import { createServerSupabase } from "@/lib/supabase";
import TimelineFeed from "@/components/feed/TimelineFeed";
import PersonalInfo from "@/components/feed/PersonalInfo";
import CalendarWidget from "@/components/feed/CalendarWidget";
import SwitchButton from "@/components/layout/SwitchButton";
import type { FeedItem } from "@/types";

export const metadata = {
  title: "动态 — DoubleCan's Library",
};

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  const supabase = await createServerSupabase();

  // 获取作品动态
  let worksQuery = supabase
    .from("works")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  // 获取书评动态
  let reviewsQuery = supabase
    .from("reviews")
    .select("id, content, work_id, created_at, works(id, title)")
    .order("created_at", { ascending: false })
    .limit(50);

  // 日期筛选
  if (date) {
    const startOfDay = `${date}T00:00:00+00:00`;
    const endOfDay = `${date}T23:59:59+00:00`;
    worksQuery = worksQuery
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay);
    reviewsQuery = reviewsQuery
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay);
  }

  const [worksResult, reviewsResult] = await Promise.all([
    worksQuery,
    reviewsQuery,
  ]);

  // 合并动态流
  const feedItems: FeedItem[] = [];

  for (const w of worksResult.data || []) {
    feedItems.push({
      type: "work",
      id: w.id,
      title: w.title,
      created_at: w.created_at,
      content: null,
      work_id: null,
    });
  }

  for (const r of (reviewsResult.data || []) as Array<{
    id: string;
    content: string;
    work_id: string;
    created_at: string;
    works: Array<{ id: string; title: string | null }> | null;
  }>) {
    feedItems.push({
      type: "review",
      id: r.id,
      title: r.works?.[0]?.title || "未知作品",
      created_at: r.created_at,
      content: r.content,
      work_id: r.work_id,
    });
  }

  feedItems.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* 主内容区：时间线 */}
      <main className="flex-1 px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          {date ? `${date} 的动态` : "最近动态"}
        </h1>
        <TimelineFeed items={feedItems} />
      </main>

      {/* 侧栏 */}
      <aside className="w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50 px-4 py-8 space-y-6">
        <PersonalInfo />
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">📅 日历</h3>
          <CalendarWidget />
        </div>
      </aside>

      {/* 切换到图书馆页 */}
      <SwitchButton target="/library" label="切换到图书馆" />
    </div>
  );
}
