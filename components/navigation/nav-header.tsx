"use client";

import { Navbar } from "flowbite-react";
import { Button, buttonVariants } from "../ui/button";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export function NavHeader() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  // get user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
    };

    getUser();
  }, [supabase]);

  return (
    <Navbar fluid>
      <div className="flex justify-between w-full md:w-fit md:order-2">
        {user ? (
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="mt-1 dark:bg-neutral-950">
        <Navbar.Link className="border-0 dark:text-neutral-200" href="/">
          Home
        </Navbar.Link>
        <Navbar.Link
          className="border-0 dark:text-neutral-2"
          href="/community/all"
        >
          Communities
        </Navbar.Link>
        <Navbar.Link
          className="border-0 dark:text-neutral-2"
          href={`/user/${user?.id}`}
        >
          Profile
        </Navbar.Link>
        <div className="mt-3" />
        <LogoutButton />
      </Navbar.Collapse>
    </Navbar>
  );
}
