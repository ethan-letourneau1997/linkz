"use client";
import { Navbar } from "flowbite-react";
import { buttonVariants } from "../ui/button";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { fetchUser } from "@/lib/utils";

export function NavHeader() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [logBtn, setLogBtn] = useState<React.ReactNode>();
  // get user
  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(supabase); // get user
      if (user) {
        setLogBtn(
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>,
        );
        setUser(user);
      } else {
        setLogBtn(
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>,
        );
      }
      if (user) setUser(user);
    };

    getUser();
  }, [supabase, logBtn]);

  return (
    <Navbar fluid className=" bg-neutral-950">
      <div className="flex w-full justify-end">
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="mt-1 dark:bg-neutral-950 ">
        <Navbar.Link className="border-0 text-neutral-200" href="/">
          Home
        </Navbar.Link>
        <Navbar.Link
          className="border-0 text-neutral-200"
          href="/community/all"
        >
          Communities
        </Navbar.Link>
        {user && (
          <Navbar.Link
            className="border-0 text-neutral-200"
            href={`/user/${user?.id}`}
          >
            Profile
          </Navbar.Link>
        )}

        <div className="md:hidden">
          <div className="mt-3" />
          {logBtn}
        </div>
      </Navbar.Collapse>

      <div className="hidden md:block">{logBtn}</div>
    </Navbar>
  );
}

// function LoginLogout({ user }: UserProps) {
//   if (user)
//     return (
//       <div className="flex items-center gap-4">
//         <LogoutButton />
//       </div>
//     );
//   else if (user !== null)
//     return (
//       <Link href="/login" className={buttonVariants({ variant: "outline" })}>
//         Login
//       </Link>
//     );
// }
