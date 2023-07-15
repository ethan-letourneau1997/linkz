"use client";

import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TextEditor } from "../editor/text-editor";

interface EditPostProps {
  post: {
    id: number;
    post_content: string;
    post_title: string;
    posted_by: string;
  };
}

export function DeletePost({ post }: EditPostProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [editMode, setEditMode] = useState(false);

  // delete post
  async function handleDeletePost() {
    const { error } = await supabase.from("post").delete().eq("id", post.id);
  }

  return (
    <div>
      <button
        className="px-3 py-1 mt-6 border border-red-500 hover:bg-red-500 hover:text-black"
        onClick={handleDeletePost}
      >
        Delete
      </button>
    </div>
  );
}
