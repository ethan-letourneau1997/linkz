import SubscribeBtn from "@/app/community/bite-sized/subscribe-btn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchUser } from "@/lib/utils";
import { Input } from "../ui/input";
import { Suspense } from "react";
import { Community } from "@/types/types";
import { RenderPosts } from "../post/preview/render-posts";

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
      .from("post_preview")
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
    if (communityPosts) {
      return <RenderPosts user={user} posts={communityPosts} />;
    }
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
