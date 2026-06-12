import CoverImage from "@/components/ui/CoverImage";
import type { WorkWithRelations } from "@/types";

interface WorksGridProps {
  works: WorkWithRelations[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export default function WorksGrid({
  works,
  selectedTags,
  onTagClick,
}: WorksGridProps) {
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-2">
          {selectedTags.length > 0
            ? "没有匹配的作品"
            : "还没有作品"}
        </p>
        <p className="text-sm">
          {selectedTags.length > 0
            ? "试试更换其他标签"
            : '点击右上角 "+ Add Work" 添加你的第一个作品'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
      {works.map((work) => (
        <div key={work.id} className="group">
          <CoverImage
            url={work.cover_image_url}
            alt={work.title || "Untitled"}
            size="full"
            linkTo={`/works/${work.id}`}
          />
          {work.title && (
            <p className="mt-2 text-sm font-medium text-center truncate group-hover:text-gray-600 transition-colors">
              {work.title}
            </p>
          )}
          {/* 作品标签 */}
          {work.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {work.tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onTagClick(tag.name);
                  }}
                  className={`text-xs px-1.5 py-0.5 transition-colors ${
                    selectedTags.includes(tag.name)
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
