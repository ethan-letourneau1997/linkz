import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NewMessage } from "./new-message";
import { isoToString } from "@/lib/iso-to-string";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

export async function Chat({ friendUsername }: { friendUsername: string }) {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase); // get user

  async function getFriendId() {
    if (user) {
      const { data: user_profile } = await supabase
        .from("user_profile")
        .select("*")
        .eq("username", friendUsername)
        .limit(1)
        .single();

      if (user_profile) {
        return user_profile.id;
      }
    }
  }

  async function getConversation() {
    if (user && friendId) {
      const { data: conversation } = await supabase
        .from("conversation_messages_view")
        .select("*")
        .eq("user1", friendId)
        .eq("user2", user.id);

      if (conversation && conversation.length > 0) {
        return conversation;
      } else {
        const { data: conversation } = await supabase
          .from("conversation_messages_view")
          .select("*")
          .eq("user2", friendId)
          .eq("user1", user.id);

        return conversation;
      }
    }
  }

  const friendId = await getFriendId();

  const conversation = await getConversation();

  if (user)
    return (
      <div className="w-full max-w-[700px] bg-neutral-50 p-4">
        <div className="w-full text-center text-2xl">{friendUsername}</div>
        <div className="mt-4 space-y-2">
          {conversation &&
            conversation.map((message, index) => {
              // Check if the previous message was sent by the same user
              const isPreviousMessageSameUser =
                index > 0 &&
                conversation[index - 1].message_sender ===
                  message.message_sender;

              return (
                <div key={message.id} className="">
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
                              {isoToString(message.message_created_at)}
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
                              {isoToString(message.message_created_at)}
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
        <div className="mt-4">
          <NewMessage
            userId={user.id}
            conversationId={conversation && conversation[0].conversation_id}
          />
        </div>
      </div>
    );
}
