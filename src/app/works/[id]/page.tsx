import { createServerSupabase } from "@/lib/supabase";
import WorkDetail from "@/components/works/WorkDetail";
import ReviewSection from "@/components/works/ReviewSection";
import { notFound } from "next/navigation";
import type { WorkWithRelations } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("works")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: data?.title
      ? `${data.title} — DoubleCan's Library`
      : "作品详情 — DoubleCan's Library",
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("works")
    .select(`
      *,
      tags:work_tags(tag:tags(*)),
      reviews(id, content, work_id, created_at)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  // 转换数据格式
  const rawData = data as Record<string, unknown>;

  // 提取标签
  const tags: WorkWithRelations["tags"] = [];
  if (Array.isArray(rawData.tags)) {
    for (const item of rawData.tags as Array<{
      tag?: { id: string; name: string; created_at: string };
    }>) {
      if (item?.tag) tags.push(item.tag);
    }
  }

  // 提取书评
  const reviews: WorkWithRelations["reviews"] = [];
  if (Array.isArray(rawData.reviews)) {
    for (const r of rawData.reviews as Array<{
      id: string;
      content: string;
      work_id: string;
      created_at: string;
    }>) {
      if (r.id) {
        reviews.push({
          id: r.id,
          work_id: r.work_id,
          content: r.content,
          created_at: r.created_at,
        });
      }
    }
  }

  const work: WorkWithRelations = {
    id: rawData.id as string,
    title: rawData.title as string | null,
    author: rawData.author as string | null,
    synopsis: rawData.synopsis as string | null,
    publication_date: rawData.publication_date as string | null,
    publisher: rawData.publisher as string | null,
    volume_count: rawData.volume_count as number | null,
    type: rawData.type as WorkWithRelations["type"],
    completion_status:
      rawData.completion_status as WorkWithRelations["completion_status"],
    cover_image_url: rawData.cover_image_url as string | null,
    created_at: rawData.created_at as string,
    updated_at: rawData.updated_at as string,
    tags,
    reviews,
  };

  return (
    <>
      <WorkDetail work={work} />
      <ReviewSection workId={work.id} initialReviews={reviews} />
    </>
  );
}
