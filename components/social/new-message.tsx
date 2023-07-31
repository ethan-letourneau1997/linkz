"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface NewMessageProps {
  userId: string;
  conversationId: string;
}

export function NewMessage({ userId, conversationId }: NewMessageProps) {
  const supabase = createClientComponentClient(); //

  const [message, setMessage] = useState("");

  const handleSetMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  function handleSendMessage() {
    async function sendMessage() {
      const { data, error } = await supabase
        .from("message")
        .insert([
          { sender: userId, conversation: conversationId, content: message },
        ])
        .select();

      if (error) {
        console.log(error);
      }
      if (data) {
        //clear input
        setMessage("");
      }
    }

    sendMessage();
  }

  return (
    <div className="flex w-full items-center space-x-2">
      <Input
        value={message}
        onChange={handleSetMessage}
        type="text"
        placeholder="reply.."
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
}
