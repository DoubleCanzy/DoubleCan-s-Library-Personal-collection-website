"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import TagInput from "@/components/library/TagInput";
import CoverImage from "@/components/ui/CoverImage";
import type { Work } from "@/types";

interface WorkFormProps {
  work?: Work & { tags?: { name: string }[] }; // 编辑模式时传入已有数据
}

export default function WorkForm({ work }: WorkFormProps) {
  const router = useRouter();
  const isEdit = !!work;

  // 表单字段状态
  const [title, setTitle] = useState(work?.title || "");
  const [author, setAuthor] = useState(work?.author || "");
  const [synopsis, setSynopsis] = useState(work?.synopsis || "");
  const [publicationDate, setPublicationDate] = useState(
    work?.publication_date || ""
  );
  const [publisher, setPublisher] = useState(work?.publisher || "");
  const [volumeCount, setVolumeCount] = useState(
    work?.volume_count?.toString() || ""
  );
  const [type, setType] = useState(work?.type || "");
  const [status, setStatus] = useState(work?.completion_status || "");
  const [coverUrl, setCoverUrl] = useState(work?.cover_image_url || "");
  const [tags, setTags] = useState<string[]>(
    work?.tags?.map((t) => t.name) || []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 上传封面文件
  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "上传失败");
      }

      const { url } = await res.json();
      setCoverUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }, []);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: title || null,
      author: author || null,
      synopsis: synopsis || null,
      publication_date: publicationDate || null,
      publisher: publisher || null,
      volume_count: volumeCount ? parseInt(volumeCount, 10) : null,
      type: type || null,
      completion_status: status || null,
      cover_image_url: coverUrl || null,
      tags,
    };

    try {
      const url = isEdit ? `/api/works/${work!.id}` : "/api/works";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "保存失败");
      }

      const data = await res.json();
      router.push(`/works/${data.work.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const typeOptions = [
    { value: "Novel", label: "小说" },
    { value: "Anime", label: "动画" },
    { value: "Manga", label: "漫画" },
  ];

  const statusOptions = [
    { value: "Ongoing", label: "连载中" },
    { value: "Completed", label: "已完结" },
    { value: "Abandoned", label: "作者弃坑" },
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "编辑作品" : "添加作品"}
      </h1>

      {/* 封面图片 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">封面图片</label>
        <CoverImage
          url={coverUrl || null}
          size="lg"
          uploadMode
          onUpload={handleFileUpload}
          onUrlChange={setCoverUrl}
        />
        {uploading && (
          <p className="text-xs text-gray-400">上传中...</p>
        )}
      </div>

      {/* 标题 */}
      <Input label="标题" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="作品名称" />

      {/* 作者 */}
      <Input label="作者" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="作者名" />

      {/* 简介 */}
      <Textarea label="简介" name="synopsis" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="作品简介..." rows={4} />

      {/* 出版时间 + 出版社 */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="出版时间" name="pubDate" type="date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
        <Input label="出版社" name="publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="出版社名称" />
      </div>

      {/* 卷数 + 类型 */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="卷数" name="volumeCount" type="number" value={volumeCount} onChange={(e) => setVolumeCount(e.target.value)} placeholder="0" />
        <Select label="类型" name="type" options={typeOptions} value={type} onChange={(e) => setType(e.target.value)} />
      </div>

      {/* 完结状态 */}
      <Select label="完结状态" name="status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} />

      {/* 标签 */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">标签</label>
        <TagInput selectedTags={tags} onChange={setTags} />
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* 提交按钮 */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? "保存中..." : isEdit ? "更新作品" : "创建作品"}
        </Button>
        <Button variant="secondary" href={isEdit ? `/works/${work!.id}` : "/"}>
          取消
        </Button>
      </div>
    </form>
  );
}
