import { getTimeSinceNow } from "@/lib/time_since";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BiChevronUpCircle, BiChevronDownCircle } from "react-icons/bi";
import { VoteCount } from "../post/vote-count";
import { Comment } from "./comment";
import { CommentCollapse } from "./comment-collapse";

interface PostCommentsProps {
  postId: number;
}

export async function PostComments({ postId }: PostCommentsProps) {
  const supabase = createServerComponentClient({ cookies });

  async function getComments() {
    const { data, error } = await supabase
      .from("comment")
      .select("*, commenting_user_id(id, username)")
      .eq("root_post", postId);

    if (data) return data;
  }

  async function renderComments(
    comments: any[] | null,
    parentCommentId = null,
  ) {
    if (!comments) return;
    const filteredComments = comments.filter(
      (comment) => comment.parent_comment_id === parentCommentId,
    );

    return Promise.all(
      filteredComments.map(async (comment) => (
        <div key={comment.id}>
          <CommentCollapse
            comment={comment}
            children={await renderComments(comments, comment.id)}
          />
          {/* <div>{await renderComments(comments, comment.id)}</div> */}
        </div>
      )),
    );
  }

  const comments = await getComments();
  const renderedComments = await renderComments(comments || null);

  if (renderedComments) return <div className="pt-2">{renderedComments}</div>;
}

interface CommentHeaderProps {
  comment: any;
}

async function CommentHeader({ comment }: CommentHeaderProps) {
  if (comment)
    return (
      <div className="flex justify-between">
        <div className=" text-xs font-normal text-neutral-600 ">
          <div className="hidden md:inline">posted by&nbsp;</div>
          <span className="underline md:font-semibold">
            {comment.commenting_user_id.username}
          </span>
          &nbsp;
          <span className="hidden md:inline">
            {getTimeSinceNow({
              originalTime: comment.created_at,
              short: false,
            })}
          </span>
          <span className="md:hidden ">
            {getTimeSinceNow({
              originalTime: comment.created_at,
              short: true,
            })}
          </span>
        </div>
      </div>
    );
}
