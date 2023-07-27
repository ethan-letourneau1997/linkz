import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Link from "next/link";

async function getUserCommunities(user: User) {
  const supabase = createServerComponentClient({ cookies });
  if (user) {
    const { data } = await supabase
      .from("community")
      .select("*")
      .eq("creator_user_id", user.id);

    if (data) return data;
  }
}

export async function UserCreatedCommunities({ user }: { user: User }) {
  const userCreatedCommunities = await getUserCommunities(user);

  if (userCreatedCommunities)
    return (
      <div className="bg-neutral-50 pt-3 text-sm shadow-sm  sm:text-base">
        <h2 className="px-4 pb-3 text-lg font-medium sm:text-xl">
          Created Communities
        </h2>
        {userCreatedCommunities.map((community) => (
          <>
            <div className="space-y-1 px-4" key={community.id}>
              <Link
                className="text-base font-medium text-neutral-700 sm:text-lg"
                href={`/community/${community.community_name}`}
              >
                {community.community_name}
              </Link>
              <p className=" text-neutral-600">
                {community.community_description}
              </p>
            </div>
            <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
          </>
        ))}
      </div>
    );
}
