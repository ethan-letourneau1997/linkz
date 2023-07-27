import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

async function getUserSubscriptions(user: User) {
  const supabase = createServerComponentClient({ cookies });
  if (user) {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id);

    // if subscriptions return subscriptions
    if (data) {
      return data;
    }
  }
}

export async function UserSubscriptions({ user }: { user: User }) {
  const userSubscriptions = await getUserSubscriptions(user);

  if (userSubscriptions)
    return (
      <div className="bg-neutral-50 pt-3 text-sm shadow-sm sm:text-base">
        <h2 className="px-4 pb-3 text-lg font-medium sm:text-xl">
          Subscriptions
        </h2>
        {userSubscriptions.map((subscription) => (
          <>
            <div className="space-y-1 px-4" key={subscription.community_id}>
              <Link
                className="mb-1 mt-4 text-base font-medium text-neutral-700 sm:text-lg"
                href={`/community/${subscription.community_name}`}
              >
                {subscription.community_name}
              </Link>

              <p className="line-clamp-1 text-sm text-neutral-600 sm:text-base">
                {subscription.community_description}
              </p>
            </div>
            <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
          </>
        ))}
      </div>
    );
}
