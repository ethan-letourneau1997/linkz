"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { revalidatePath } from "next/cache";

interface SubscribeBtnProps {
  userId: string;
  communityId: string;
}

export default function SubscribeBtn({
  userId,
  communityId,
}: SubscribeBtnProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [isSubscribed, setIsSubscribed] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data, error } = await supabase
          .from("profile_community")
          .select("community(id, community_name)")
          .match({ user_id: userId, community_id: communityId });

        if (data && data.length === 1) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }

        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // subscribe user to community
  async function handleSubscribe() {
    const { data, error } = await supabase
      .from("profile_community")
      .insert([{ user_id: userId, community_id: communityId }])
      .select();

    if (error) console.log(error);

    setIsSubscribed(true);
  }

  // unsubscribe user from community
  async function handleUnsubscribe() {
    const { error } = await supabase
      .from("profile_community")
      .delete()
      .match({ user_id: userId, community_id: communityId });

    if (error) console.log(error);
    setIsSubscribed(false);
  }

  return (
    <>
      {isSubscribed ? (
        <button
          onClick={handleUnsubscribe}
          className="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700"
        >
          unsubscribe
        </button>
      ) : null}
      {isSubscribed === false ? (
        <button
          onClick={handleSubscribe}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
        >
          subscribe
        </button>
      ) : null}
    </>
  );
}
