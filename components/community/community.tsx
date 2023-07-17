import SubscribeBtn from "@/app/community/bite-sized/subscribe-btn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { GetVoteCount } from "../post/get-vote-count";
import { getTimeSinceNow } from "@/lib/time_since";

interface CommunityProps {
  communityName: string;
}

export default async function Community({ communityName }: CommunityProps) {
  const supabase = createServerComponentClient({ cookies }); // get supabase

  // get community details
  let { data: community } = await supabase
    .from("community")
    .select("*")
    .eq("community_name", communityName);

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let communityPosts;

  // get community posts
  if (community) {
    let { data: posts, error } = await supabase
      .from("post")
      .select("*, posting_user_id(*)")
      .eq("community_id", community[0].id)
      .order("id", { ascending: false });

    communityPosts = posts;
  }

  if (community)
    return (
      <div>
        <div className="flex ">
          <h1 className="w-full text-3xl font-semibold">
            {community[0].community_name}
          </h1>
          <div className="my-auto ">
            <SubscribeBtn userId={user!.id} communityId={community[0].id} />
          </div>
        </div>
        <p className="mt-4 line-clamp-2">
          {community[0].community_description}
        </p>
        <div className="mt-5 ">
          <div>
            <div className="my-5">
              <Link
                className="px-3 py-1 border hover:bg-white hover:text-black"
                href={`${community[0].community_name}/post/new/`}
              >
                New post
              </Link>
            </div>

            <div className="w-full ">
              <img
                className="h-auto max-w-full"
                src="https://imgur.com/YFqYFQT"
                alt="image description"
              />
            </div>

            {communityPosts?.map((post) => (
              <div key={post.id} className="p-2 mt-2 ">
                <div className="flex">
                  <h2 className="mb-3 text-lg font-bold ">
                    <Link
                      className="underline"
                      href={`${communityName}/post/${post.id}`}
                    >
                      {post.post_title}
                    </Link>
                    <span className="text-base font-light">
                      &nbsp;&nbsp; votes:{" "}
                      <GetVoteCount
                        postId={post.id}
                        vote_table="user_post_vote"
                      />
                    </span>
                    <span className="text-sm font-semibold ">
                      &nbsp;&nbsp; {getTimeSinceNow(post.created_at)}
                    </span>
                  </h2>
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.post_content }} />
                <div className="italic font-light ">
                  -{post.posting_user_id.username}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
