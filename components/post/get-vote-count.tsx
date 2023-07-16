"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface GetVoteCountProps {
  postId: number;
}

export function GetVoteCount({ postId }: GetVoteCountProps) {
  const supabase = createClientComponentClient(); // get supabase
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    async function getVotes() {
      let { data: user_post_vote, error } = await supabase
        .from("user_post_vote")
        .select("user_vote")
        .eq("post_id", postId);

      if (user_post_vote) {
        // Get the votes array from the response data
        const votesArray = user_post_vote.map((item) => item.user_vote);
        const totalVotes = votesArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );

        // If there is only one vote, display it directly
        if (votesArray.length === 1) {
          setTotalVotes(votesArray[0]);
        } else {
          setTotalVotes(totalVotes);
        }
      }

      if (error) {
        console.log(error);
      }
    }

    getVotes();
  }, [postId]);

  return (
    <div>
      <p>{totalVotes}</p>
    </div>
  );
}
