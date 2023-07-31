import { SupabaseClient, User } from "@supabase/supabase-js";

export interface fetchProfileProps {
  user: User | null;
  supabase: SupabaseClient;
}

export async function fetchUsername({ user, supabase }: fetchProfileProps) {
  if (user) {
    const { data } = await supabase
      .from("user_profile")
      .select("*")
      .match({ id: user.id })
      .limit(1)
      .single();

    if (data) return data.username;
  }
}

export async function fetchCreatedCommunities({
  user,
  supabase,
}: fetchProfileProps) {
  if (user) {
    const { data } = await supabase
      .from("community")
      .select("*")
      .eq("creator_user_id", user.id);

    if (data) return data;
  }
}

export async function fetchUserSubscriptions({
  user,
  supabase,
}: fetchProfileProps) {
  if (user) {
    const { data } = await supabase
      .from("user_community")
      .select("community(id, community_name, community_description)")
      .eq("user_id", user.id);

    if (data) return data;
  }
}

export async function fetchUserPosts({ user, supabase }: fetchProfileProps) {
  if (user) {
    const { data: posts } = await supabase
      .from("post")
      .select(
        "created_at, id, post_content, post_title, community_id(community_name), is_image",
      )
      .eq("posting_user_id", user.id);
    if (posts) return posts;
  }
}
