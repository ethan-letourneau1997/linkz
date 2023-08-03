"use client";
import { Database } from "@/types/supabase";
import { Button } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RealTimesMessagesProps {
  serverMessages: Database["public"]["Views"]["conversation_messages_view"]["Row"][];
  user: User;
}

export default function RealtimeMessages({
  serverMessages,
  user,
}: RealTimesMessagesProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const { scrollIntoView, targetRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >();

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
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  useEffect(() => {
    scrollIntoView();
  }, [serverMessages]);

  const [displayCount, setDisplayCount] = useState(10);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const displayedConversation = serverMessages.slice(
    Math.max(serverMessages.length - displayCount, 0),
  );

  return (
    <div className=" space-y-2 px-3">
      {serverMessages.length > displayCount && (
        <div className=" mt-3 flex justify-center">
          <Button
            className=" bg-neutral-800 p-1"
            size="medium"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
      {displayedConversation.map((message, index) => {
        // Check if the previous message was sent by the same user
        const isPreviousMessageSameUser =
          index > 0 &&
          displayedConversation[index - 1].message_sender ===
            message.message_sender;

        return (
          <div key={message.message_id}>
            {message.message_sender === user.id ? (
              <div className="ml-auto max-w-[350px]">
                {!isPreviousMessageSameUser && (
                  <div className="text-sm">{message.sender_username}</div>
                )}
                <div className=" rounded-md bg-green-400 px-3 py-2">
                  <div>{message.message_content}</div>
                </div>
              </div>
            ) : (
              <div className="max-w-[350px] ">
                {!isPreviousMessageSameUser && (
                  <div className="text-sm">{message.sender_username}</div>
                )}
                <div className="rounded-md bg-blue-400 px-3 py-2">
                  <div>{message.message_content}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={targetRef} />
    </div>
  );
}
