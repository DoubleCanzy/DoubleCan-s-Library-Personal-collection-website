"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CoverImage from "@/components/ui/CoverImage";
import TagBadge from "@/components/ui/TagBadge";
import Button from "@/components/ui/Button";
import DeleteButton from "@/components/works/DeleteButton";
import ReviewSection from "@/components/works/ReviewSection";
import { formatDate, workTypeLabel, statusLabel } from "@/lib/utils";
import type { WorkWithRelations } from "@/types";

export default function WorkDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [work, setWork] = useState<WorkWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWork() {
      try {
        const res = await fetch(`/api/works/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            router.push("/not-found");
            return;
          }
          throw new Error("获取作品失败");
        }
        const data = await res.json();
        setWork(data.work);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    }
    fetchWork();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-500">{error || "作品不存在"}</p>
        <Button href="/">← 回到首页</Button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" href="/">
            ← 返回
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" href={`/works/${work.id}/edit`}>
              编辑
            </Button>
            <DeleteButton workId={work.id} />
          </div>
        </div>

        {/* 主体：左侧封面 + 右侧信息 */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* 封面 */}
          <div className="flex-shrink-0">
            <CoverImage
              url={work.cover_image_url}
              alt={work.title || "Untitled"}
              size="lg"
            />
          </div>

          {/* 信息 */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-semibold">
              {work.title || "未命名作品"}
            </h1>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {work.author && <span>{work.author}</span>}
              {work.publisher && <span>· {work.publisher}</span>}
              {work.publication_date && (
                <span>· {formatDate(work.publication_date)}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {work.type && (
                <span className="border border-gray-300 px-2 py-0.5">
                  {workTypeLabel(work.type)}
                </span>
              )}
              {work.completion_status && (
                <span className="border border-gray-300 px-2 py-0.5">
                  {statusLabel(work.completion_status)}
                </span>
              )}
              {work.volume_count !== null && work.volume_count > 0 && (
                <span className="border border-gray-300 px-2 py-0.5">
                  {work.volume_count} 卷
                </span>
              )}
            </div>

            {work.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <TagBadge
                    key={tag.id}
                    name={tag.name}
                    onClick={() => {
                      window.location.href = `/library?tags=${tag.name}`;
                    }}
                  />
                ))}
              </div>
            )}

            {work.synopsis && (
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-2">简介</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {work.synopsis}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-1">
              {work.publisher && <p>出版社：{work.publisher}</p>}
              {work.publication_date && (
                <p>出版时间：{formatDate(work.publication_date)}</p>
              )}
              {work.volume_count !== null && <p>卷数：{work.volume_count}</p>}
              <p>添加时间：{formatDate(work.created_at)}</p>
              {work.updated_at !== work.created_at && (
                <p>最后更新：{formatDate(work.updated_at)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewSection workId={work.id} initialReviews={work.reviews || []} />
    </>
  );
}
