"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { GetVoteCount } from "./get-vote-count";

interface PostVotesProps {
  postId: string;
  userId: string | null;
}

export function PostVotes({ postId, userId }: PostVotesProps) {
  const supabase = createClientComponentClient(); // get supabase

  const [update, setUpdate] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(0);
  const [totalPostVotes, setTotalPostVotes] = useState<number | null>(0);

  useEffect(() => {
    async function fetchData() {
      // get current user vote
      const [voteData] = await Promise.all([
        supabase
          .from("user_post_vote")
          .select("user_vote")
          .match({ voter_id: userId, post_id: postId }),
      ]);

      if (voteData.data && voteData.data[0]) {
        setCurrentUserVote(voteData.data[0].user_vote);
      }

      if (voteData.error) {
        console.error(voteData.error);
      }

      // get the comments total votes
      const totalVotesData = await supabase
        .from("user_post_vote")
        .select("user_vote")
        .eq("post_id", postId);

      if (totalVotesData.data && totalVotesData.data.length > 0) {
        const totalVotes = totalVotesData.data.reduce(
          (sum, vote) => sum + vote.user_vote,
          0
        );
        setTotalPostVotes(totalVotes);
      }

      if (totalVotesData.error) {
        console.error(totalVotesData.error);
        setTotalPostVotes(0);
      }
    }

    fetchData();
  }, [update]);

  function handleUpvote() {
    handleUpdateVote(1);
  }

  function handleDownvote() {
    handleUpdateVote(-1);
  }

  function handleRemoveVote() {
    handleUpdateVote(0);
  }

  async function handleUpdateVote(voteValue: number) {
    const { data, error } = await supabase
      .from("user_post_vote")
      .upsert({ voter_id: userId, post_id: postId, user_vote: voteValue })
      .select();
    if (error) console.log(error);

    setUpdate(update + 1);
  }

  return (
    <>
      {userId && (
        <div className="flex gap-3">
          <Button
            onClick={currentUserVote === 1 ? handleRemoveVote : handleUpvote}
          >
            {currentUserVote === 1 ? "remove vote" : "Upvote"}
          </Button>
          <Button
            onClick={currentUserVote === -1 ? handleRemoveVote : handleDownvote}
          >
            {currentUserVote === -1 ? "remove vote" : "Downvote"}
          </Button>
        </div>
      )}
      <span> votes: {totalPostVotes}</span>
    </>
  );
}
