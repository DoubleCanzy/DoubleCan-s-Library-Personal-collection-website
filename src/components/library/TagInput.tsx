"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import TagBadge from "@/components/ui/TagBadge";

interface TagInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({
  selectedTags,
  onChange,
  placeholder = "输入标签...",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 加载全部已有标签（用于显示标签云）
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        if (data.tags) setAllTags(data.tags);
      })
      .catch(() => {});
  }, []);

  // 带防抖的自动提示
  const fetchSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tags?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.tags) {
          // 过滤掉已选中的标签
          setSuggestions(
            data.tags.filter((t: string) => !selectedTags.includes(t))
          );
          setShowSuggestions(true);
        }
      } catch {
        // 忽略
      }
    }, 300);
  }, [selectedTags]);

  // 添加标签
  function addTag(tag: string) {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || selectedTags.includes(normalized)) {
      setInput("");
      setShowSuggestions(false);
      return;
    }

    onChange([...selectedTags, normalized]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  // 移除标签
  function removeTag(tag: string) {
    onChange(selectedTags.filter((t) => t !== tag));
  }

  // 键盘事件
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag}
              name={tag}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      )}

      {/* 输入框 + 下拉提示 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            // 延迟关闭，让点击建议生效
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className="w-full border-b-2 border-black bg-transparent px-1 py-2 text-sm outline-none focus:border-gray-400 placeholder:text-gray-400"
        />

        {/* 下拉建议 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 border border-black bg-white shadow-lg">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(s);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 已有标签云（点击快速添加） */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags
            .filter((t) => !selectedTags.includes(t))
            .slice(0, 15)
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="px-2 py-0.5 text-xs border border-gray-300 text-gray-500 hover:border-black hover:text-black transition-colors"
              >
                + {tag}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
