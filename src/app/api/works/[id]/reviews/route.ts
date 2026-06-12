import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview } from "@/lib/db";

// GET /api/works/[id]/reviews — 获取作品书评
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = await getReviews(id);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/works/[id]/reviews error:", error);
    return NextResponse.json({ error: "获取书评失败" }, { status: 500 });
  }
}

// POST /api/works/[id]/reviews — 添加书评
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "书评内容不能为空" }, { status: 400 });
    }

    const review = await addReview(id, content.trim());

    if (!review) {
      return NextResponse.json({ error: "添加书评失败" }, { status: 400 });
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/works/[id]/reviews error:", error);
    return NextResponse.json({ error: "添加书评失败" }, { status: 500 });
  }
}
