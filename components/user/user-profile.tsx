import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchUsername } from "./user.helpers";
import { fetchUser } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserSubscriptions } from "./sections/user-subscriptions";
import { UserPosts } from "./sections/user-posts";
import { UserCreatedCommunities } from "./sections/user-created-communities";
import { UserDetails } from "./sections/user-details";
import { ProfileHeader } from "./sections/profile-header";

export default async function UserProfile() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase);

  if (!user) {
    redirect("/login");
  }

  const username = await fetchUsername({ user: user, supabase: supabase });

  console.log(username);

  return (
    <div className="flex w-screen  flex-col">
      <ProfileHeader username={username} />
      <div className=" md:min-h-fit">
        <Tabs
          id="Profile-tabs"
          defaultValue="posts"
          className="mx-auto min-h-[89.5vh] max-w-[700px] md:mt-4"
        >
          <TabsList className=" sticky top-[64px] h-12 w-full p-0 md:relative md:top-0">
            <TabsTrigger className="h-full w-1/4 sm:text-base" value="posts">
              Posts
            </TabsTrigger>
            <TabsTrigger
              className="h-full w-1/4 sm:text-base"
              value="communities"
            >
              Communities
            </TabsTrigger>
            <TabsTrigger className="h-full w-1/4 sm:text-base" value="admin">
              Admin
            </TabsTrigger>
            <TabsTrigger className="h-full w-1/4 sm:text-base" value="info">
              Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mx-auto mb-3 max-w-[700px] ">
            <UserPosts userProfile={user} />
          </TabsContent>
          <TabsContent
            value="communities"
            className="mx-auto mb-3 max-w-[700px]"
          >
            <UserSubscriptions user={user} />
          </TabsContent>
          <TabsContent value="admin" className="mx-auto mb-3 max-w-[700px] ">
            <UserCreatedCommunities user={user} />
          </TabsContent>
          <TabsContent value="info" className="mx-auto mb-3 max-w-[700px] ">
            <UserDetails user={user} username={username} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
