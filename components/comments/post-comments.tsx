import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { CommentCollapse } from "./comment-collapse";
import { CommentTree } from "@/types/types";

interface PostCommentsProps {
  postId: number;
}

export async function PostComments({ postId }: PostCommentsProps) {
  const supabase = createServerComponentClient({ cookies });

  async function getComments() {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("root_post", postId);
    if (data) return data;
  }

  async function renderComments(
    comments: CommentTree[],
    parentCommentId: number | null = null,
  ) {
    if (!comments) return;
    const filteredComments = comments.filter(
      (comment) => comment.parent_comment_id === parentCommentId,
    );

    return Promise.all(
      filteredComments.map(async (comment) => (
        <div key={comment.comment_id}>
          <CommentCollapse comment={comment}>
            {await renderComments(comments, comment.comment_id)}
          </CommentCollapse>
          {/* <div>{await renderComments(comments, comment.id)}</div> */}
        </div>
      )),
    );
  }

  const comments = await getComments();

  if (!comments || comments.length === 0) {
    return <div className="pt-2">No comments available.</div>;
  }

  const renderedComments = await renderComments(comments);

  if (renderedComments) return <div className="pt-2">{renderedComments}</div>;
}
