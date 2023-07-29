import { RenderPosts } from "@/components/post/preview/render-posts";

import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function TrendingPosts() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase); // get user

  async function getTrendingPosts() {
    const { data, error } = await supabase
      .from("post_preview")
      .select()
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) {
      console.log(data);
      return data;
    }
    if (error) {
      console.log(error);
    }
  }

  const posts = await getTrendingPosts();

  if (posts) return <RenderPosts posts={posts} user={user} />;
}
