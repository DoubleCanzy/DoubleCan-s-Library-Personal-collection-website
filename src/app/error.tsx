"use client";

import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">出错了</h1>
      <p className="text-sm text-gray-500">
        {error.message || "发生了意外错误"}
      </p>
      <Button onClick={reset} variant="secondary">
        重试
      </Button>
    </div>
  );
}
