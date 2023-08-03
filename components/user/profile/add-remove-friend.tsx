"use client";

import { Button } from "@/components/ui/button";
import { fetchUser } from "@/lib/utils";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export function AddRemoveFriend() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(supabase); // get user
      if (user) setUser(user);
    };

    getUser();
  }, [supabase]);

  if (user)
    return (
      <div className="my-auto">
        <Button className="bg-neutral-600 hover:bg-neutral-400">
          Add Friend
        </Button>
        <div>{user.id}</div>
      </div>
    );
}
