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
  try {
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
  } catch {
    return { title: "作品详情 — DoubleCan's Library" };
  }
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const supabase = createServerSupabase();

    // 获取作品数据
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }

    // 获取标签
    const { data: tagData } = await supabase
      .from("work_tags")
      .select("tag:tags(*)")
      .eq("work_id", id);

    const tags: WorkWithRelations["tags"] = [];
    if (Array.isArray(tagData)) {
      for (const row of tagData) {
        const tag = (row as Record<string, unknown>).tag as
          | Record<string, unknown>
          | undefined;
        if (tag?.id) {
          tags.push({
            id: tag.id as string,
            name: tag.name as string,
            created_at: tag.created_at as string,
          });
        }
      }
    }

    // 获取书评
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*")
      .eq("work_id", id)
      .order("created_at", { ascending: false });

    const reviews: WorkWithRelations["reviews"] = [];
    if (Array.isArray(reviewData)) {
      for (const r of reviewData) {
        reviews.push({
          id: r.id as string,
          work_id: r.work_id as string,
          content: r.content as string,
          created_at: r.created_at as string,
        });
      }
    }

    const work: WorkWithRelations = {
      id: data.id as string,
      title: (data.title as string) || null,
      author: (data.author as string) || null,
      synopsis: (data.synopsis as string) || null,
      publication_date: (data.publication_date as string) || null,
      publisher: (data.publisher as string) || null,
      volume_count: (data.volume_count as number) || null,
      type: (data.type as WorkWithRelations["type"]) || null,
      completion_status:
        (data.completion_status as WorkWithRelations["completion_status"]) ||
        null,
      cover_image_url: (data.cover_image_url as string) || null,
      created_at: (data.created_at as string) || "",
      updated_at: (data.updated_at as string) || "",
      tags,
      reviews,
    };

    return (
      <>
        <WorkDetail work={work} />
        <ReviewSection workId={work.id} initialReviews={reviews} />
      </>
    );
  } catch (e) {
    // 如果出错，尝试跳转到 404
    console.error("WorkDetailPage error:", e);
    notFound();
  }
}
