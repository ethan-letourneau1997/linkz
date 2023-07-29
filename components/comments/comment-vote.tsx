"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import { BsTriangleFill, BsTriangle } from "react-icons/bs";

interface CommentVotesProps {
  postOrCommentId: number | null;
  userId: string;
  isComment?: boolean;
}

export function CommentVotes({
  postOrCommentId,
  userId,
  isComment,
}: CommentVotesProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [currentUserVote, setCurrentUserVote] = useState<null | number>(null);
  const [update, setUpdate] = useState(0);
  const [totalCommentVotes, setTotalCommentVotes] = useState<null | number>(
    null,
  );

  useEffect(() => {
    async function fetchCommentData() {
      // get the comments total votes
      const totalVotesData = await supabase
        .from("user_comment_vote")
        .select("user_vote")
        .eq("comment_id", postOrCommentId);

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
      const [voteData] = await Promise.all([
        supabase
          .from("user_comment_vote")
          .select("user_vote")
          .match({ voter_id: userId, comment_id: postOrCommentId }),
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
    async function fetchPostData() {
      // get the post total votes
      const totalVotesData = await supabase
        .from("user_post_vote")
        .select("user_vote")
        .eq("post_id", postOrCommentId);

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
      const [voteData] = await Promise.all([
        supabase
          .from("user_post_vote")
          .select("user_vote")
          .match({ voter_id: userId, post_id: postOrCommentId }),
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

    isComment ? fetchCommentData() : fetchPostData();
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
    if (isComment) {
      const { data } = await supabase
        .from("user_comment_vote")
        .upsert({
          comment_id: postOrCommentId,
          voter_id: userId,
          user_vote: voteValue,
        })
        .select();
      if (data) {
        setUpdate(update + 1);
      }
    } else {
      const { data } = await supabase
        .from("user_post_vote")
        .upsert({
          post_id: postOrCommentId,
          voter_id: userId,
          user_vote: voteValue,
        })
        .select();
      if (data) {
        setUpdate(update + 1);
      }
    }
  }

  if (totalCommentVotes !== null && currentUserVote !== null)
    return (
      <div className="flex gap-1">
        {currentUserVote === 1 ? (
          <BsTriangleFill
            onClick={handleRemoveVote}
            className="my-auto hover:cursor-pointer"
            size={15}
          />
        ) : (
          <BsTriangle
            className="my-auto text-lg hover:cursor-pointer hover:text-green-600"
            onClick={handleUpvote}
            size={15}
          />
        )}
        <span className="text-sm">{totalCommentVotes}</span>
        {currentUserVote === -1 ? (
          <BsTriangleFill
            onClick={handleRemoveVote}
            className="my-auto rotate-180 text-lg hover:cursor-pointer"
            size={15}
          />
        ) : (
          <BsTriangle
            className="my-auto rotate-180 text-lg hover:cursor-pointer hover:text-red-600"
            onClick={handleDownvote}
            size={15}
          />
        )}
      </div>
    );

  return (
    <div className="flex gap-1">
      <BsTriangle
        className="my-auto text-lg hover:cursor-pointer hover:text-green-600"
        onClick={handleUpvote}
        size={15}
      />
      <span className="text-sm">0</span>
      <BsTriangle
        className="my-auto rotate-180 text-lg hover:cursor-pointer hover:text-red-600"
        onClick={handleDownvote}
        size={15}
      />
    </div>
  );
}
