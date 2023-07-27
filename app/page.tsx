import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UsernameForm } from "@/components/user/username-form";
import { fetchUser } from "@/lib/utils";

async function fetchUserProfile() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase); // get user

  async function fetchUserProfile() {
    if (user) {
      const { data } = await supabase
        .from("user_profile")
        .select("*")
        .eq("id", user.id)
        .limit(1)
        .single();

      if (data && data.username) {
        return data.username;
      }
    }
  }

  const username = await fetchUserProfile();

  if (user && username) {
    return (
      <div className="mt-5">
        <p className="text-center text-3xl font-semibold">Hello, {username}!</p>
        <p className="mt-4 text-center text-2xl">start exploring!</p>
      </div>
    );
  } else if (user) {
    return <UsernameForm userId={user.id} />;
  } else {
    return <p className="text-2xl">No user logged in.</p>;
  }
}

export default function Index() {
  return fetchUserProfile();
}
