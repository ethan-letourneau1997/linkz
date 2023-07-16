import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

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
    <div className="max-w-xl ">
      <h1 className="text-2xl text-center">All Communities</h1>
      <div className="mt-5 ">
        {communities &&
          communities.map((community) => (
            <Link href={`${community.community_name}`}>
              <div
                key={community.id}
                className="px-4 py-2 pl-4 mb-4 border dark:border-neutral-600 dark:hover:bg-neutral-900"
              >
                <h2 className="text-lg font-semibold ">
                  {community.community_name}
                </h2>
                <p className="mt-1  line-clamp-2 dark:text-neutral-300">
                  {community.community_description}
                </p>
              </div>
            </Link>
          ))}
      </div>
      {user && (
        <Link
          href="/login"
          className={`${buttonVariants({ variant: "secondary" })} w-full mt-2`}
        >
          Create New Community
        </Link>
        // <Link
        //   className="px-3 py-1 border hover:bg-white hover:text-black"
        //   href="create"
        // >
        //   Create New Community
        // </Link>
      )}
    </div>
  );
}
