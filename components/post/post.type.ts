export interface PostDetailsProps {
  postId: number;
}

export interface PostProps {
  community_id: {
    community_name: string;
    community_id: number;
  };
  created_at: string;
  id: number;
  is_image: boolean | null;
  post_content: string;
  post_title: string;
  posting_user_id: {
    id: string;
    username: string;
  };
}

export interface PostHeaderProps {
  post: PostProps;
}
