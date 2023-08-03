import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FaUserFriends } from "react-icons/fa";
import { isoToString } from "../../lib/iso-to-string";
import { Button } from "../ui/button";

interface FriendSettingsProps {
  friendUsername: string;
}

export async function FriendSettings({ friendUsername }: FriendSettingsProps) {
  const supabase = createServerComponentClient({ cookies });

  async function getUserId() {
    const { data: userId } = await supabase
      .from("user_friends")
      .select()
      .eq("friend_username", friendUsername)
      .single();

    if (userId) return userId;
  }

  const userFriend = await getUserId();

  return (
    <aside
      id="default-sidebar"
      className="fixed right-0 top-0 z-40 flex h-screen w-64 -translate-x-full flex-col justify-between bg-neutral-800 pb-5 pt-20 text-center text-neutral-200 transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div>
        <div className="flex justify-center gap-2 text-2xl">
          <FaUserFriends className="my-auto" />
          <div>{friendUsername}</div>
        </div>
        {userFriend && (
          <div className="mt-3">
            <div>Friends Since</div>
            <div>{isoToString(userFriend.created_at)}</div>
          </div>
        )}
      </div>
      <div className=" flex flex-col gap-3 px-4">
        <Button className="bg-neutral-700">Remove Friend</Button>
        <Button className="bg-neutral-700">Block</Button>
      </div>
    </aside>
  );
}
