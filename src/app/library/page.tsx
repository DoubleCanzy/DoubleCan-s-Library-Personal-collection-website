import { createServerSupabase } from "@/lib/supabase";
import LibraryClient from "./LibraryClient";
import type { WorkWithRelations } from "@/types";

export const metadata = {
  title: "图书馆 — DoubleCan's Library",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>;
}) {
  const { tags: tagsParam } = await searchParams;
  const selectedTags = tagsParam
    ? tagsParam.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const supabase = await createServerSupabase();

  let query = supabase
    .from("works")
    .select(`
      *,
      tags:work_tags(tag:tags(*)),
      reviews(id)
    `)
    .order("created_at", { ascending: false });

  // 标签筛选
  if (selectedTags.length > 0) {
    for (const tag of selectedTags) {
      query = query.filter("work_tags.tag.name", "eq", tag);
    }
  }

  const { data } = await query;

  // 转换数据
  const works: WorkWithRelations[] = (data || []).map(
    (raw: Record<string, unknown>) => {
      const tags: WorkWithRelations["tags"] = [];
      if (Array.isArray(raw.tags)) {
        for (const item of raw.tags as Array<{
          tag?: { id: string; name: string; created_at: string };
        }>) {
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
        completion_status:
          raw.completion_status as WorkWithRelations["completion_status"],
        cover_image_url: raw.cover_image_url as string | null,
        created_at: raw.created_at as string,
        updated_at: raw.updated_at as string,
        tags,
        reviews: [],
      } as WorkWithRelations;
    }
  );

  return (
    <LibraryClient works={works} initialSelectedTags={selectedTags} />
  );
}
