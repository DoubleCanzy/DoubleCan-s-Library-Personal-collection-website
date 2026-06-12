import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-6xl font-semibold">404</h1>
      <p className="text-sm text-gray-500">页面不存在</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center border border-black px-5 py-2.5 text-sm font-medium hover:bg-black hover:text-white transition-colors"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
