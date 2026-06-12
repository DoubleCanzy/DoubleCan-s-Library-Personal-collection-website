"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewSectionProps {
  workId: string;
  initialReviews: Review[];
}

export default function ReviewSection({
  workId,
  initialReviews,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 添加书评
  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/works/${workId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "添加失败");
      }

      const { review } = await res.json();
      setReviews((prev) => [review, ...prev]);
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "添加失败");
    } finally {
      setSubmitting(false);
    }
  }

  // 删除书评
  async function handleDeleteReview(reviewId: string) {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch {
      // 忽略
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-6">
        书评 ({reviews.length})
      </h2>

      {/* 写书评表单 */}
      <form onSubmit={handleAddReview} className="mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写点什么..."
          rows={3}
          className="w-full border-b-2 border-black bg-transparent px-1 py-2 text-sm outline-none resize-none focus:border-gray-400 placeholder:text-gray-400"
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={submitting || !content.trim()} size="sm">
            {submitting ? "提交中..." : "提交书评"}
          </Button>
        </div>
      </form>

      {/* 书评列表 */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          还没有书评，来说点什么吧
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group border-b border-gray-100 pb-4"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-400">
                  {formatDate(review.created_at)}
                </p>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="删除书评"
                >
                  删除
                </button>
              </div>
              <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
