import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AllCommunities() {
  // get supabase
  const supabase = createServerComponentClient({ cookies });

  let { data: communities, error } = await supabase
    .from("community")
    .select("*");

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      {user && (
        <Link
          className="px-3 py-1 border hover:bg-white hover:text-black"
          href="create"
        >
          New +
        </Link>
      )}

      <div className="mt-5">
        {communities &&
          communities.map((community) => (
            <div key={community.id} className="mb-4">
              <h4 className="text-lg font-bold">
                <Link href={`${community.community_name}`}>
                  {community.community_name}
                </Link>
              </h4>
              <p>{community.community_description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
