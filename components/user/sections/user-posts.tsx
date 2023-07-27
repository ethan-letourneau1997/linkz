import { getTimeSinceNow } from "@/lib/time_since";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Link from "next/link";
import { AspectRatio } from "../../ui/aspect-ratio";

async function getUserPosts(user: User) {
  const supabase = createServerComponentClient({ cookies });
  if (user) {
    const { data: posts } = await supabase
      .from("user_posts")
      .select("*")
      .eq("posting_user_id", user.id);
    if (posts) return posts;
  }
}

export async function UserPosts({ user }: { user: User }) {
  const userPosts = await getUserPosts(user);

  if (userPosts && userPosts.length > 0)
    return (
      <div id="User-posts" className=" text-sm shadow-sm sm:text-base">
        <div className="space-y-2">
          {userPosts?.map((post) => (
            <div className="bg-neutral-50 px-4 py-3" key={post.id}>
              <span className=" = text-neutral-600">{post.community_name}</span>

              <span className="= ml-2 text-neutral-500">
                {getTimeSinceNow({
                  originalTime: post.created_at,
                  short: true,
                })}
              </span>

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
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
