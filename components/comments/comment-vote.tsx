"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import {
  BiChevronDownCircle,
  BiChevronUpCircle,
  BiSolidChevronDownCircle,
  BiSolidChevronUpCircle,
} from "react-icons/bi";
import { Skeleton } from "../ui/skeleton";

interface CommentVotesProps {
  commentId: number;
  userId: string | null;
}

export function CommentVotes({ commentId, userId }: CommentVotesProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [currentUserVote, setCurrentUserVote] = useState<null | number>(null);
  const [update, setUpdate] = useState(0);
  const [totalCommentVotes, setTotalCommentVotes] = useState<null | number>(
    null,
  );

  useEffect(() => {
    async function fetchData() {
      // get the comments total votes
      const totalVotesData = await supabase
        .from("user_comment_vote")
        .select("user_vote")
        .eq("comment_id", commentId);

      if (totalVotesData.data && totalVotesData.data.length > 0) {
        const totalVotes = totalVotesData.data.reduce(
          (sum, user_vote) => sum + user_vote.user_vote,
          0,
        );
        setTotalCommentVotes(totalVotes);
      } else if (totalVotesData.data?.length === 0) {
        setTotalCommentVotes(0);
      }

      // get current user vote
      if (!userId) return;
      const [voteData] = await Promise.all([
        supabase
          .from("user_comment_vote")
          .select("user_vote")
          .match({ voter_id: userId, comment_id: commentId }),
      ]);

      if (voteData.data?.length === 0) {
        setCurrentUserVote(0);
      }

      if (voteData.data && voteData.data[0]) {
        setCurrentUserVote(voteData.data[0].user_vote);
      }

      if (voteData.error) {
        console.error(voteData.error);
      }
    }

    fetchData();
  }, [update, userId]);

  function handleUpvote() {
    // temp set before validation
    setCurrentUserVote(1);
    // temp set before validation
    setTotalCommentVotes(totalCommentVotes! + 1);
    handleUpdateVote(1);
  }

  function handleDownvote() {
    // temp set before validation
    setTotalCommentVotes(totalCommentVotes! - 1);
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
    const { data } = await supabase
      .from("user_comment_vote")
      .upsert({ comment_id: commentId, voter_id: userId, user_vote: voteValue })
      .select();
    if (data) {
      setUpdate(update + 1);
    }
  }

  if (totalCommentVotes !== null && currentUserVote !== null)
    return (
      <div className="flex gap-2">
        {currentUserVote === 1 ? (
          <BiSolidChevronUpCircle
            onClick={handleRemoveVote}
            className="text-lg hover:cursor-pointer "
          />
        ) : (
          <BiChevronUpCircle
            className="text-lg hover:cursor-pointer hover:text-green-600"
            onClick={handleUpvote}
          />
        )}
        <span className="text-sm">{totalCommentVotes}</span>
        {currentUserVote === -1 ? (
          <BiSolidChevronDownCircle
            onClick={handleRemoveVote}
            className="text-lg hover:cursor-pointer "
          />
        ) : (
          <BiChevronDownCircle
            className="text-lg hover:cursor-pointer hover:text-red-600"
            onClick={handleDownvote}
          />
        )}
      </div>
    );

  if (!userId && totalCommentVotes !== null)
    return (
      <div className="flex gap-2">
        <BiChevronUpCircle className="text-lg hover:cursor-pointer hover:text-green-600" />
        <span className="text-sm">{totalCommentVotes}</span>
        <BiChevronDownCircle className="text-lg hover:cursor-pointer hover:text-red-600" />
      </div>
    );

  return <Skeleton className="h-[20px] w-[50px] rounded-sm bg-neutral-200" />;
}
