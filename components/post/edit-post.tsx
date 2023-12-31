"use client";

import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TextEditor } from "../editor/text-editor";
import { DeletePost } from "./delete-post";
import { Post } from "@/types/types";

interface EditPostProps {
  post: Post;
}

export function EditPost({ post }: EditPostProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [editMode, setEditMode] = useState(false);
  const [postContent, updatePostContent] = useState(post.post_content);

  // update post  post
  async function handleUpdatePost() {
    const { error } = await supabase
      .from("post")
      .update({ post_content: postContent })
      .eq("id", post.id)
      .select();
    if (error) {
      return;
    }
  }

  // save post
  function handlePostSave() {
    setEditMode(false);
    handleUpdatePost();
  }

  // switch to postedit
  function handlePostEdit() {
    setEditMode(true);
  }

  // cancel edit mode without saving
  function handleCancelEdit() {
    setEditMode(false);
  }

  return (
    <div>
      <h1 className="text-centerx text-lg font-semibold">{post.post_title}</h1>
      {editMode ? (
        <>
          <TextEditor content={postContent} updateHTML={updatePostContent} />
          <button
            className="mt-6 border px-3 py-1 hover:bg-white hover:text-black"
            onClick={handlePostSave}
          >
            save
          </button>
          <button
            className="mt-6 border px-3 py-1 hover:bg-white hover:text-black"
            onClick={handleCancelEdit}
          >
            cancel
          </button>
          <DeletePost post={post} />
        </>
      ) : (
        <>
          <div
            className="rich-text mt-5 appearance-none"
            dangerouslySetInnerHTML={{ __html: post.post_content }}
          />
          {!post.is_image && (
            <button
              className="mt-6 border px-3 py-1 hover:bg-white hover:text-black"
              onClick={handlePostEdit}
            >
              edit
            </button>
          )}
        </>
      )}
    </div>
  );
}
