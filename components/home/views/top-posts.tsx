import { RenderPosts } from "@/components/post/preview/render-posts";

import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function TopPosts() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase); // get user

  async function getTopPosts() {
    const { data, error } = await supabase
      .from("post_preview_plus_votes")
      .select()
      .order("total_votes", { ascending: false })
      .limit(5);
    if (data) {
      console.log(data);
      return data;
    }
    if (error) {
      console.log(error);
    }
  }

  const posts = await getTopPosts();

  if (posts) return <RenderPosts posts={posts} user={user} />;
}
