import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function Social() {
  const supabase = createServerComponentClient({ cookies });
  const user = await fetchUser(supabase); // get user

  async function getFreinds() {
    if (user) {
      const { data: user_user } = await supabase
        .from("user_friends")
        .select("*")
        .eq("user_id", user.id);

      if (user_user) {
        return user_user;
      }
    }
  }

  async function getConversation() {
    if (user && freinds) {
      const { data: conversation } = await supabase
        .from("conversation_messages_view")
        .select("*")
        .eq("user1", freinds[0].friend_id)
        .eq("user2", user.id);

      if (conversation && conversation.length > 0) {
        return conversation;
      } else {
        const { data: conversation } = await supabase
          .from("conversation_messages_view")
          .select("*")
          .eq("user2", freinds[0].friend_id)
          .eq("user1", user.id);

        return conversation;
      }
    }
  }

  const freinds = await getFreinds();

  const conversation = await getConversation();
  console.log(conversation);

  return (
    <div>
      <h1>Social</h1>
      <div className="flex">
        <div className="w-full max-w-[200px]">
          <h1>Freinds</h1>
          {freinds &&
            freinds.map((freind) => {
              return (
                <div key={freind.friend_id}>
                  <h1>{freind.friend_username}</h1>
                </div>
              );
            })}
        </div>
        <div>
          {conversation &&
            conversation.map((message) => {
              return (
                <div key={message.id}>
                  <div>{message.sender_username}</div>
                  <p>{message.message_content}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
