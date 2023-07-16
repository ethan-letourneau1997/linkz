import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UsernameForm } from "@/components/user/username-form";

async function fetchUserProfile() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = "";
  let error = null;

  if (user) {
    const { data, error: profileError } = await supabase
      .from("user_profile")
      .select("*")
      .eq("id", user.id)
      .limit(1)
      .single();

    if (data && data.username) {
      username = data.username;
    }

    error = profileError;
  }

  if (user && username) {
    return (
      <div>
        <p className="text-3xl font-semibold text-center">Hello, {username}!</p>
        <p className="mt-4 text-2xl text-center">start exploring!</p>
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
