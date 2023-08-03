"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button, Input } from "@supabase/ui";
import { ChangeEvent, useState } from "react";

interface MessageReplyProps {
  userId: string;
  friendUsername: string;
}

export default function MessageReply({
  userId,
  friendUsername,
}: MessageReplyProps) {
  const supabase = createClientComponentClient();

  const [message, setMessage] = useState("");

  const handleSetMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  function handleSendMessage() {
    async function sendMessage() {
      const { data: friend } = await supabase
        .from("user_profile")
        .select()
        .eq("username", friendUsername)
        .single();

      if (friend) {
        const { data: conversation, error } = await supabase
          .from("conversation")
          .select()
          .match({ user1: userId, user2: friend.id })
          .single();

        if (error) {
          const { data: conversation } = await supabase
            .from("conversation")
            .select()
            .match({ user2: userId, user1: friend.id })
            .single();

          if (conversation) {
            const { data, error } = await supabase
              .from("message")
              .insert([
                {
                  sender: userId,
                  conversation: conversation.id,
                  content: message,
                },
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
        }

        if (conversation) {
          const { data, error } = await supabase
            .from("message")
            .insert([
              {
                sender: userId,
                conversation: conversation.id,
                content: message,
              },
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
      }
    }
    sendMessage();
  }

  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full border-t border-gray-200 bg-neutral-300 p-4 shadow dark:border-gray-600 dark:bg-gray-800 md:flex md:h-14 md:items-center md:justify-between">
      <div className="mx-auto flex w-full max-w-2xl items-center space-x-2 px-3">
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
    </footer>
  );
}
