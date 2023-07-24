import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface GetVoteCountProps {
  postId: number | string;
  vote_table: string;
}

interface UserProps {
  user_vote: number;
}

export async function VoteCount({ postId, vote_table }: GetVoteCountProps) {
  const supabase = createServerComponentClient({ cookies }); // get supabase

  let { data: user_votes, error } = await supabase
    .from(vote_table)
    .select("user_vote")
    .eq("post_id", postId);

  const totalVotes = await calculateVotes(user_votes);

  return <>{totalVotes}</>;
}

async function calculateVotes(user_votes: UserProps[] | null) {
  if (user_votes) {
    // Get the votes array from the response data
    const votesArray = user_votes.map((user: UserProps) => user.user_vote);

    // If there is only one vote, display it directly
    if (votesArray.length === 1) {
      return votesArray[0];
    }

    // If there is more than one vote, add and return the total
    const totalVotes = votesArray.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );

    if (votesArray.length > 1) {
      return totalVotes;
    } else {
      return 0;
    }
  }
}
