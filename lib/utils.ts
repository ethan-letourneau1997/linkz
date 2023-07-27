/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchUser(supabase: SupabaseClient<any, "public", any>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
