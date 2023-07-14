"use client";

import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TextEditor } from "../Editor/text-editor";

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
      <p>{editMode ? "goodbye" : "hello"} edit.</p>

      {/* <button
        className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
        onClick={handleToggleEdit}
      >
        {editMode ? "save" : "edit"}
      </button> */}

      {editMode ? (
        <>
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
        </>
      ) : (
        <button
          className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
          onClick={handlePostEdit}
        >
          edit
        </button>
      )}
      {editMode && (
        <TextEditor content={postContent} updateHTML={updatePostContent} />
      )}
    </div>
  );
}
