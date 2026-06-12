import { createServerSupabase } from "@/lib/supabase";
import WorkForm from "@/components/works/WorkForm";
import { notFound } from "next/navigation";

export const metadata = {
  title: "编辑作品 — DoubleCan's Library",
};

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 获取作品数据
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("works")
    .select("*, tags:work_tags(tag:tags(*))")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  // 提取标签
  const tags: { name: string }[] = [];
  if (Array.isArray(data.tags)) {
    for (const item of data.tags as Array<{ tag?: { name: string } }>) {
      if (item?.tag) tags.push({ name: item.tag.name });
    }
  }

  const work = {
    ...data,
    tags,
  };

  return <WorkForm work={work} />;
}
