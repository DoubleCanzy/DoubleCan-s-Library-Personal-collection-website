import { createServerSupabase } from "@/lib/supabase";
import type { Metadata } from "next";
import WorkDetailClient from "./WorkDetailClient";

// 动态生成页面标题
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return { title: "作品详情 — DoubleCan's Library" };
}

// 服务端组件：只负责获取数据和渲染客户端组件
export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkDetailClient id={id} />;
}
