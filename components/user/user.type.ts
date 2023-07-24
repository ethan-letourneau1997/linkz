import { User } from "@supabase/supabase-js";

export interface UserDetailsProps {
  username: string;
  user: User;
}

export interface UserCommunityProps {
  userCommunities: CommunityProps[] | undefined;
}

export interface CommunityProps {
  id: number;
  community_name: string;
  community_description: string;
}

export interface UserPost {
  id: string;
  community_id: any;
  post_title: string;
  post_content: string;
  created_at: string;
  is_image: boolean;
}

export interface UserPostsProps {
  userPosts: UserPost[] | undefined;
}
