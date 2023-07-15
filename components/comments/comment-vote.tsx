"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface CommentVotesProps {
  commentId: number;
  userId: string;
}

export function CommentVotes({ commentId, userId }: CommentVotesProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [currentUserVote, setCurrentUserVote] = useState(0);
  const [update, setUpdate] = useState(0);
  const [totalCommentVotes, setTotalCommentVotes] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // get current user vote
      const [voteData] = await Promise.all([
        supabase
          .from("profile_comment")
          .select("vote")
          .match({ voter_id: userId, comment_id: commentId }),
      ]);

      if (voteData.data && voteData.data[0]) {
        setCurrentUserVote(voteData.data[0].vote);
      }

      if (voteData.error) {
        console.error(voteData.error);
      }

      // get the comments total votes
      const totalVotesData = await supabase
        .from("profile_comment")
        .select("vote")
        .eq("comment_id", commentId);

      if (totalVotesData.data && totalVotesData.data.length > 0) {
        const totalVotes = totalVotesData.data.reduce(
          (sum, vote) => sum + vote.vote,
          0
        );
        setTotalCommentVotes(totalVotes);
      }

      if (totalVotesData.error) {
        console.error(totalVotesData.error);
      }
    }

    fetchData();
  }, [update]);

  function handleUpvote() {
    // temp set before validation
    setCurrentUserVote(1);
    // temp set before validation
    setTotalCommentVotes(totalCommentVotes + 1);
    handleUpdateVote(1);
  }

  function handleDownvote() {
    // temp set before validation
    setTotalCommentVotes(totalCommentVotes - 1);
    // temp set before validation
    setCurrentUserVote(-1);
    handleUpdateVote(-1);
  }

  function handleRemoveVote() {
    // temp set before validation
    setCurrentUserVote(0);
    handleUpdateVote(0);
  }

  async function handleUpdateVote(voteValue: number) {
    const { data, error } = await supabase
      .from("profile_comment")
      .upsert({ comment_id: commentId, voter_id: userId, vote: voteValue })
      .select();

    setUpdate(update + 1);
  }

  return (
    <div>
      <p>votes: &nbsp;{totalCommentVotes}</p>

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
    </div>
  );
}
