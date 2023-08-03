import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BsTriangle } from "react-icons/bs";

export async function NoUserVotes({ Id, type }: { Id: number; type: string }) {
  async function getPostVotes() {
    const supabase = createServerComponentClient({ cookies });
    if (type === "post") {
      const { data, error } = await supabase
        .from("post_vote_count")
        .select("*")
        .match({ post_id: Id })
        .limit(1)
        .single();
      if (data) {
        return data.total_votes;
      }
      if (error) {
        console.log(error);
      }
    } else if (type === "comment") {
      const { data, error } = await supabase
        .from("comment_vote_count")
        .select("*")
        .match({ comment_id: Id })
        .limit(1)
        .single();
      if (data) {
        return data.total_votes;
      }
      if (error) {
        console.log(error);
      }
    }
  }

  const totalVotes = await getPostVotes();

  getPostVotes();
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
