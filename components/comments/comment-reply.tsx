"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { TextEditor } from "../editor/text-editor";

interface CommentReplyProps {
  userId: string;
  parentId: number | null;
  rootPostId: number;
  // refresh: any;
}

export function CommentReply({
  userId,
  parentId,
  rootPostId,
} // refresh,
: CommentReplyProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [showInput, setShowInput] = useState(false);

  function handleShowInput() {
    setShowInput(!showInput);
  }

  const [replyContent, setReplyContent] = useState("");

  // update post
  const updateReplyContent = (newValue: string) => {
    setReplyContent(newValue);
  };

  async function handlePostReply() {
    const { error } = await supabase
      .from("comment")
      .insert([
        {
          commenting_user_id: userId,
          root_post: rootPostId,
          parent_comment_id: parentId,
          comment_content: replyContent,
        },
      ])
      .select();
    if (error) return;

    // refresh();
    setShowInput(false);
  }

  return (
    <div>
      {showInput && (
        <>
          <TextEditor content={replyContent} updateHTML={updateReplyContent} />
          <button
            className="mb-6 mt-4 border px-3 py-1 hover:bg-white hover:text-black"
            onClick={handlePostReply}
          >
            Post Reply
          </button>
        </>
      )}
      <button
        onClick={handleShowInput}
        className="mb-6 mt-4 border px-3 py-1 hover:bg-white hover:text-black"
      >
        {showInput ? "cancel" : "reply"}
      </button>
    </div>
  );
}
