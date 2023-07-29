import PostDetails from "@/components/post/post_details";

export interface PostIndexProps {
  params: { postId: number };
}

export default async function Index(context: PostIndexProps) {
  const { postId } = context.params;

  return <PostDetails postId={postId} />;
}
