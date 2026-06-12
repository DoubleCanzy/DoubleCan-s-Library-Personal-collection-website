import { NextRequest, NextResponse } from "next/server";
import { createWork, getWorks } from "@/lib/db";

// GET /api/works — 获取作品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      type: searchParams.get("type") || undefined,
      tag: searchParams.get("tag") || undefined,
      status: searchParams.get("status") || undefined,
      sort: searchParams.get("sort") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const works = await getWorks(filters);
    return NextResponse.json({ works });
  } catch (error) {
    console.error("GET /api/works error:", error);
    return NextResponse.json({ error: "获取作品列表失败" }, { status: 500 });
  }
}

// POST /api/works — 创建新作品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const work = await createWork(body);

    if (!work) {
      return NextResponse.json({ error: "创建作品失败" }, { status: 400 });
    }

    return NextResponse.json({ work }, { status: 201 });
  } catch (error) {
    console.error("POST /api/works error:", error);
    return NextResponse.json({ error: "创建作品失败" }, { status: 500 });
  }
}
