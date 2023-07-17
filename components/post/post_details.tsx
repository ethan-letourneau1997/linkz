import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { EditPost } from "./edit-post";
import { PostVotes } from "./post-votes";
import { CommentTree } from "../comments/comment-tree";

interface PostDetailsProps {
  postId: number;
}

export default async function PostDetails({ postId }: PostDetailsProps) {
  const supabase = createServerComponentClient({ cookies }); // get supabase

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let focusPost;

  let { data: post, error } = await supabase
    .from("post")
    .select("*")
    .match({ id: postId })
    .limit(1)
    .single();
  if (post && post) {
    focusPost = post;
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto ">
        {user && user.id === focusPost.posting_user_id ? (
          <div className="my-5 ">
            <EditPost post={focusPost} />
          </div>
        ) : (
          <div
            className="mt-5 appearance-none rich-text"
            dangerouslySetInnerHTML={{ __html: focusPost.post_content }}
          />
        )}
        <PostVotes postId={focusPost.id} userId={user ? user.id : null} />

        {user && <CommentTree postId={postId} userId={user.id} />}
      </div>
    </div>
  );
}
