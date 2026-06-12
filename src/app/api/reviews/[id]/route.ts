import { NextRequest, NextResponse } from "next/server";
import { deleteReview } from "@/lib/db";

// DELETE /api/reviews/[id] — 删除书评
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteReview(id);

    if (!success) {
      return NextResponse.json({ error: "删除书评失败" }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] error:", error);
    return NextResponse.json({ error: "删除书评失败" }, { status: 500 });
  }
}
