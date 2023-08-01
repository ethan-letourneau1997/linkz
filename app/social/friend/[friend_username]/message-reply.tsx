"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button, Input } from "@supabase/ui";
import { ChangeEvent, useState } from "react";

interface MessageReplyProps {
  userId: string;
  conversationId: number;
}

export default function MessageReply({
  userId,
  conversationId,
}: MessageReplyProps) {
  const supabase = createClientComponentClient();
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
    <div className="flex w-full items-center space-x-2 px-3">
      <Input
        value={message}
        onChange={handleSetMessage}
        type="text"
        placeholder="reply.."
        className="flex-grow"
      />
      <Button size="large" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
}
