import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsernameForm } from "@/components/user/username-form";

export default async function Index() {
  // get user
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = "";
  let error = null;

  // fetch user profile from database
  if (user) {
    const { data, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id);
    if (data && username) username = data[0].user_name;

    error = profileError;
  }
  if (user && username)
    return (
      <div className="flex items-center gap-4 text-3xl">Hello, {username}!</div>
    );
  else if (user) return <UsernameForm userId={user.id} />;
  else return <p className="text-2xl">No user logged in.</p>;
}
