import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProfileHeader } from "../sections/profile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { UserPosts } from "../sections/user-posts";

import { UserComments } from "../sections/user-comments";

export async function PublicProfile({ username }: { username: string }) {
  const supabase = createServerComponentClient({ cookies });

  async function fetchUserProfile() {
    const { data } = await supabase
      .from("user_profile")
      .select("*")
      .match({ username: username })
      .limit(1)
      .single();
    if (data) return data;
  }

  const userProfile = await fetchUserProfile();

  if (userProfile)
    return (
      <div className="flex w-screen  flex-col">
        <ProfileHeader username={username} />
        <div className=" md:min-h-fit">
          <Tabs
            id="Profile-tabs"
            defaultValue="posts"
            className="mx-auto min-h-[89.5vh] max-w-[800px] md:mt-4"
          >
            <TabsList className=" sticky top-[64px] h-12 w-full p-0 md:relative md:top-0">
              <TabsTrigger className="h-full w-1/2 sm:text-base" value="posts">
                Posts
              </TabsTrigger>
              <TabsTrigger
                className="h-full w-1/2 sm:text-base"
                value="comments"
              >
                Comments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mx-auto mb-3 max-w-[800px] ">
              {/* <SortPosts userProfile={userProfile} /> */}
              <UserPosts userProfile={userProfile} />
            </TabsContent>

            <TabsContent
              value="comments"
              className="mx-auto mb-3 max-w-[800px] "
            >
              <UserComments commentingUser={userProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
}
