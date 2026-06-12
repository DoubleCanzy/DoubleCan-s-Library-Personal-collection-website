import { NextRequest, NextResponse } from "next/server";
import { getWorkById, updateWork, deleteWork } from "@/lib/db";

// GET /api/works/[id] — 获取单个作品
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const work = await getWorkById(id);

    if (!work) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    return NextResponse.json({ work });
  } catch (error) {
    console.error("GET /api/works/[id] error:", error);
    return NextResponse.json({ error: "获取作品失败" }, { status: 500 });
  }
}

// PUT /api/works/[id] — 更新作品
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const work = await updateWork(id, body);

    if (!work) {
      return NextResponse.json({ error: "更新作品失败" }, { status: 400 });
    }

    return NextResponse.json({ work });
  } catch (error) {
    console.error("PUT /api/works/[id] error:", error);
    return NextResponse.json({ error: "更新作品失败" }, { status: 500 });
  }
}

// DELETE /api/works/[id] — 删除作品
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteWork(id);

    if (!success) {
      return NextResponse.json({ error: "删除作品失败" }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/works/[id] error:", error);
    return NextResponse.json({ error: "删除作品失败" }, { status: 500 });
  }
}
