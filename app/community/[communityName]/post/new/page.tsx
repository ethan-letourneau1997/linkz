import { CreatePost } from "@/components/create/create-post";
import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";

export interface CommunityIndexProps {
  params: {
    communityName: string;
  };
}

export default async function Index({ params }: CommunityIndexProps) {
  const communityName = params.communityName; // Extract the communityName from params

  const supabase = createServerComponentClient({ cookies }); // get supabase

  // get community details
  const { data: community } = await supabase
    .from("community")
    .select("*")
    .eq("community_name", communityName);

  const user = await fetchUser(supabase); // get user

  if (community && user) {
    return <CreatePost communityId={community[0].id} userId={user.id} />;
  }
}
