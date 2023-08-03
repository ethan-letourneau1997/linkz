"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "@supabase/ui";
import { fetchUser } from "@/lib/utils";
import { Database } from "@/types/supabase";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface ProfileHeaderProps {
  userProfile: Database["public"]["Tables"]["user_profile"]["Row"];
}

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User>();
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(supabase); // get user
      if (user) setUser(user);
    };
    getUser();
  }, [supabase, isFriend]);

  useEffect(() => {
    const checkFriends = async () => {
      if (user) {
        const { data } = await supabase
          .from("user_user")
          .select()
          .match({ user1: user.id, user2: userProfile.id });
        console.log(data);
        if (data && data.length > 0) {
          setIsFriend(true);
        } else {
          const { data } = await supabase
            .from("user_user")
            .select()
            .match({ user2: user.id, user1: userProfile.id });
          console.log(data);
          if (data && data.length > 0) {
            setIsFriend(true);
          }
        }
      }
    };
    checkFriends();
  }, [supabase, user]);

  function handleAddFriend() {
    async function addFriend() {
      if (user) {
        const { data } = await supabase
          .from("user_user")
          .insert({
            user1: user.id,
            user2: userProfile.id,
            relationship: "friend",
          })
          .select();

        if (data) {
          setIsFriend(true);
        }
      }
    }
    addFriend();
  }

  function handleRemoveFriend() {
    async function removeFriend() {
      if (user) {
        await supabase
          .from("user_user")
          .delete()
          .match({ user1: user.id, user2: userProfile.id })
          .select();

        await supabase
          .from("user_user")
          .delete()
          .match({ user2: user.id, user1: userProfile.id })
          .select();

        setIsFriend(false);
      }
    }
    removeFriend();
  }

  if (userProfile)
    return (
      <div className=" bg-neutral-800  py-10">
        <div className="align mx-auto flex max-w-2xl justify-between px-10 md:px-5">
          <div className=" flex items-end gap-3 ">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className=" bg-teal-500">CN</AvatarFallback>
            </Avatar>
            <span className="h-fit text-2xl font-bold tracking-wide text-neutral-50">
              {userProfile.username}
            </span>
          </div>
          <div className="my-auto">
            {user && isFriend ? (
              <Button
                className="relative bg-neutral-600 hover:bg-neutral-400"
                onClick={handleRemoveFriend}
              >
                Remove Friend
              </Button>
            ) : (
              <Button className="relative" onClick={handleAddFriend}>
                Add Friend
              </Button>
            )}
          </div>
        </div>
      </div>
    );
}
