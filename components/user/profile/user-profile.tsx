import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProfileHeader } from "../sections/profile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { UserPosts } from "../sections/user-posts";

import { UserComments } from "../sections/user-comments";
import { fetchUser } from "@/lib/utils";
import { UserCreatedCommunities } from "../sections/user-created-communities";
import { UserDetails } from "../sections/user-details";

export async function UserProfile({ username }: { username: string }) {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase); // get user

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

  const tabCount =
    user && userProfile && userProfile.id === user.id ? "4" : "2";

  if (userProfile)
    return (
      <div className="flex w-screen  flex-col">
        <ProfileHeader userProfile={userProfile} />
        <div className=" md:min-h-fit">
          <Tabs
            id="Profile-tabs"
            defaultValue="posts"
            className="mx-auto min-h-[89.5vh] w-full max-w-2xl md:mt-4"
          >
            <TabsList className=" sticky top-[64px] z-40 h-12 w-full p-0 md:relative md:top-0">
              <TabsTrigger
                className={`h-full w-1/${tabCount} sm:text-base`}
                value="posts"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                className={`h-full w-1/${tabCount} sm:text-base`}
                value="comments"
              >
                Comments
              </TabsTrigger>
              {user && userProfile.id === user.id && (
                <>
                  <TabsTrigger
                    className={`h-full w-1/${tabCount} sm:text-base`}
                    value="admin"
                  >
                    Admin
                  </TabsTrigger>
                  <TabsTrigger
                    className={`h-full w-1/${tabCount} sm:text-base`}
                    value="info"
                  >
                    Info
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            <TabsContent value="posts" className="mx-auto mb-3 max-w-2xl ">
              {/* <SortPosts userProfile={userProfile} /> */}
              <UserPosts userProfile={userProfile} />
            </TabsContent>
            <TabsContent value="comments" className="mx-auto mb-3 max-w-2xl ">
              <UserComments commentingUser={userProfile} />
            </TabsContent>
            {user && userProfile.id === user.id && (
              <>
                <TabsContent value="admin" className="mx-auto mb-3 max-w-2xl ">
                  <UserCreatedCommunities user={user} />
                </TabsContent>
                <TabsContent
                  value="info"
                  className="mx-auto mb-3 w-full max-w-2xl "
                >
                  <UserDetails user={user} username={username} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    );
}
