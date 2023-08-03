"use client";

import { Database } from "@/types/supabase";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { FaUserFriends } from "react-icons/fa";

export const revalidate = 60;

function getSubstringAfterThirdSlash(inputString: string) {
  const parts = inputString.split("/");
  if (parts.length <= 3) {
    return null;
  }
  const resultVariable = parts.slice(3).join("/");
  return resultVariable;
}

interface FriendsListProps {
  friends: Database["public"]["Views"]["user_friends"]["Row"][];
}

export async function FriendsList({ friends }: FriendsListProps) {
  const pathname = usePathname();
  const currentFriend = getSubstringAfterThirdSlash(pathname);

  return (
    <aside
      id="default-sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full bg-neutral-800 pt-20 text-center text-neutral-200 transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="flex justify-center gap-2 text-2xl">
        <FaUserFriends className="my-auto" />
        <div>Friends</div>
      </div>
      {friends &&
        friends.map((friend) => (
          <Link
            key={friend.friend_id}
            className={`block px-3 py-2 text-lg hover:bg-neutral-700 ${
              currentFriend === friend.friend_username ? "bg-neutral-600" : ""
            }`}
            href={`/social/friend/${friend.friend_username}`}
          >
            {friend.friend_username}
          </Link>
        ))}
    </aside>
  );
}
