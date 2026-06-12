"use client";

import { useRouter, useSearchParams } from "next/navigation";
import WorksGrid from "@/components/library/WorksGrid";
import TagFilter from "@/components/library/TagFilter";
import SwitchButton from "@/components/layout/SwitchButton";
import type { WorkWithRelations } from "@/types";

interface LibraryClientProps {
  works: WorkWithRelations[];
  initialSelectedTags: string[];
}

export default function LibraryClient({
  works,
  initialSelectedTags,
}: LibraryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleTagsChange(tags: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (tags.length > 0) {
      params.set("tags", tags.join(","));
    } else {
      params.delete("tags");
    }
    const qs = params.toString();
    router.push(`/library${qs ? `?${qs}` : ""}`);
  }

  function handleTagClick(tag: string) {
    const current = initialSelectedTags.includes(tag)
      ? initialSelectedTags.filter((t) => t !== tag)
      : [...initialSelectedTags, tag];
    handleTagsChange(current);
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* 主内容区：宫格 */}
      <main className="flex-1 px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          Library
          {initialSelectedTags.length > 0 && (
            <span className="ml-2 text-base font-normal text-gray-400">
              / 筛选: {initialSelectedTags.join(", ")}
            </span>
          )}
        </h1>
        <WorksGrid
          works={works}
          selectedTags={initialSelectedTags}
          onTagClick={handleTagClick}
        />
      </main>

      {/* 侧栏 */}
      <aside className="w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50 px-4 py-8">
        <TagFilter
          selectedTags={initialSelectedTags}
          onTagsChange={handleTagsChange}
        />
      </aside>

      {/* 切换按钮 */}
      <SwitchButton target="/feed" label="切换到动态" />
    </div>
  );
}
