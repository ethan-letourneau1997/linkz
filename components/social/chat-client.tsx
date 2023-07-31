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
        setMessage("");
        setReRender(reRender + 1);
      }
    }

    sendMessage();
  }

  if (user && conversation)
    return (
      <div className="w-full max-w-[700px] bg-neutral-50 p-4">
        <div className="grid grid-cols-3">
          <div />
          <div className="w-full text-center text-2xl">{friendUsername}</div>
          <Button onClick={() => setReRender(reRender + 1)}>refresh</Button>
        </div>

        <div className="mt-4 space-y-2">
          {conversation &&
            conversation.map((message, index) => {
              // Check if the previous message was sent by the same user
              const isPreviousMessageSameUser =
                index > 0 &&
                conversation[index - 1].message_sender ===
                  message.message_sender;

              return (
                <div key={message.message_id} className="">
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
        </div>
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
