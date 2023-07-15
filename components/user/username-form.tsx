"use client";
import { SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";

interface UsernameForm {
  userId: string;
}

export function UsernameForm({ userId }: UsernameForm) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [userInput, setUserInput] = useState("");

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserInput(event.target.value);
  };

  function handleUserSubmit() {
    async function Submit() {
      const { data, error } = await supabase
        .from("profile")
        .insert([{ id: userId, user_name: userInput }])
        .select();
    }
    Submit();
  }

  return (
    <div>
      <p className="text-lg">
        Welcome! Just a few more steps to set up your profile!
      </p>
      <p className="mt-5">Choose your username!</p>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
        <Label htmlFor="username">Username</Label>
        <Input
          className="text-black"
          type="username"
          id="username"
          placeholder="Jeff24"
          value={userInput}
          onChange={handleInputChange}
        />
        <Button className="mt-4" onClick={handleUserSubmit}>
          Create User
        </Button>
      </div>
    </div>
  );
}
