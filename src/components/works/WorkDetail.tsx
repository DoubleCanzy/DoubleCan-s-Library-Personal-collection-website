import CoverImage from "@/components/ui/CoverImage";
import TagBadge from "@/components/ui/TagBadge";
import Button from "@/components/ui/Button";
import DeleteButton from "./DeleteButton";
import { formatDate, workTypeLabel, statusLabel } from "@/lib/utils";
import type { WorkWithRelations } from "@/types";

interface WorkDetailProps {
  work: WorkWithRelations;
}

export default function WorkDetail({ work }: WorkDetailProps) {
  return (
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

          {/* 元数据行 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {work.author && <span>{work.author}</span>}
            {work.publisher && <span>· {work.publisher}</span>}
            {work.publication_date && (
              <span>· {formatDate(work.publication_date)}</span>
            )}
          </div>

          {/* 类型和状态 */}
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

          {/* 标签 */}
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

          {/* 简介 */}
          {work.synopsis && (
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-2">简介</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {work.synopsis}
              </p>
            </div>
          )}

          {/* 其他信息 */}
          <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-1">
            {work.publisher && (
              <p>出版社：{work.publisher}</p>
            )}
            {work.publication_date && (
              <p>出版时间：{formatDate(work.publication_date)}</p>
            )}
            {work.volume_count !== null && (
              <p>卷数：{work.volume_count}</p>
            )}
            <p>添加时间：{formatDate(work.created_at)}</p>
            {work.updated_at !== work.created_at && (
              <p>最后更新：{formatDate(work.updated_at)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
