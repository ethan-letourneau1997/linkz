import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LogoutButton from "../LogoutButton";
import { buttonVariants } from "../ui/button";
import { fetchUser } from "@/lib/utils";

export async function NavWrapper() {
  const supabase = createServerComponentClient({ cookies }); // get supabase

  const user = await fetchUser(supabase); // get user

  const logBtn = user ? (
    <LogoutButton />
  ) : (
    <Link href="/login" className={buttonVariants({ variant: "outline" })}>
      Login
    </Link>
  );

  return (
    <div>
      <nav className="py-2 shadow-lg ">
        <div className="container mx-auto px-4 md:px-8 ">
          <div className=" flex justify-between">
            {/* <!-- Primary Navbar items --> */}
            <div className="hidden items-center space-x-10 md:flex">
              <Link className="border-0 text-neutral-200" href="/">
                Home
              </Link>
              <Link className="border-0 text-neutral-200" href="/community/all">
                Communities
              </Link>
              <Link
                className="border-0 text-neutral-200"
                href={`/user/${user?.id}`}
              >
                Profile
              </Link>
            </div>
            {/* <!-- Secondary Navbar items --> */}
            <div className="hidden items-center space-x-3 md:flex ">
              {logBtn}
            </div>
            {/* <!-- Mobile menu button --> */}
            <div className="flex h-12 w-full items-center justify-end md:hidden">
              <Collapsible>
                <div className="flex justify-end ">
                  <CollapsibleTrigger>
                    <div className="mobile-menu-button outline-none">
                      <svg
                        className="h-6 w-6 text-gray-500 hover:text-green-500"
                        x-show="!showMenu"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </div>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="mobile-menu absolute left-0 top-14 mt-2 flex w-screen flex-col gap-5 bg-neutral-800 px-4 py-4">
                    <Link className="border-0 text-neutral-200" href="/">
                      Home
                    </Link>
                    <Link
                      className="border-0 text-neutral-200"
                      href="/community/all"
                    >
                      Communities
                    </Link>
                    <Link
                      className="border-0 text-neutral-200"
                      href={`/user/${user?.id}`}
                    >
                      Profile
                    </Link>
                    {logBtn}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
        {/* <!-- mobile menu --> */}
      </nav>
    </div>
  );
}

interface UserProps {
  user: any;
}

export async function LoginLogout({ user }: UserProps) {
  if (user)
    return (
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    );
  else if (user !== null)
    return (
      <>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Login
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Sign up
        </Link>
      </>
    );
}
