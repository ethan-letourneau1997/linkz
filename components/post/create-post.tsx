"use client";

import { SetStateAction, useState } from "react";
import { TextEditor } from "../editor/text-editor";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CreatePostProps {
  communityId: string;
  userId: string;
}

export function CreatePost({ communityId, userId }: CreatePostProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [postContent, updatePostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");

  // update post
  const updateParentState = (newValue: string) => {
    updatePostContent(newValue);
  };

  // handle post title change
  const handlePostTitleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPostTitle(event.target.value);
  };

  // create a new post
  async function handleCreatePost() {
    const { data, error } = await supabase
      .from("post")
      .insert([
        {
          posting_user_id: userId,
          community_id: communityId,
          post_title: postTitle,
          post_content: postContent,
        },
      ])
      .select();
  }

  return (
    <div>
      <p>hello create post.</p>
      <div className="pt-5 mb-4">
        <label className="block mb-2" htmlFor="name">
          Title
        </label>
        <input
          className="text-black"
          id="name"
          type="text"
          value={postTitle}
          onChange={handlePostTitleChange}
        />
      </div>
      <TextEditor content={postContent} updateHTML={updateParentState} />

      <button
        className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
        onClick={handleCreatePost}
        // onClick={handleCreatePost}
      >
        Create
      </button>
    </div>
  );
}
