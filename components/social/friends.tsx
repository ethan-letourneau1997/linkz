import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export async function Friends() {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase); // get user

  async function getFreinds() {
    if (user) {
      const { data: user_user } = await supabase
        .from("user_friends")
        .select("*")
        .eq("user_id", user.id);

      if (user_user) {
        return user_user;
      }
    }
  }

  const freinds = await getFreinds();

  return (
    <div className="mt-3 w-full max-w-[200px] flex-grow bg-neutral-600 pt-3 text-neutral-200">
      <h1 className="text-center text-xl font-semibold">Freinds</h1>
      <div className="mt-1 space-y-2">
        {freinds &&
          freinds.map((freind) => {
            return (
              <Link
                href={`/social/friend/${freind.friend_username}`}
                key={freind.friend_id}
              >
                <h2 className="text-center">{freind.friend_username}</h2>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
