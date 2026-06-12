import { NextRequest, NextResponse } from "next/server";
import { getTags } from "@/lib/db";

// GET /api/tags?q= — 标签自动提示
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;

    const tags = await getTags(query);
    const tagNames = tags.map((t) => t.name);

    return NextResponse.json({ tags: tagNames });
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "获取标签失败" }, { status: 500 });
  }
}
