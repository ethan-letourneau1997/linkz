import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";

export default async function Index() {
  // get user
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "";
  let error = null;

  // fetch user profile from database
  if (user) {
    const { data, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id);
    if (data) userName = data[0].user_name;

    error = profileError;
  }

  return (
    <div className="flex flex-col items-center w-full ">
      {user ? (
        <div className="flex items-center gap-4 text-3xl">
          Hello, {userName}!
        </div>
      ) : (
        <p className="text-2xl">No user logged in.</p>
      )}
    </div>
  );
}
