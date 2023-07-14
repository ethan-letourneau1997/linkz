import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { EditPost } from "./edit-post";

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
    .eq("id", postId);
  if (post && post[0]) {
    focusPost = post[0];
  }

  return (
    <div>
      <h1 className="text-xl">{focusPost.post_title}</h1>

      <div
        className="mt-5 appearance-none rich-text"
        dangerouslySetInnerHTML={{ __html: focusPost.post_content }}
      />
      {user && user.id === focusPost.posted_by && (
        <div className="my-5">
          <EditPost post={focusPost} />
        </div>
      )}
    </div>
  );
}
