import { CreatePost } from "@/components/post/create-post";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { data } from "autoprefixer";
import { cookies } from "next/headers";

interface IndexProps {
  params: {
    communityName: string;
  };
}

export default async function Index({ params }: IndexProps) {
  const communityName = params.communityName; // Extract the communityName from params

  const supabase = createServerComponentClient({ cookies }); // get supabase

  // get community details
  let { data: community, error } = await supabase
    .from("community")
    .select("*")
    .eq("community_name", communityName);

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(communityName);
  if (community && user) {
    return <CreatePost communityId={community[0].id} userId={user.id} />;
  }
}
