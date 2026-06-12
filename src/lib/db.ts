import { createServerSupabase } from "./supabase";
import type { Work, WorkWithRelations, Tag, Review, FeedItem } from "@/types";

// ============================================================
// 作品 CRUD
// ============================================================

// 获取作品列表（支持筛选和排序）
export async function getWorks(filters?: {
  type?: string;
  tag?: string;
  status?: string;
  sort?: string;
  search?: string;
}): Promise<WorkWithRelations[]> {
  const supabase = await createServerSupabase();

  let query = supabase.from("works").select(`
      *,
      tags:work_tags(tag:tags(*)),
      reviews(id)
    `);

  // 类型筛选
  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  // 完结状态筛选
  if (filters?.status) {
    query = query.eq("completion_status", filters.status);
  }

  // 标签筛选（取交集：作品必须同时拥有所有指定标签）
  if (filters?.tag) {
    const tagNames = filters.tag.split(",").map((t) => t.trim()).filter(Boolean);
    if (tagNames.length > 0) {
      // 查找拥有所有这些标签的作品
      for (const tagName of tagNames) {
        query = query.filter(
          "work_tags.tag.name",
          "eq",
          tagName
        );
      }
    }
  }

  // 搜索（标题或作者）
  if (filters?.search) {
    const search = `%${filters.search}%`;
    query = query.or(`title.ilike.${search},author.ilike.${search}`);
  }

  // 排序
  switch (filters?.sort) {
    case "title":
      query = query.order("title", { ascending: true });
      break;
    case "date":
      query = query.order("publication_date", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("getWorks error:", error);
    return [];
  }

  // 转换嵌套结构
  return (data || []).map(transformWork);
}

// 获取单个作品（含标签和书评）
export async function getWorkById(id: string): Promise<WorkWithRelations | null> {
  const supabase = await createServerSupabase();

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
    console.error("getWorkById error:", error);
    return null;
  }

  return transformWork(data);
}

// 创建作品
export async function createWork(
  workData: Partial<Omit<Work, "id" | "created_at" | "updated_at">> & { tags?: string[] }
): Promise<Work | null> {
  const supabase = await createServerSupabase();

  const { tags, ...fields } = workData;

  // 只提交非空字段
  const insertData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== null && value !== undefined && value !== "") {
      insertData[key] = value;
    }
  }

  const { data, error } = await supabase
    .from("works")
    .insert(insertData)
    .select()
    .single();

  if (error || !data) {
    console.error("createWork error:", error);
    return null;
  }

  // 处理标签
  if (tags && tags.length > 0) {
    await setWorkTags(data.id, tags);
  }

  return data as Work;
}

// 更新作品
export async function updateWork(
  id: string,
  workData: Partial<Omit<Work, "id" | "created_at" | "updated_at">> & { tags?: string[] }
): Promise<Work | null> {
  const supabase = await createServerSupabase();

  const { tags, ...fields } = workData;

  // 只提交非空字段
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== null && value !== undefined) {
      // 允许空字符串来清空字段
      updateData[key] = value === "" ? null : value;
    }
  }

  const { data, error } = await supabase
    .from("works")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("updateWork error:", error);
    return null;
  }

  // 更新标签
  if (tags !== undefined) {
    await setWorkTags(id, tags);
  }

  return data as Work;
}

// 删除作品
export async function deleteWork(id: string): Promise<boolean> {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from("works").delete().eq("id", id);

  if (error) {
    console.error("deleteWork error:", error);
    return false;
  }

  return true;
}

// ============================================================
// 标签
// ============================================================

// 获取标签列表（支持搜索提示）
export async function getTags(query?: string): Promise<Tag[]> {
  const supabase = await createServerSupabase();

  let dbQuery = supabase.from("tags").select("*").order("name");

  if (query) {
    dbQuery = dbQuery.ilike("name", `${query}%`);
    dbQuery = dbQuery.limit(10);
  }

  const { data, error } = await dbQuery;

  if (error) {
    console.error("getTags error:", error);
    return [];
  }

  return data || [];
}

