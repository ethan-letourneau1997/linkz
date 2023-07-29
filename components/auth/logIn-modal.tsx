"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import React from "react";
import { Tabs } from "@mantine/core";
import GoogleButton from "./google-button";

export function LogInModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("");
  const [valid, setValid] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const secondTabRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<string | null>("log-in");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
    }
    if (data) {
      setView("check-email");
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setValid(false);
    }
    if (data) {
      router.refresh();
    }
    // router.push("/");
  };

  function handleSwitchTab() {
    if (activeTab === "log-in") {
      setActiveTab("sign-up");
      secondTabRef.current?.focus();
    } else {
      setActiveTab("log-in");
    }
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 ring-offset-white transition-colors hover:bg-neutral-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-50 dark:ring-offset-neutral-950 dark:hover:bg-neutral-800/80 dark:focus-visible:ring-neutral-800">
        Log In
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab className="w-[50%]" value="log-in">
              Log In
            </Tabs.Tab>
            <Tabs.Tab className="w-[50%]" value="sign-up">
              Sign Up
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="log-in" className="pt-5">
            <form
              className="text-foreground flex w-full flex-1 flex-col justify-center gap-2"
              onSubmit={handleSignIn}
            >
              <label className="text-md" htmlFor="email">
                Email
              </label>
              <Input
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="you@example.com"
              />
              <label className="text-md mt-3" htmlFor="password">
                Password
              </label>
              <Input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
              />
              {!valid && (
                <div className="text-xs text-red-500">
                  Invalid email or password
                </div>
              )}
              <Button className="mt-3">Log In</Button>
            </form>
            <p className="mt-3 text-center text-sm">
              Don&apos;t have an account?
              <button className="ml-1 underline" onClick={handleSwitchTab}>
                Sign Up Now
              </button>
            </p>
            <div className="flex items-center py-4">
              <div className="h-px flex-grow bg-gray-400"></div>
              <span className="flex-shrink px-4 text-sm   text-gray-500">
                OR
              </span>
              <div className="h-px flex-grow bg-gray-400"></div>
            </div>
            <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
          </Tabs.Panel>
          <Tabs.Panel value="sign-up" className="pt-5">
            {view === "check-email" ? (
              <p className="text-foreground text-center">
                Check <span className="font-bold">{email}</span> to continue
                signing up
              </p>
            ) : (
              <>
                <form
                  className="text-foreground flex w-full flex-1 flex-col justify-center gap-2"
                  onSubmit={handleSignUp}
                >
                  <label className="text-md" htmlFor="email">
                    Email
                  </label>
                  <Input
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="you@example.com"
                  />
                  <label className="text-md mt-3" htmlFor="password">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="••••••••"
                  />
                  <Button className="mt-3">Sign Up</Button>
                </form>
                <p className="mt-3 text-center text-sm">
                  Already have an account?
                  <button className="ml-1 underline" onClick={handleSwitchTab}>
                    Log In Now
                  </button>
                </p>
                <div className="flex items-center py-4">
                  <div className="h-px flex-grow bg-gray-400"></div>
                  <span className="flex-shrink px-4 text-sm   text-gray-500">
                    OR
                  </span>
                  <div className="h-px flex-grow bg-gray-400"></div>
                </div>
                <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
              </>
            )}
          </Tabs.Panel>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
