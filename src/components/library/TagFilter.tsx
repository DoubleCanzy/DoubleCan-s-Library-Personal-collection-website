"use client";

import { useState, useEffect } from "react";
import TagInput from "@/components/library/TagInput";
import TagBadge from "@/components/ui/TagBadge";

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagFilter({
  selectedTags,
  onTagsChange,
}: TagFilterProps) {
  const [allTags, setAllTags] = useState<string[]>([]);

  // 加载所有已有标签
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        if (data.tags) setAllTags(data.tags);
      })
      .catch(() => {});
  }, []);

  function removeTag(tag: string) {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500">🏷️ 标签筛选</h3>

      {/* 标签输入 */}
      <TagInput
        selectedTags={selectedTags}
        onChange={onTagsChange}
        placeholder="输入标签筛选..."
      />

      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag}
              name={tag}
              active
              onRemove={() => removeTag(tag)}
            />
          ))}
          <button
            onClick={() => onTagsChange([])}
            className="text-xs text-gray-400 hover:text-black transition-colors"
          >
            清除全部
          </button>
        </div>
      )}

      {/* 全部标签云 */}
      {allTags.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-2">全部标签</p>
          <div className="flex flex-wrap gap-1.5">
            {allTags
              .filter((t) => !selectedTags.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagsChange([...selectedTags, tag])}
                  className="px-2 py-0.5 text-xs border border-gray-300 text-gray-500 hover:border-black hover:text-black transition-colors"
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
