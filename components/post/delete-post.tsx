"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface EditPostProps {
  post: {
    id: number;
    post_content: string;
    post_title: string;
    posting_user_id: string;
  };
}

export function DeletePost({ post }: EditPostProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  // delete post
  async function handleDeletePost() {
    const { error } = await supabase.from("post").delete().eq("id", post.id);
    if (error) {
      return;
    }
  }

  return (
    <div>
      <button
        className="mt-6 border border-red-500 px-3 py-1 hover:bg-red-500 hover:text-black"
        onClick={handleDeletePost}
      >
        Delete
      </button>
    </div>
  );
}
