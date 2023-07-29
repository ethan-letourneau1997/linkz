"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SubscribeBtnProps } from "@/types/types";

export default function SubscribeBtn({
  userId,
  communityId,
}: SubscribeBtnProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [isSubscribed, setIsSubscribed] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("user_community")
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
    const { error } = await supabase
      .from("user_community")
      .insert([{ user_id: userId, community_id: communityId }])
      .select();

    if (error) console.log(error);

    setIsSubscribed(true);
  }

  // unsubscribe user from community
  async function handleUnsubscribe() {
    const { error } = await supabase
      .from("user_community")
      .delete()
      .match({ user_id: userId, community_id: communityId });

    if (error) console.log(error);
    setIsSubscribed(false);
  }

  return (
    <>
      {isSubscribed ? (
        <Button
          onClick={handleUnsubscribe}
          className=" h-6  px-2 text-xs"
          variant="ghost"
        >
          unsubscribe
        </Button>
      ) : null}
      {isSubscribed === false ? (
        <Button
          variant="secondary"
          className="h-8 text-xs "
          onClick={handleSubscribe}
        >
          Subscribe
        </Button>
      ) : null}
    </>
  );
}
