"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { BsTriangle, BsTriangleFill } from "react-icons/bs";

export function CommentVotes({
  user,
  commentId,
}: {
  user: User;
  commentId: number;
}) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies
  const [totalCommentVotes, setTotalCommentVotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<number>(0);

  useEffect(() => {
    // get the total votes for this comment
    async function getTotalVotes() {
      const {
        data: { total_votes },
      } = await supabase
        .from("comment_vote_count")
        .select("*")
        .match({ comment_id: commentId })
        .limit(1)
        .single();
      if (total_votes) {
        setTotalCommentVotes(total_votes);
      }
    }

    // see if user has voted on this comment
    async function getUserVote() {
      const { data: user_comment_vote, error } = await supabase
        .from("user_comment_vote")
        .select("*")
        .match({ voter_id: user.id, comment_id: commentId })
        .limit(1)
        .single();
      if (error) {
        setUserVote(0);
      }
      if (user_comment_vote) {
        setUserVote(user_comment_vote.user_vote);
      }
    }

    getUserVote();
    getTotalVotes();
  }, [supabase, totalCommentVotes]);

  // add an upvote to this comment
  function handleUpVote() {
    async function upvote() {
      const { data } = await supabase
        .from("user_comment_vote")
        .upsert({
          comment_id: commentId,
          voter_id: user.id,
          user_vote: 1,
        })
        .select();
      if (data) {
        setUserVote(1);
        setTotalCommentVotes(totalCommentVotes + 1);
      }
    }
    upvote();
  }

  // add a downvote to this comment
  function handleDownVote() {
    async function downvote() {
      const { data } = await supabase
        .from("user_comment_vote")
        .upsert({
          comment_id: commentId,
          voter_id: user.id,
          user_vote: -1,
        })
        .select();
      if (data) {
        setUserVote(-1);
        setTotalCommentVotes(totalCommentVotes - 1);
      }
    }
    downvote();
  }

  // remove the user vote from this comment
  function handleRemoveVote() {
    async function removeVote() {
      const { data } = await supabase
        .from("user_comment_vote")
        .upsert({
          comment_id: commentId,
          voter_id: user.id,
          user_vote: 0,
        })
        .select();
      if (data) {
        userVote === 1
          ? setTotalCommentVotes(totalCommentVotes - 1)
          : setTotalCommentVotes(totalCommentVotes + 1);
        setUserVote(0);
      }
    }
    removeVote();
  }

  return (
    <div className="flex gap-1">
      {userVote === 1 ? (
        <BsTriangleFill
          className="my-auto text-lg hover:cursor-pointer "
          size={15}
          onClick={handleRemoveVote}
        />
      ) : (
        <BsTriangle
          className="my-auto  text-lg hover:cursor-pointer hover:text-green-600"
          size={15}
          onClick={handleUpVote}
        />
      )}
      <span className="text-sm">{totalCommentVotes}</span>
      {userVote === -1 ? (
        <BsTriangleFill
          className="my-auto rotate-180 text-lg hover:cursor-pointer"
          size={15}
          onClick={handleRemoveVote}
        />
      ) : (
        <BsTriangle
          className="my-auto  rotate-180 text-lg hover:cursor-pointer hover:text-red-600"
          size={15}
          onClick={handleDownVote}
        />
      )}
    </div>
  );
}
