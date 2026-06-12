// ============================================================
// 作品类型
// ============================================================
export type WorkType = "Novel" | "Anime" | "Manga";

export type CompletionStatus = "Ongoing" | "Completed" | "Abandoned";

export interface Work {
  id: string;
  title: string | null;
  author: string | null;
  synopsis: string | null;
  publication_date: string | null;
  publisher: string | null;
  volume_count: number | null;
  type: WorkType | null;
  completion_status: CompletionStatus | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

// 作品关联标签和书评的完整类型
export interface WorkWithRelations extends Work {
  tags: Tag[];
  reviews: Review[];
}

// ============================================================
// 标签
// ============================================================
export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

// ============================================================
// 书评
// ============================================================
export interface Review {
  id: string;
  work_id: string;
  content: string;
  created_at: string;
}

// 书评关联作品标题（用于动态页展示）
export interface ReviewWithWork extends Review {
  works: Array<{
    id: string;
    title: string | null;
  }> | null;
}

// ============================================================
// 动态流
// ============================================================
export type FeedItemType = "work" | "review";

export interface FeedItem {
  type: FeedItemType;
  id: string;
  title: string | null;
  created_at: string;
  content: string | null; // 书评内容
  work_id: string | null; // 关联的作品 ID（书评用）
}

// ============================================================
// 上传
// ============================================================
export interface UploadResult {
  url: string;
}
