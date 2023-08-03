import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { fetchUser } from "@/lib/utils";
import MessageReply from "./message-reply";
import RealtimeMessages from "./realtime-messages";

export const revalidate = 60;

interface FriendChatInterface {
  friendUsername: string;
}

export default async function FriendChat({
  friendUsername,
}: FriendChatInterface) {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase);

  async function getConversation() {
    const { data: friend } = await supabase
      .from("user_profile")
      .select("id")
      .eq("username", friendUsername)
      .single();
    if (friend && user) {
      const { data: conversation, error } = await supabase
        .from("conversation")
        .select()
        .match({ user1: user.id, user2: friend.id })
        .single();

      if (conversation) {
        console.log(conversation);
      }
      if (error) {
        const { data: conversation } = await supabase
          .from("conversation")
          .select()
          .match({ user2: user.id, user1: friend.id })
          .single();

        if (conversation) {
          console.log(conversation);
          const { data: serverMessages } = await supabase
            .from("conversation_messages_view")
            .select()
            .eq("conversation_id", conversation.id);

          return serverMessages;
        }
      }

      if (conversation) {
        const { data: serverMessages } = await supabase
          .from("conversation_messages_view")
          .select()
          .eq("conversation_id", conversation.id);

        return serverMessages;
      } else {
        await supabase
          .from("conversation")
          .insert([{ user1: user.id, user2: friend.id }])
          .select();
      }
    }
  }

  const serverMessages = await getConversation();

  if (user)
    return (
      <div className="mx-auto w-full max-w-2xl bg-neutral-50">
        <RealtimeMessages serverMessages={serverMessages ?? []} user={user} />

        <MessageReply userId={user.id} friendUsername={friendUsername} />
      </div>
    );
}
