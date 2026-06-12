"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function DeleteButton({ workId }: { workId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/works/${workId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <Button variant="ghost" onClick={() => setConfirming(true)}>
        删除
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-red-600">确认删除？</span>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {deleting ? "删除中..." : "确认"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-sm text-gray-400 hover:text-black"
      >
        取消
      </button>
    </div>
  );
}
