import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RealtimeMessages from "./realtime-messages";
import { fetchUser } from "@/lib/utils";
import MessageReply from "./message-reply";

export const revalidate = 60;

interface ConversationInterface {
  params: {
    friend_username: string;
  };
}

export default async function Conversation({
  params: { friend_username },
}: ConversationInterface) {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase);

  async function getConversation() {
    const { data: friend } = await supabase
      .from("user_profile")
      .select("id")
      .eq("username", friend_username)
      .single();
    if (friend) {
      const { data: conversation } = await supabase
        .from("conversation")
        .select()
        .or(`user1.eq.${friend.id},user2.eq.${friend.id}`)
        .single();

      if (conversation) {
        const { data: serverMessages } = await supabase
          .from("conversation_messages_view")
          .select()
          .eq("conversation_id", conversation.id);

        return serverMessages;
      }
    }
  }

  const serverMessages = await getConversation();

  if (user)
    return (
      <div className="w-full max-w-3xl bg-neutral-50">
        <RealtimeMessages serverMessages={serverMessages ?? []} user={user} />
        <div className="bg-neutral-400 py-3">
          <MessageReply userId={user.id} conversationId={1} />
        </div>
      </div>
    );
}
