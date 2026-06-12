import CoverImage from "@/components/ui/CoverImage";
import type { WorkWithRelations } from "@/types";

interface GalleryGridProps {
  works: WorkWithRelations[];
}

export default function GalleryGrid({ works }: GalleryGridProps) {
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg mb-2">还没有作品</p>
        <p className="text-sm">点击右上角的 "+ Add Work" 添加你的第一个作品吧</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
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
        </div>
      ))}
    </div>
  );
}
