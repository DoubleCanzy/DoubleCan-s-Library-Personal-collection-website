import { NextRequest, NextResponse } from "next/server";
import { getFeed } from "@/lib/db";

// GET /api/feed?date= — 获取聚合动态流
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;

    const feed = await getFeed(date);
    return NextResponse.json({ feed });
  } catch (error) {
    console.error("GET /api/feed error:", error);
    return NextResponse.json({ error: "获取动态失败" }, { status: 500 });
  }
}
