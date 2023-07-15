import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function UserProfile() {
  const supabase = createServerComponentClient({ cookies });

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // users username
  let userName = null;
  let error = null;

  // fetch user profile from database
  if (user) {
    const { data, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id);
    if (data) userName = data[0].user_name;

    error = profileError;
  }

  // communities user has created
  let userCommunities;

  // fetch user created communities from database
  if (user) {
    let { data, error } = await supabase
      .from("community")
      .select("*")
      .eq("created_by", user.id);

    if (data) userCommunities = data;
  }

  // communities user is subscribed to
  let userSubscriptions;

  // fetch user subscriptions from database
  if (user) {
    let { data, error } = await supabase
      .from("profile_community")
      .select("community(id, community_name)")
      .eq("user_id", user.id);

    if (data) userSubscriptions = data;
    if (error) console.log(error);
  }

  // posts user has made
  let userPosts;

  // fetch user posts from database
  if (user) {
    let { data: posts, error } = await supabase
      .from("post")
      .select("*")
      .eq("posted_by", user.id);

    userPosts = posts;
    if (error) console.log(error);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">{userName}'s profile</h1>
      <div className="flex gap-3 mt-5">
        <span>email:</span>
        <span>{user?.email}</span>
      </div>
      <div className="flex gap-3 mt-3">
        <span>ID:</span>
        <span>{user?.id}</span>
      </div>

      <div className="p-5 mt-5 border c border-slate-400">
        <h2 className="underline">Communities Created by {userName}</h2>
        {userCommunities?.map((community) => (
          <div key={community.id}>
            <h4 className="mt-4 mb-1 text-lg font-bold">
              <Link href={`${community.community_name}`}>
                {community.community_name}
              </Link>
            </h4>
            <p>{community.community_description}</p>
          </div>
        ))}
      </div>
      <div className="p-5 mt-5 border c border-slate-400">
        <h2 className="underline">{userName}'s subscriptions</h2>
        {userSubscriptions &&
          userSubscriptions.map((item: any) => (
            <div key={item.community.id}>
              <h4 className="mt-4 mb-1 text-lg font-bold">
                <Link href={`${item.community.community_name}`}>
                  {item.community.community_name}
                </Link>
              </h4>
            </div>
          ))}
      </div>
      <div className="p-5 mt-5 border c border-slate-400">
        <h2 className="underline">{userName}'s posts</h2>
        {userPosts?.map((post) => (
          <div key={post.id}>
            <h4 className="mt-3 mb-3 font-bold">
              <Link
                className="underline"
                href={`/community/${post.posted_in}/post/${post.id}`}
              >
                {post.post_title}
              </Link>
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
