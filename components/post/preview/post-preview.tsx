import { NoUserVotes } from "@/components/votes/no-user-votes";
import { PostVotes } from "@/components/votes/post-votes";
import { getTimeSinceNow } from "@/lib/time_since";
import { post_preview } from "@/types/types";
import { User } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { GoComment } from "react-icons/go";

export function PostPreview({
  post,
  user,
}: {
  post: post_preview;
  user: User | null;
}) {
  if (post)
    return (
      <div className="rounded-sm bg-neutral-50 px-4 py-4 shadow-sm">
        <div className="flex justify-between">
          <div className=" text-xs font-normal text-neutral-600 ">
            <div className="hidden md:inline">posted by&nbsp;</div>
            <Link
              href={`/user/profile/${post.posting_username}`}
              className="underline md:font-semibold"
            >
              {post.posting_username}
            </Link>
            &nbsp;
            <span className="hidden md:inline">
              {post.created_at &&
                getTimeSinceNow({
                  originalTime: post.created_at,
                  short: false,
                })}
            </span>
            <span className="md:hidden ">
              {post.created_at &&
                getTimeSinceNow({
                  originalTime: post.created_at,
                  short: true,
                })}
            </span>
          </div>
        </div>
        <Link
          className="mt-1 text-base font-medium sm:text-lg lg:text-lg"
          href={`${post.post_community}/post/${post.post_id}`}
        >
          {post.post_title}
        </Link>
        {post.is_image ? (
          <div
            className="mt-1 "
            dangerouslySetInnerHTML={{ __html: post.post_content! }}
          />
        ) : (
          <div
            className="mt-1 line-clamp-3 text-neutral-700"
            dangerouslySetInnerHTML={{ __html: post.post_content! }}
          />
        )}
        <div className="mt-2 flex gap-4">
          <div>
            {user ? (
              <PostVotes user={user} postId={post.post_id!} />
            ) : (
              <NoUserVotes type="post" Id={post.post_id!} />
            )}
          </div>
          <div className=" flex gap-1">
            <GoComment className=" mt-[3px]" />{" "}
            <span className="text-sm">{post.comment_count}&nbsp;comments</span>
          </div>
        </div>
      </div>
    );
}
