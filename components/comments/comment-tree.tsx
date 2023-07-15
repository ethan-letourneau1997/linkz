"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CommentReply } from "./comment-reply";
import { CommentVotes } from "./comment-vote";

interface CommentTreeProps {
  postId: number;
  userId: string;
}

interface Comment {
  id: number;
  created_at: string;
  root_post: number;
  comment_content: string;
  parent_comment: number | null;
  user_commenting: string;
}

export function CommentTree({ postId, userId }: CommentTreeProps) {
  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

  const [comments, setComments] = useState<Comment[]>([]);

  // refresh comments on reply
  const [refresh, setRefresh] = useState(0);

  const incrementRefresh = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    async function getComments() {
      const { data, error } = await supabase
        .from("comment")
        .select("*")
        .eq("root_post", postId);
      if (data) setComments(data);
    }

    getComments();
  }, [refresh]);

  const renderComment = (comment: Comment) => {
    const childComments = comments.filter(
      (c) => c.parent_comment === comment.id
    );

    return (
      <div key={comment.id} className="p-3 border">
        <div dangerouslySetInnerHTML={{ __html: comment.comment_content }} />

        <CommentVotes commentId={comment.id} userId={userId} />
        <CommentReply
          incrementRefresh={incrementRefresh}
          userId={comment.user_commenting}
          parentId={comment.id}
          rootPostId={comment.root_post}
        />
        {childComments.map(renderComment)}
      </div>
    );
  };

  const rootComments = comments.filter(
    (comment) => comment.parent_comment === null
  );

  return (
    <div>
      <div className="text-lg font-semibold">Comments</div>
      {rootComments.map(renderComment)}
    </div>
  );
}
