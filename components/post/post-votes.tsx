"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface PostVotesProps {
  postId: string;
  userId: string;
}

export function PostVotes({ postId, userId }: PostVotesProps) {
  const supabase = createClientComponentClient(); // get supabase

  const [update, setUpdate] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(0);
  const [totalPostVotes, setTotalPostVotes] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // get current user vote
      const [voteData] = await Promise.all([
        supabase
          .from("profile_post")
          .select("vote")
          .match({ user_voting: userId, voted_post: postId }),
      ]);

      if (voteData.data && voteData.data[0]) {
        setCurrentUserVote(voteData.data[0].vote);
      }

      if (voteData.error) {
        console.error(voteData.error);
      }

      // get the comments total votes
      const totalVotesData = await supabase
        .from("profile_post")
        .select("vote")
        .eq("voted_post", postId);

      if (totalVotesData.data && totalVotesData.data.length > 0) {
        const totalVotes = totalVotesData.data.reduce(
          (sum, vote) => sum + vote.vote,
          0
        );
        setTotalPostVotes(totalVotes);
      }

      if (totalVotesData.error) {
        console.error(totalVotesData.error);
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
      .from("profile_post")
      .upsert({ user_voting: userId, voted_post: postId, vote: voteValue })
      .select();

    setUpdate(update + 1);
  }

  return (
    <>
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
      votes: {totalPostVotes}
    </>
  );
}
