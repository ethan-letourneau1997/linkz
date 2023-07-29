import { NoUserVotes } from "@/components/votes/no-user-votes";
import { getTimeSinceNow } from "@/lib/time_since";
import { UserProfile } from "@/types/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export async function UserComments({
  commentingUser,
}: {
  commentingUser: UserProfile;
}) {
  // const user = await fetchUser(supabase);
  const userComments = await getUserComments();

  async function getUserComments() {
    const supabase = createServerComponentClient({ cookies });

    if (commentingUser) {
      const { data } = await supabase
        .from("user_profile_comment")
        .select("*")
        .eq("commenting_user_id", commentingUser.id);

      if (data) return data;
    }
  }

  if (userComments && commentingUser)
    return (
      <div className=" space-y-2 pt-3 text-sm  shadow-sm sm:text-base">
        {userComments.map((comment) => (
          <div
            className="bg-neutral-50 px-4 py-2 shadow-sm"
            key={comment.comment_id}
          >
            <div>
              <span>{commentingUser.username}</span>
              &nbsp;commented on&nbsp;
              <Link
                href={`/community/${comment.community_name}/post/${comment.post_id}`}
                className="font-medium"
              >
                {comment.post_title}
              </Link>
              &nbsp; &#8226; &nbsp;
              <span className="  text-sm text-neutral-500">
                {getTimeSinceNow({
                  originalTime: comment.created_at,
                  short: false,
                })}
              </span>
            </div>

            <div className="my-2 bg-neutral-200 px-4 py-2">
              <div
                className="rich-text text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: comment.comment_content }}
              />
              <div className="mt-1">
                <NoUserVotes Id={comment.comment_id} type="comment" />
              </div>

              {/* <div className="mt-1">
                {user ? (
                  <CommentVotes
                    userId={user.id}
                    postOrCommentId={comment.comment_id}
                    isComment
                  />
                ) : (
                  <VotesLoggedOut totatVotes={comment.total_user_votes} />
                )}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    );
}
