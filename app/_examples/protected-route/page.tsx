// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { fetchUser } from "@/lib/utils";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProtectedRoute() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase); // get user

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }

  const signOut = async () => {
    "use server";
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="flex flex-col flex-1 max-w-3xl mt-24">
      <h1 className="flex justify-between mb-2 text-2xl">
        <span className="sr-only">Supabase and Next.js Starter Template</span>
      </h1>

      <div className="flex py-3 text-sm border-b text-neutral-100">
        <div className="flex items-center justify-between w-full">
          <code className="px-3 py-1 text-sm rounded-lg bg-neutral-700">
            Protected page
          </code>
          <span className="flex gap-4">
            Hey, {user.email}! <span className="border-r"></span>{" "}
            <form action={signOut}>
              <button className="text-neutral-100">Logout</button>
            </form>
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-12">
        <Image
          src="/supabase.svg"
          alt="Supabase Logo"
          width={225}
          height={45}
          priority
        />
        <div className="h-10 rotate-45 border-l"></div>
        <Image
          src="/next.svg"
          alt="Vercel Logo"
          width={150}
          height={36}
          priority
        />
      </div>

      <p className="max-w-2xl mx-auto mt-8 text-3xl text-center text-white">
        The fastest way to get started building apps with{" "}
        <strong>Supabase</strong> and <strong>Next.js</strong>
      </p>

      <div className="flex justify-center mt-12">
        <span className="px-6 py-3 font-mono text-sm rounded-lg bg-neutral-100 text-neutral-900">
          Get started by editing <strong>app/page.tsx</strong>
        </span>
      </div>
    </div>
  );
}
