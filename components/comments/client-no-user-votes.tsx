"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { BsTriangle } from "react-icons/bs";

export function ClientNoUserVotes({ Id, type }: { Id: number; type: string }) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    async function getPostVotes() {
      const { data, error } = await supabase
        .from("post_vote_count")
        .select("*")
        .match({ post_id: Id })
        .limit(1)
        .single();
      if (data) {
        setTotalVotes(data.total_votes);
      }
      if (error) {
        console.log(error);
      }
    }

    async function getCommentVotes() {
      const { data, error } = await supabase
        .from("comment_vote_count")
        .select("*")
        .match({ comment_id: Id })
        .limit(1)
        .single();
      if (data) {
        setTotalVotes(data.total_votes);
      }
      if (error) {
        console.log(error);
      }
    }

    if (type === "post") {
      getPostVotes();
    }
    if (type === "comment") {
      getCommentVotes();
    }
  }, [supabase]);

  return (
    <div className="flex gap-1">
      <BsTriangle className="my-auto text-lg text-neutral-400" size={15} />

      <span className="text-sm">{totalVotes}</span>

      <BsTriangle
        className="my-auto  rotate-180 text-lg text-neutral-400"
        size={15}
      />
    </div>
  );
}
