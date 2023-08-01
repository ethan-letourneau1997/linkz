"use client";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RealtimeMessages({
  serverMessages,
}: {
  serverMessages: Database["public"]["Tables"]["message"]["Row"][];
}) {
  const supabase = createClientComponentClient();
  const router = useRouter()

  
  useEffect(() => {
    const channel = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message",
        },
        () => {
          router.refresh()
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);
  return <div>
        {
          serverMessages.map((message) => (
            <div key={message.id}>
              <div>{message.sender}</div>
              <div>{message.content}</div>
            </div>
          ))}

    <pre>{JSON.stringify(serverMessages, null, 2)}</pre>
  </div>;
}
