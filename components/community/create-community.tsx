"use client";

import { fetchUser } from "@/lib/utils";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";

export default function CreateCommunity() {
  // user state
  const [user, setUser] = useState<User | null>(null);
  // community info states
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

  // get user
  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(supabase); // get user
      setUser(user);
    };

    getUser();
  }, [supabase]);

  const handleNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommunityName(event.target.value);
  };

  const handleDescriptionChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setCommunityDescription(event.target.value);
  };

  // create a new community
  async function handleCreateCommunity() {
    if (user) {
      const { error } = await supabase
        .from("community")
        .insert([
          {
            community_name: communityName,
            community_description: communityDescription,
            creator_user_id: user.id,
          },
        ])
        .select();

      if (error) return;
    }
  }

  return (
    <div>
      <p className="mb-4 text-xl font-semibold">New Community</p>
      <div className="mb-4">
        <label className="mb-2 block" htmlFor="name">
          Community Name
        </label>
        <input
          className="text-black"
          id="name"
          type="text"
          value={communityName}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block" htmlFor="description">
          Community Description
        </label>
        <input
          className="text-black"
          id="description"
          type="text"
          value={communityDescription}
          onChange={handleDescriptionChange}
        />
      </div>
      <button
        className="border px-3 py-1 hover:bg-white hover:text-black"
        onClick={handleCreateCommunity}
      >
        Create
      </button>
    </div>
  );
}
