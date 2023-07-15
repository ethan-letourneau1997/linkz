"use client";

import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TextEditor } from "../editor/text-editor";
import { DeletePost } from "./delete-post";

interface EditPostProps {
  post: {
    id: number;
    post_content: string;
    post_title: string;
    posted_by: string;
  };
}

export function EditPost({ post }: EditPostProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [editMode, setEditMode] = useState(false);
  const [postContent, updatePostContent] = useState(post.post_content);

  // update post  post
  async function handleUpdatePost() {
    const { data, error } = await supabase
      .from("post")
      .update({ post_content: postContent })
      .eq("id", post.id)
      .select();

    console.log(data);
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
      <h1 className="text-2xl font-semibold text-centerx">{post.post_title}</h1>
      {editMode ? (
        <>
          <TextEditor content={postContent} updateHTML={updatePostContent} />
          <button
            className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
            onClick={handlePostSave}
          >
            save
          </button>
          <button
            className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
            onClick={handleCancelEdit}
          >
            cancel
          </button>
          <DeletePost post={post} />
        </>
      ) : (
        <>
          <div
            className="mt-5 appearance-none rich-text"
            dangerouslySetInnerHTML={{ __html: post.post_content }}
          />
          <button
            className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
            onClick={handlePostEdit}
          >
            edit
          </button>
        </>
      )}
    </div>
  );
}
