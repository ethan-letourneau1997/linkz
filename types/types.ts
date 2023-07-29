import { Database } from "./supabase";

export type CommentTree = Database["public"]["Views"]["comment_tree"]["Row"];
export type Community = Database["public"]["Tables"]["community"]["Row"];
export type Post = Database["public"]["Tables"]["post"]["Row"];
export type CommunityPosts =
  Database["public"]["Views"]["community_posts"]["Row"];

export type CommunitySubCount =
  Database["public"]["Views"]["community_sub_count"]["Row"];

export type UserProfile = Database["public"]["Tables"]["user_profile"]["Row"];

export type post_preview = Database["public"]["Views"]["post_preview"]["Row"];

// MISC

export interface SubscribeBtnProps {
  userId: string;
  communityId: string;
}

export type GoogleButtonProps = {
  handleGoogleSignIn: () => void;
};
