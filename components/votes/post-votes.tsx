"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { BsTriangle, BsTriangleFill } from "react-icons/bs";

export function PostVotes({ user, postId }: { user: User; postId: number }) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies
  const [totalPostVotes, setTotalPostVotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<number>(0);

  useEffect(() => {
    // get the total votes for this post
    async function getTotalVotes() {
      const {
        data: { total_votes },
      } = await supabase
        .from("post_vote_count")
        .select("*")
        .match({ post_id: postId })
        .limit(1)
        .single();
      if (total_votes) {
        setTotalPostVotes(total_votes);
      }
    }

    // see if user has voted on this post
    async function getUserVote() {
      const { data: user_comment_vote, error } = await supabase
        .from("user_post_vote")
        .select("*")
        .match({ voter_id: user.id, post_id: postId })
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
  }, [supabase, totalPostVotes]);

  // add an upvote to this post
  function handleUpVote() {
    async function upvote() {
      const { data } = await supabase
        .from("user_post_vote")
        .upsert({
          post_id: postId,
          voter_id: user.id,
          user_vote: 1,
        })
        .select();
      if (data) {
        setUserVote(1);
        userVote === -1
          ? setTotalPostVotes(totalPostVotes + 2)
          : setTotalPostVotes(totalPostVotes + 1);
      }
    }
    upvote();
  }

  // add a downvote to this post
  function handleDownVote() {
    async function downvote() {
      const { data } = await supabase
        .from("user_post_vote")
        .upsert({
          post_id: postId,
          voter_id: user.id,
          user_vote: -1,
        })
        .select();
      if (data) {
        userVote === 1
          ? setTotalPostVotes(totalPostVotes - 2)
          : setTotalPostVotes(totalPostVotes - 1);
        setUserVote(-1);
      }
    }
    downvote();
  }

  // remove the user vote from this post
  function handleRemoveVote() {
    async function removeVote() {
      const { data } = await supabase
        .from("user_post_vote")
        .upsert({
          post_id: postId,
          voter_id: user.id,
          user_vote: 0,
        })
        .select();
      if (data) {
        userVote === 1
          ? setTotalPostVotes(totalPostVotes - 1)
          : setTotalPostVotes(totalPostVotes + 1);
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
      <span className="text-sm">{totalPostVotes}</span>
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
