import { createServerSupabase } from "@/lib/supabase";
import GalleryGrid from "@/components/home/GalleryGrid";
import LinkStartButton from "@/components/home/LinkStartButton";
import type { WorkWithRelations } from "@/types";

// 主页：画廊展示 + Link Start 按钮
export default async function HomePage() {
  // 直接从数据库获取作品列表（Server Component）
  let works: WorkWithRelations[] = [];

  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("works")
      .select(`
        *,
        tags:work_tags(tag:tags(*)),
        reviews(id)
      `)
      .order("created_at", { ascending: false });

    // 转换数据格式
    if (data) {
      works = data.map((raw: Record<string, unknown>) => {
        const tags: WorkWithRelations["tags"] = [];
        if (Array.isArray(raw.tags)) {
          for (const item of raw.tags as Array<{ tag?: { id: string; name: string; created_at: string } }>) {
            if (item?.tag) tags.push(item.tag);
          }
        }

        return {
          id: raw.id as string,
          title: raw.title as string | null,
          author: raw.author as string | null,
          synopsis: raw.synopsis as string | null,
          publication_date: raw.publication_date as string | null,
          publisher: raw.publisher as string | null,
          volume_count: raw.volume_count as number | null,
          type: raw.type as WorkWithRelations["type"],
          completion_status: raw.completion_status as WorkWithRelations["completion_status"],
          cover_image_url: raw.cover_image_url as string | null,
          created_at: raw.created_at as string,
          updated_at: raw.updated_at as string,
          tags,
          reviews: [],
        } as WorkWithRelations;
      });
    }
  } catch {
    // 数据库未连接时显示空状态
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="mt-1 text-sm text-gray-500">
          {works.length > 0
            ? `${works.length} 部作品在库`
            : "收藏你的第一部作品吧"}
        </p>
      </div>

      <GalleryGrid works={works} />
      <LinkStartButton />
    </div>
  );
}
