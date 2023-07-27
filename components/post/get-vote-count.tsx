"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface GetVoteCountProps {
  postId: number | string;
  vote_table: string;
}

export function GetVoteCount({ postId, vote_table }: GetVoteCountProps) {
  const supabase = createClientComponentClient(); // get supabase
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    async function getVotes() {
      const { data: user_votes } = await supabase
        .from(vote_table)
        .select("user_vote")
        .eq("post_id", postId);

      if (user_votes) {
        // Get the votes array from the response data
        const votesArray = user_votes.map((item) => item.user_vote);
        const totalVotes = votesArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );

        // If there is only one vote, display it directly
        if (votesArray.length === 1) {
          setTotalVotes(votesArray[0]);
        } else {
          setTotalVotes(totalVotes);
        }
      }
    }

    getVotes();
  }, [postId]);

  return <span>{totalVotes}</span>;
}
