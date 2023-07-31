"use client";

import { fetchUser } from "@/lib/utils";
import { ConversationMessages } from "@/types/types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { isoToString } from "@/lib/iso-to-string";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useScrollIntoView } from "@mantine/hooks";

interface ChatClientProps {
  friendUsername: string;
}

// render chat
export function ChatClient({ friendUsername }: ChatClientProps) {
  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies
  const [user, setUser] = useState<User>();
  const [friendId, setFriendId] = useState<string>();
  const [conversation, setConversation] = useState<ConversationMessages[]>();
  const [message, setMessage] = useState("");
  const [reRender, setReRender] = useState(1);
  const [refreshSpin, setRefreshSpin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(supabase); // get user
      if (user) setUser(user);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    async function getFriendId() {
      if (user) {
        const { data: user_profile } = await supabase
          .from("user_profile")
          .select("*")
          .eq("username", friendUsername)
          .limit(1)
          .single();

        if (user_profile) {
          setFriendId(user_profile.id);
        }
      }
    }
    getFriendId();
  }, [user]);

  useEffect(() => {
    async function getConversation() {
      if (user && friendId) {
        const { data: conversation } = await supabase
          .from("conversation_messages_view")
          .select("*")
          .eq("user1", friendId)
          .eq("user2", user.id);

        if (conversation && conversation.length > 0) {
          setConversation(conversation);
          setRefreshSpin(false);
        } else {
          const { data: conversation } = await supabase
            .from("conversation_messages_view")
            .select("*")
            .eq("user2", friendId)
            .eq("user1", user.id);

          if (conversation) {
            console.log(conversation);
          }

          if (conversation && conversation.length > 0) {
            setConversation(conversation);
            setRefreshSpin(false);
          }
        }
      }
    }
    getConversation();
  }, [friendId, reRender]);

  // track message state
  const handleSetMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // send message
  function handleSendMessage() {
    async function sendMessage() {
      const { data, error } = await supabase
        .from("message")
        .insert([
          {
            sender: user!.id,
            conversation: conversation![0].conversation_id,
            content: message,
          },
        ])
        .select();

      if (error) {
        console.log(error);
      }
      if (data) {
        //clear input
        setRefreshSpin(true);
        setMessage("");
        setReRender(reRender + 1);
      }
    }

    sendMessage();
  }

  // refresh button
  function handleRefresh() {
    setReRender(reRender + 1);
    setRefreshSpin(!refreshSpin);
  }

  if (user && conversation)
    return (
      <div className="w-full max-w-[700px] bg-neutral-50 p-4">
        <div className="grid grid-cols-3">
          <div />
          <div className="w-full text-center text-2xl">{friendUsername}</div>
          <div className="ml-auto self-center">
            <RefreshButton
              handleRefresh={handleRefresh}
              refreshSpin={refreshSpin}
            />
          </div>
        </div>

        <Conversation user={user} conversation={conversation} />

        <div className="mt-4 flex w-full items-center space-x-2">
          <Input
            value={message}
            onChange={handleSetMessage}
            type="text"
            placeholder="reply.."
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    );
}

interface RefreshButtonProps {
  handleRefresh: () => void;
  refreshSpin: boolean;
}

function RefreshButton({ handleRefresh, refreshSpin }: RefreshButtonProps) {
  return (
    <svg
      onClick={handleRefresh}
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${refreshSpin ? "animate-spin" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface ConversationProps {
  user: User;
  conversation: ConversationMessages[];
}

function Conversation({ user, conversation }: ConversationProps) {
  const [displayCount, setDisplayCount] = useState(20);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  useEffect(() => {
    scrollIntoView();
  }, [conversation]);

  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >();

  if (user && conversation) {
    const displayedConversation = conversation.slice(
      Math.max(conversation.length - displayCount, 0),
    );

    return (
      <div
        ref={scrollableRef}
        className="mt-4 max-h-[500px] space-y-2 overflow-y-scroll"
      >
        {conversation.length > displayCount ? (
          <Button onClick={handleLoadMore}>Load More</Button>
        ) : null}
        {displayedConversation.map((message, index) => {
          // Check if the previous message was sent by the same user
          const isPreviousMessageSameUser =
            index > 0 &&
            conversation[index - 1].message_sender === message.message_sender;

          return (
            <div key={message.message_id}>
              {!isPreviousMessageSameUser && (
                <div className="text-sm">
                  {message.message_sender === user.id ? (
                    <div className="mr-auto max-w-[300px]">
                      {message.sender_username}
                    </div>
                  ) : (
                    <div className="ml-auto max-w-[300px] ">
                      {message.sender_username}
                    </div>
                  )}
                </div>
              )}
              {message.message_sender === user.id ? (
                <div className="mr-auto max-w-[300px]">
                  <div className="flex justify-between gap-1 rounded-md bg-blue-200 px-2 py-1">
                    <div>{message.message_content}</div>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className=" w-fit">
                          <AiOutlineInfoCircle className="text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {isoToString(message.message_created_at!)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ) : (
                <div className="ml-auto max-w-[300px] ">
                  <div className="flex justify-between gap-1 rounded-md bg-green-200 px-2 py-1">
                    <div>{message.message_content}</div>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="w-fit">
                          <AiOutlineInfoCircle className="text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {isoToString(message.message_created_at!)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

  return null; // Return null if either user or conversation is not available
}
