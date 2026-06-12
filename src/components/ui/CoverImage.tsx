"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  url: string | null | undefined;
  alt?: string;
  size?: "sm" | "md" | "lg" | "full";
  uploadMode?: boolean;
  onUpload?: (file: File) => void;
  onUrlChange?: (url: string) => void;
  className?: string;
  linkTo?: string;
}

export default function CoverImage({
  url,
  alt = "Cover",
  size = "md",
  uploadMode = false,
  onUpload,
  onUrlChange,
  className,
  linkTo,
}: CoverImageProps) {
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-24 h-36",
    md: "w-40 h-56",
    lg: "w-56 h-80",
    full: "w-full aspect-[2/3] max-w-xs",
  };

  // 处理文件选择
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  }

  // 拖拽事件
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  }

  // 回退到占位图
  const imageUrl = url || "/placeholder-cover.svg";

  const ImageElement = (
    <div
      className={cn(
        "relative overflow-hidden border border-gray-200 bg-gray-50",
        sizeClasses[size],
        uploadMode && !url && "border-dashed border-gray-400",
        dragOver && "border-black bg-gray-100",
        className
      )}
      onDragOver={uploadMode ? handleDragOver : undefined}
      onDragLeave={uploadMode ? handleDragLeave : undefined}
      onDrop={uploadMode ? handleDrop : undefined}
    >
      {url ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 120px, 200px"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          {uploadMode ? (
            <>
              <span className="text-3xl text-gray-400 mb-2">+</span>
              <span className="text-xs text-gray-400">
                拖拽图片或点击上传<br />
                <span className="text-gray-300">或下方输入链接</span>
              </span>
            </>
          ) : (
            <Image
              src="/placeholder-cover.svg"
              alt="No Cover"
              fill
              className="object-contain p-4"
              sizes="200px"
            />
          )}
        </div>
      )}

      {uploadMode && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="上传封面图片"
        />
      )}
    </div>
  );

  // 上传模式：显示图片 + 输入框
  if (uploadMode) {
    return (
      <div className="space-y-3">
        {ImageElement}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-400 text-center">或</div>
          <input
            type="url"
            placeholder="粘贴图片链接..."
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              if (onUrlChange) onUrlChange(e.target.value);
            }}
            className="border-b border-gray-300 bg-transparent px-1 py-1 text-sm outline-none focus:border-black transition-colors"
          />
        </div>
      </div>
    );
  }

  // 链接模式
  if (linkTo) {
    return (
      <a href={linkTo} className="block transition-opacity hover:opacity-80">
        {ImageElement}
      </a>
    );
  }

  return ImageElement;
}
