"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CommentReply } from "./comment-reply";
import { CommentVotes } from "./comment-vote";
import { getTimeSinceNow } from "@/lib/time_since";

interface CommentTreeProps {
  postId: number;
  userId: string;
}

interface Comment {
  id: number;
  created_at: string;
  root_post: number;
  comment_content: string;
  parent_comment_id: number | null;
  commenting_user_id: {
    username: string;
    id: string;
  };
}

export function CommentTree({ postId, userId }: CommentTreeProps) {
  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

  const [comments, setComments] = useState<Comment[]>([]);

  // refresh comments on reply
  const [refresh, setRefresh] = useState(0);

  // get username
  const [username, setUsername] = useState();

  useEffect(() => {
    async function getUsername() {
      let { data: user_profile, error } = await supabase
        .from("user_profile")
        .select("username")
        .eq("id", userId)
        .limit(1)
        .single();

      if (user_profile) setUsername(user_profile.username);
    }
    getUsername();
  });

  const treeRefresh = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    async function getComments() {
      const { data, error } = await supabase
        .from("comment")
        .select("*, commenting_user_id(id, username)")
        .eq("root_post", postId);
      if (data) setComments(data);
    }

    getComments();
  }, [refresh]);

  const renderComment = (comment: Comment) => {
    const childComments = comments.filter(
      (c) => c.parent_comment_id === comment.id
    );

    return (
      <div key={comment.id} className="p-3 border">
        - {comment.commenting_user_id.username} -{" "}
        {getTimeSinceNow(comment.created_at)}
        <div dangerouslySetInnerHTML={{ __html: comment.comment_content }} />
        <CommentVotes commentId={comment.id} userId={userId} />
        {username && (
          <CommentReply
            refresh={treeRefresh}
            userId={userId}
            parentId={comment.id}
            rootPostId={comment.root_post}
          />
        )}
        {childComments.map(renderComment)}
      </div>
    );
  };

  const rootComments = comments.filter(
    (comment) => comment.parent_comment_id === null
  );

  return (
    <div>
      {username && (
        <CommentReply
          refresh={treeRefresh}
          userId={userId}
          parentId={null}
          rootPostId={postId}
        />
      )}
      <div className="text-lg font-semibold">Comments</div>
      {rootComments.map(renderComment)}
    </div>
  );
}
