import { BsTriangle } from "react-icons/bs";

export async function VotesLoggedOut({
  totatVotes,
}: {
  totatVotes: number | null;
}) {
  return (
    <div className="flex gap-1">
      <BsTriangle className="my-auto text-lg text-neutral-400" size={15} />
      <span className=" text-sm">{totatVotes || 0}</span>
      <BsTriangle
        className="my-auto rotate-180 text-lg text-neutral-400"
        size={15}
      />
    </div>
  );
}
