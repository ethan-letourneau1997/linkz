import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BiSolidMessage } from "react-icons/bi";
import {
  fetchUsername,
  fetchCreatedCommunities,
  fetchUserSubscriptions,
  fetchUserPosts,
} from "./user.helpers";
import {
  UserDetailsProps,
  UserCommunityProps,
  UserPostsProps,
} from "./user.type";
import { fetchUser } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getTimeSinceNow } from "@/lib/time_since";
import { Button } from "../ui/button";
import PostSpoiler from "../post/post-spoiler";
import { AspectRatio } from "../ui/aspect-ratio";

async function formatDate(date: string) {
  if (date) {
    const createdAt = new Date(date);
    const formattedDate = createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  }
}

export default async function UserProfile() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const username = await fetchUsername({ user: user, supabase: supabase });

  const userCommunities = await fetchCreatedCommunities({
    user: user,
    supabase: supabase,
  });

  const userSubscriptions = await fetchUserSubscriptions({
    user: user,
    supabase: supabase,
  });

  const userPosts = await fetchUserPosts({ user: user, supabase: supabase });

  const userSince = await formatDate(user.created_at);

  return (
    <div className="flex w-screen  flex-col">
      <div className="-z-20 bg-neutral-800  py-10">
        <div className="mx-auto flex max-w-[800px] items-end gap-3 px-10 md:px-5">
          <Avatar>
            <AvatarImage
              // src="https://github.com/shadcn.png"
              src=""
            />
            <AvatarFallback className=" bg-teal-500">CN</AvatarFallback>
          </Avatar>

          <span className="h-fit text-2xl font-bold tracking-wide text-neutral-50">
            {username}
          </span>
        </div>
      </div>
      <div className=" md:min-h-fit">
        <Tabs
          id="Profile-tabs"
          defaultValue="posts"
          className="mx-auto min-h-[89.5vh] max-w-[800px] md:mt-4"
        >
          <TabsList className=" sticky top-[64px] h-12 w-full p-0 md:relative md:top-0">
            <TabsTrigger className="h-full w-1/4 sm:text-base" value="posts">
              Posts
            </TabsTrigger>
            <TabsTrigger
              className="h-full w-1/4 sm:text-base"
              value="communities"
            >
              Communities
            </TabsTrigger>
            <TabsTrigger className="h-full w-1/4 sm:text-base" value="admin">
              Admin
            </TabsTrigger>
            <TabsTrigger className="h-full w-1/4 sm:text-base" value="info">
              Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mx-auto mb-3 max-w-[800px] ">
            <UserPosts userPosts={userPosts} />
          </TabsContent>
          <TabsContent
            value="communities"
            className="mx-auto mb-3 max-w-[800px]"
          >
            <UserSubscriptions userSubscriptions={userSubscriptions} />
          </TabsContent>
          <TabsContent value="admin" className="mx-auto mb-3 max-w-[800px] ">
            <UserCreatedCommunities userCommunities={userCommunities} />
          </TabsContent>
          <TabsContent value="info" className="mx-auto mb-3 max-w-[800px] ">
            <UserDetails user={user} username={username} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

async function UserDetails({ username, user }: UserDetailsProps) {
  return (
    <div className="bg-neutral-50 pb-4 pt-3 text-sm shadow-sm sm:text-base">
      <h2 className="px-4 text-lg font-medium sm:text-xl">
        Profile Information
      </h2>

      <div className="mt-4 flex justify-between gap-3 px-4">
        <span className="font-medium text-neutral-600">Username:</span>
        <span className="text-neutral-600">{username}</span>
      </div>
      <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
      <div className="flex justify-between gap-3 px-4">
        <span className="min-w-fit font-medium text-neutral-600">
          User Since:
        </span>
        <span className="text-neutral-600">{formatDate(user.created_at)}</span>
      </div>
      <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
      <div className="flex justify-between gap-3 px-4">
        <span className="font-medium text-neutral-600">Email:</span>
        <span className="text-neutral-600">{user?.email}</span>
      </div>
    </div>
  );
}

async function UserSubscriptions({ userSubscriptions }: any) {
  if (userSubscriptions && userSubscriptions.length > 0)
    return (
      <div className="bg-neutral-50 pt-3 text-sm shadow-sm sm:text-base">
        <h2 className="px-4 pb-3 text-lg font-medium sm:text-xl">
          Subscriptions
        </h2>
        {userSubscriptions.map((item: any) => (
          <>
            <div className="space-y-1 px-4" key={item.community.id}>
              <Link
                className="mb-1 mt-4 text-base font-medium text-neutral-700 sm:text-lg"
                href={`/community/${item.community.community_name}`}
              >
                {item.community.community_name}
              </Link>

              <p className="line-clamp-1 text-sm text-neutral-600 sm:text-base">
                {item.community.community_description}
              </p>
            </div>
            <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
          </>
        ))}
      </div>
    );
}

async function UserPosts({ userPosts }: UserPostsProps) {
  if (userPosts && userPosts.length > 0)
    return (
      <div id="User-posts" className=" text-sm shadow-sm sm:text-base">
        <div className="space-y-2">
          {userPosts?.map((post) => (
            <div className="bg-neutral-50 px-4 py-3">
              <span className=" = text-neutral-600">
                {post.community_id.community_name}
              </span>

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

                {/* <div
                  className={`overflow-hidden ${
                    post.is_image === null ? "max-h-40" : "max-h-40"
                  }`}
                  dangerouslySetInnerHTML={{ __html: post.post_content }}
                /> */}
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

                {/* <PostSpoiler content={post.post_content} /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

async function UserCreatedCommunities({ userCommunities }: UserCommunityProps) {
  if (userCommunities && userCommunities.length > 0) {
    return (
      <div className="bg-neutral-50 pt-3 text-sm shadow-sm  sm:text-base">
        <h2 className="px-4 pb-3 text-lg font-medium sm:text-xl">
          Created Communities
        </h2>
        {userCommunities.map((community) => (
          <>
            <div className="space-y-1 px-4" key={community.id}>
              <Link
                className="text-base font-medium text-neutral-700 sm:text-lg"
                href={`/community/${community.community_name}`}
              >
                {community.community_name}
              </Link>
              <p className=" text-neutral-600">
                {community.community_description}
              </p>
            </div>
            <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
          </>
        ))}
      </div>
    );
  }
}
