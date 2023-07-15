"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { TextEditor } from "../editor/text-editor";

interface CommentReplyProps {
  userId: string;
  parentId: number | null;
  rootPostId: number;
  refresh: any;
}

export function CommentReply({
  userId,
  parentId,
  rootPostId,
  refresh,
}: CommentReplyProps) {
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
    const { data, error } = await supabase
      .from("comment")
      .insert([
        {
          user_commenting: userId,
          root_post: rootPostId,
          parent_comment: parentId,
          comment_content: replyContent,
        },
      ])
      .select();

    refresh();
    setShowInput(false);
  }

  return (
    <div>
      {showInput && (
        <>
          <TextEditor content={replyContent} updateHTML={updateReplyContent} />
          <button
            className="px-3 py-1 mt-4 mb-6 border hover:bg-white hover:text-black"
            onClick={handlePostReply}
          >
            Post Reply
          </button>
        </>
      )}
      <button
        onClick={handleShowInput}
        className="px-3 py-1 mt-4 mb-6 border hover:bg-white hover:text-black"
      >
        {showInput ? "cancel" : "reply"}
      </button>
    </div>
  );
}
