"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";

export default function CreateCommunity() {
  // user state
  const [user, setUser] = useState(null);
  // community info states
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient();

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

  const handleNameChange = (event) => {
    setCommunityName(event.target.value);
    console.log(communityName);
  };
  console.log(communityName);

  const handleDescriptionChange = (event) => {
    setCommunityDescription(event.target.value);
  };

  // create a new community
  async function handleCreateCommunity() {
    const { data, error } = await supabase
      .from("community")
      .insert([
        {
          community_name: communityName,
          community_description: communityDescription,
          created_by: user!.id,
        },
      ])
      .select();

    console.log(data);

    if (error) console.log(error);
  }

  return (
    <div>
      <p className="mb-4 text-xl font-semibold">New Community</p>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="name">
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
        <label className="block mb-2" htmlFor="description">
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
        className="px-3 py-1 border hover:bg-white hover:text-black"
        onClick={handleCreateCommunity}
      >
        Create
      </button>
    </div>
  );
}
