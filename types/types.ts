import { Database } from "./supabase";

export type CommentTree = Database["public"]["Views"]["post_comments"]["Row"];
export type Community = Database["public"]["Tables"]["community"]["Row"];
export type Post = Database["public"]["Tables"]["post"]["Row"];
export type CommunityPosts = Database["public"]["Views"]["post_preview"]["Row"];
export type ConversationMessages =
  Database["public"]["Views"]["conversation_messages_view"]["Row"];

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
