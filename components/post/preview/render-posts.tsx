import { post_preview } from "@/types/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { PostPreview } from "./post-preview";
import { Suspense } from "react";

export function RenderPosts({
  posts,
  user,
}: {
  posts: post_preview[];
  user: User | null;
}) {
  return (
    <div className="space-y-3">
      {posts &&
        posts.map((post) => (
          <div key={post.post_id}>
            {/* {post.post_title} */}
            <Suspense fallback={<div>Loading...</div>}>
              <PostPreview user={user} post={post} />
            </Suspense>
          </div>
        ))}
    </div>
  );
}
