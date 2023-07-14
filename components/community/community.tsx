import SubscribeBtn from "@/app/community/bite-sized/subscribe-btn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

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
      .select("*, posted_by(*)")
      .eq("posted_in", community[0].id);

    communityPosts = posts;
  }

  console.log(communityPosts);

  return (
    <div>
      {community && (
        <>
          <div className="flex justify-center mt-5">
            <SubscribeBtn userId={user!.id} communityId={community[0].id} />
          </div>
          <div className="flex justify-center my-5">
            <Link
              className="px-3 py-1 border hover:bg-white hover:text-black"
              href={`${community[0].community_name}/post/new/`}
            >
              New post
            </Link>
          </div>
          <h1 className="text-2xl text-center">
            {community[0].community_name}
          </h1>
          <p className="mt-2">{community[0].community_description}</p>

          {communityPosts?.map((post) => (
            <div key={post.id} className="p-2 mt-2 border">
              <h4 className="mb-3 text-lg font-bold ">
                <Link
                  className="underline"
                  href={`${communityName}/post/${post.id}`}
                >
                  {post.post_title}
                </Link>
              </h4>
              <div dangerouslySetInnerHTML={{ __html: post.post_content }} />
              <div className="italic font-light ">
                -{post.posted_by.user_name}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