// 获取或创建标签（upsert）
async function getOrCreateTag(name: string): Promise<string | null> {
  const supabase = await createServerSupabase();
  const normalized = name.trim().toLowerCase();

  if (!normalized) return null;

  // 先尝试查找
  const { data: existing } = await supabase
    .from("tags")
    .select("id")
    .eq("name", normalized)
    .single();

  if (existing) return existing.id;

  // 不存在则创建
  const { data: created, error } = await supabase
    .from("tags")
    .insert({ name: normalized })
    .select("id")
    .single();

  if (error) {
    // 可能是并发导致的唯一约束冲突，再查一次
    const { data: retry } = await supabase
      .from("tags")
      .select("id")
      .eq("name", normalized)
      .single();
    return retry?.id || null;
  }

  return created?.id || null;
}

// 设置作品的标签（先清空再设置）
async function setWorkTags(workId: string, tagNames: string[]): Promise<void> {
  const supabase = await createServerSupabase();

  // 删除旧的关联
  await supabase.from("work_tags").delete().eq("work_id", workId);

  if (tagNames.length === 0) return;

  // 获取或创建每个标签
  const tagIds: string[] = [];
  for (const name of tagNames) {
    const id = await getOrCreateTag(name);
    if (id) tagIds.push(id);
  }

  // 插入新关联
  if (tagIds.length > 0) {
    await supabase.from("work_tags").insert(
      tagIds.map((tagId) => ({ work_id: workId, tag_id: tagId }))
    );
  }
}

// ============================================================
// 书评
// ============================================================

// 获取作品的书评列表
export async function getReviews(workId: string): Promise<Review[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("work_id", workId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviews error:", error);
    return [];
  }

  return data || [];
}

// 添加书评
export async function addReview(workId: string, content: string): Promise<Review | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("reviews")
    .insert({ work_id: workId, content })
    .select()
    .single();

  if (error || !data) {
    console.error("addReview error:", error);
    return null;
  }

  return data;
}

// 删除书评
export async function deleteReview(id: string): Promise<boolean> {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error("deleteReview error:", error);
    return false;
  }

  return true;
}

// ============================================================
// 动态流（聚合作品创建 + 书评）
// ============================================================

export async function getFeed(date?: string): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  // 作品动态
  let worksQuery = supabase
    .from("works")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  // 书评动态
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

  if (worksResult.error) console.error("getFeed works error:", worksResult.error);
  if (reviewsResult.error) console.error("getFeed reviews error:", reviewsResult.error);

  const feedItems: FeedItem[] = [];

  // 作品条目
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

  // 书评条目
  for (const r of (reviewsResult.data || []) as Array<{
    id: string;
    content: string;
    work_id: string;
    created_at: string;
    works: Array<{ id: string; title: string | null }> | null;
  }>) {
    const reviewTitle = r.works?.[0]?.title || "未知作品";
    feedItems.push({
      type: "review",
      id: r.id,
      title: reviewTitle,
      created_at: r.created_at,
      content: r.content,
      work_id: r.work_id,
    });
  }

  // 按时间倒序排列
  feedItems.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return feedItems;
}

// 获取有动态的日期列表（用于日历高亮）
export async function getActiveDates(): Promise<string[]> {
  const supabase = await createServerSupabase();

  const [worksResult, reviewsResult] = await Promise.all([
    supabase.from("works").select("created_at"),
    supabase.from("reviews").select("created_at"),
  ]);

  const dates = new Set<string>();

  for (const w of worksResult.data || []) {
    dates.add(w.created_at.split("T")[0]);
  }

  for (const r of reviewsResult.data || []) {
    dates.add(r.created_at.split("T")[0]);
  }

  return Array.from(dates).sort();
}

// ============================================================
// 辅助：转换 Supabase 嵌套数据为我们的类型
// ============================================================

function transformWork(raw: Record<string, unknown>): WorkWithRelations {
  // 提取标签
  const tags: Tag[] = [];
  if (Array.isArray(raw.tags)) {
    for (const item of raw.tags as Array<{ tag?: Tag }>) {
      if (item?.tag) {
        tags.push(item.tag);
      }
    }
  }

  // 提取书评
  const reviews: Review[] = [];
  if (Array.isArray(raw.reviews)) {
    for (const r of raw.reviews as Array<Record<string, unknown>>) {
      if (r.id) {
        reviews.push({
          id: r.id as string,
          work_id: r.work_id as string,
          content: r.content as string,
          created_at: r.created_at as string,
        });
      }
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
    reviews,
  };
}
