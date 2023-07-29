import { getTimeSinceNow } from "@/lib/time_since";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Link from "next/link";
import { AspectRatio } from "../../ui/aspect-ratio";
import { fetchUser } from "@/lib/utils";
import { PostVotes } from "@/components/votes/post-votes";
import { NoUserVotes } from "@/components/votes/no-user-votes";

export async function UserPosts({ userProfile }: { userProfile: User }) {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase);

  async function getUserPosts() {
    if (userProfile) {
      const { data: posts } = await supabase
        .from("user_posts")
        .select("*")
        .eq("posting_user_id", userProfile.id);
      if (posts) return posts;
    }
  }

  const userPosts = await getUserPosts();

  if (userPosts && userPosts.length > 0)
    return (
      <div id="User-posts" className=" text-sm shadow-sm sm:text-base">
        <div className="space-y-2">
          {userPosts?.map((post) => (
            <div className="bg-neutral-50 px-4 py-3" key={post.id}>
              <div>
                <span className="">{post.community_name}</span>
                &nbsp;&#8226;&nbsp;
                <span className="text-sm text-neutral-500">
                  {getTimeSinceNow({
                    originalTime: post.created_at,
                  })}
                </span>
              </div>
              <div className="mt-1 space-y-1" key={post.id}>
                <Link
                  className="mt-4  text-base font-medium text-neutral-900 sm:text-lg"
                  href={`/community/${post.post_title}`}
                >
                  {post.post_title}
                </Link>

                <div className="">
                  {post.is_image ? (
                    <div className="pt-1">
                      <div className="w-36 sm:w-60 lg:hidden lg:w-full">
                        <AspectRatio
                          ratio={16 / 9}
                          className=" block overflow-hidden rounded-sm "
                        >
                          <div
                            className=""
                            dangerouslySetInnerHTML={{
                              __html: post.post_content,
                            }}
                          />
                        </AspectRatio>
                      </div>
                      <div className="hidden lg:block">
                        <AspectRatio
                          ratio={16 / 7}
                          className="  overflow-hidden rounded-sm "
                        >
                          <div
                            className=""
                            dangerouslySetInnerHTML={{
                              __html: post.post_content,
                            }}
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  ) : (
                    <div
                      className=" line-clamp-3 "
                      dangerouslySetInnerHTML={{ __html: post.post_content }}
                    />
                  )}
                </div>
                <div>
                  <div className="mt-1">
                    {user ? (
                      <PostVotes user={user} postId={post.post_id} />
                    ) : (
                      <NoUserVotes type="post" Id={post.post_id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
