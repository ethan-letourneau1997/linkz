import SubscribeBtn from "@/app/community/bite-sized/subscribe-btn";
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { getTimeSinceNow } from "@/lib/time_since";

import { fetchUser } from "@/lib/utils";
import { Input } from "../ui/input";
import { GoComment } from "react-icons/go";

import { Suspense } from "react";

import { PostVotes } from "../votes/post-votes";
import { NoUserVotes } from "../votes/no-user-votes";
import { Community } from "@/types/types";
import { CommunityPosts } from "../../types/types";

async function renderCommunityInfo({
  community,
  subscribeButton,
}: {
  community: Community;
  subscribeButton: JSX.Element;
}) {
  if (community)
    return (
      <div className="mx-auto mb-4 max-w-[800px] px-3 ">
        <div className="flex justify-between ">
          <h1 className="text-3xl font-semibold">{community.community_name}</h1>
          {subscribeButton}
        </div>
        <p className="mt-2 line-clamp-2">{community.community_description}</p>
      </div>
    );
}

// return comments;
async function getCommentCount(postId: number) {
  const supabase = createServerComponentClient({ cookies }); // get supabase
  if (postId) {
    const { data: comments } = await supabase
      .from("comment")
      .select("*")
      .eq("root_post", postId);

    if (comments) return comments.length;
  }
}

export async function PostPreview({
  post,
  user,
}: {
  post: CommunityPosts;
  user: User | null;
}) {
  if (post && post.post_id) {
    const commentCount = await getCommentCount(post.post_id);
    return (
      <div key={post.post_id} className="bg-neutral-50 px-4 py-4">
        <div>
          <div className="flex justify-between">
            <div className=" text-xs font-normal text-neutral-600 ">
              <div className="hidden md:inline">posted by&nbsp;</div>
              <Link
                href={`/user/profile/${post.username}`}
                className="underline md:font-semibold"
              >
                {post.username}
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
          <h2 className=" mt-1 text-base font-bold sm:text-lg lg:text-lg">
            <Link
              className=""
              href={`${post.community_name}/post/${post.post_id}`}
            >
              {post.post_title}
            </Link>
          </h2>

          <div>
            {post.is_image ? (
              // <AspectRatio ratio={16 / 9} className="mt-2  overflow-hidden">
              <Suspense fallback={<div>loading</div>}>
                <div className="max-h-[50vh] w-full overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.post_content!,
                    }}
                  />
                </div>
              </Suspense>
            ) : (
              // </AspectRatio>
              <div
                className="mt-1 line-clamp-3 text-sm"
                dangerouslySetInnerHTML={{ __html: post.post_content! }}
              />
            )}
          </div>
        </div>
        <div className="mt-2 flex gap-4">
          <div className="mt-1">
            {user ? (
              <PostVotes user={user} postId={post.post_id} />
            ) : (
              <NoUserVotes type="post" Id={post.post_id} />
            )}
          </div>
          <div className=" flex gap-1">
            <GoComment className=" mt-[3px]" />{" "}
            <span className="text-sm">{commentCount}&nbsp;comments</span>
          </div>
        </div>
      </div>
    );
  }
}

export default async function Community({
  communityName,
}: {
  communityName: string;
}) {
  const supabase = createServerComponentClient({ cookies }); // get supabase

  async function getCommunityDetails(communityName: string) {
    const { data: community } = await supabase
      .from("community")
      .select("*")
      .eq("community_name", communityName)
      .limit(1)
      .single();

    return community;
  }

  async function getCommunityPosts() {
    let { data: posts } = await supabase
      .from("community_posts")
      .select("*")
      .eq("community_id", community.id)
      .order("post_id", { ascending: false });
    if (posts) {
      // Add the communityName property to each post object
      posts = posts.map((post) => ({
        ...post,
        communityName: communityName,
      }));
      return posts;
    }
  }

  async function renderPosts() {
    if (communityPosts)
      return communityPosts.map((post) => (
        <Suspense key={post.post_id} fallback={<div>loading</div>}>
          <PostPreview post={post} user={user || null} />
        </Suspense>
      ));
  }

  const user = await fetchUser(supabase); // get user

  const community = await getCommunityDetails(communityName);

  const communityPosts = await getCommunityPosts();

  const subscribeButton =
    user && community ? (
      <SubscribeBtn userId={user.id} communityId={community.id} />
    ) : null;

  const communityDetails = await renderCommunityInfo({
    community: community,
    subscribeButton: subscribeButton!,
  });

  if (!communityPosts) {
    return <div>no posts</div>;
  }
  const renderCommunityPosts = await renderPosts();

  return (
    <div>
      <div className="w-screen bg-neutral-800 px-3 py-4">
        <Suspense fallback={<div>loading</div>}>
          <span className=" text-neutral-200">{communityDetails}</span>
        </Suspense>
      </div>
      <div className="mx-auto max-w-[800px] md:pt-4">
        <Input placeholder="new post" />
        <div className="  mt-3 space-y-3 shadow-sm">
          <Suspense fallback={<div>loading</div>}>
            {renderCommunityPosts}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
