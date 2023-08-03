import { fetchUser } from "@/lib/utils";
import { FriendsList } from "../../components/social/friends-list";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase);

  async function getFriends() {
    if (user) {
      const { data: friends } = await supabase
        .from("user_friends")
        .select()
        .eq("user_id", user.id);
      return friends;
    }
  }

  const friends = await getFriends();

  return (
    <div className="w-full bg-neutral-50 pb-14">
      {friends && <FriendsList friends={friends} />}
      {children}
    </div>
  );
}
