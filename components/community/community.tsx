import SubscribeBtn from "@/app/community/bite-sized/subscribe-btn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchUser } from "@/lib/utils";
import { Input } from "../ui/input";
import { Suspense } from "react";
import { Community } from "@/types/types";
import { RenderPosts } from "../post/preview/render-posts";

interface CommunityProps {
  communityName: string;
}

export default async function Community({ communityName }: CommunityProps) {
  const supabase = createServerComponentClient({ cookies });

  async function getCommunityDetails(communityName: string) {
    const { data: community } = await supabase
      .from("community_details")
      .select("*")
      .eq("community_name", communityName)
      .limit(1)
      .single();
    return community;
  }

  async function getCommunityPosts() {
    const { data: posts } = await supabase
      .from("post_preview")
      .select("*")
      .eq("community_id", community.id)
      .order("post_id", { ascending: false });
    if (posts) {
      return posts;
    }
  }

  const user = await fetchUser(supabase); // get user
  const community = await getCommunityDetails(communityName);
  const communityPosts = await getCommunityPosts();

  if (!communityPosts) {
    return <div>no posts</div>;
  }

  return (
    <div>
      <div className="w-screen bg-neutral-800 px-3 py-4">
        <Suspense fallback={<div>loading</div>}>
          <span className=" text-neutral-200">
            <div className="mx-auto mb-4 max-w-[700px] px-3 ">
              <div className="flex justify-between ">
                <h1 className="text-3xl font-semibold">
                  {community.community_name}
                </h1>
                {user && community ? (
                  <SubscribeBtn userId={user.id} communityId={community.id} />
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2">
                {community.community_description}
              </p>
            </div>
          </span>
        </Suspense>
      </div>
      <div className="mx-auto max-w-[700px] md:pt-4">
        <Input placeholder="new post" />
        <div className="  mt-3 space-y-3 shadow-sm">
          <Suspense fallback={<div>loading</div>}>
            <RenderPosts user={user} posts={communityPosts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
