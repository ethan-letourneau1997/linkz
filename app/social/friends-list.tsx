"use client";

import { Database } from "@/types/supabase";
import Link from "next/link";

import { usePathname } from "next/navigation";

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
    <div className="bg-neutral-400 text-center">
      <div className=" px-3 text-2xl">Friends</div>

      {friends &&
        friends.map((friend) => (
          <div
            className={`px-3 ${
              currentFriend === friend.friend_username ? "bg-neutral-600" : ""
            }`}
            key={friend.friend_id}
          >
            <Link href={`/social/friend/${friend.friend_username}`}>
              {friend.friend_username}
            </Link>
          </div>
        ))}
    </div>
  );

  return <div>Loading...</div>;
}
