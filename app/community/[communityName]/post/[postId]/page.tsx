import PostDetails from "@/components/post/post_details";

interface IndexProps {
  params: { postId: number };
}

export default async function Index(context: IndexProps) {
  const { postId } = context.params;

  return <PostDetails postId={postId} />;
}
