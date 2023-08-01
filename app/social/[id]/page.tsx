import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies });
  const { data: posts } = await supabase.from("message").select("id");
  return posts ?? [];
}

export default async function Message({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: post } = await supabase
    .from("message")
    .select()
    .match({ id })
    .single();

  if (!post) {
    notFound();
  }
  return <pre>{JSON.stringify(post, null, 2)}</pre>;
}
