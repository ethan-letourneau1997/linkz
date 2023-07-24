import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { fetchUser } from "@/lib/utils";

export default async function AllCommunities() {
  // get supabase
  const supabase = createServerComponentClient({ cookies });

  let { data: communities } = await supabase.from("community").select("*");

  // get user
  const user = await fetchUser(supabase); // get user

  return (
    <div className="max-w-[800px] ">
      <h1 className=" py-6 text-center text-3xl font-bold">All Communities</h1>

      <div className="space-y-2">
        {communities &&
          communities.map((community) => (
            <div>
              <Community community={community} supabase={supabase} />
            </div>
          ))}
      </div>
      {/* {user && (
        <div className=" flex w-full  ">
          <Link
            href="/login"
            className={`${buttonVariants({ variant: "" })}   mt-3 `}
          >
            Create New Community
          </Link>
        </div>
      )} */}
    </div>
  );
}

interface Community {
  community: {
    id: number;
    community_name: string;
    community_description: string;
  };
  supabase: any;
}

async function Community({ community, supabase }: Community) {
  let { data: user_community, error } = await supabase
    .from("user_community")
    .select("*")
    .eq("community_id", community.id);

  return (
    <Link href={`${community.community_name}`}>
      <div
        key={community.id}
        className=" rounded-sm bg-neutral-50 px-4 py-3 pl-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold sm:text-lg ">
            {community.community_name}
          </h2>
          {user_community && (
            <span className="text-xs text-neutral-400 sm:text-sm">
              {user_community.length} user
              {user_community.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500 sm:text-base">
          {community.community_description}
        </p>
      </div>
    </Link>
  );
}
