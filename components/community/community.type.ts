export interface CommunityProps {
  communityName: string;
}

export interface PostProps {
  community_id: number;
  created_at: string;
  id: number;
  is_image: boolean | null;
  post_content: string;
  post_title: string;
  posting_user_id: {
    username: string;
  };
  communityName?: string;
}

export interface renderPostsProps {
  communityPosts: PostProps[] | null | Element | any;
  communityName: string;
  supabase: any;
}

export interface CommunityDetailsProps {
  community: {
    community_description: string | null;
    community_name: string;
    created_at: string | null;
    creator_user_id: string | null;
    id: number;
  };
  subscribeButton: React.JSX.Element | null;
}
