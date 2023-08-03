import FriendChat from "@/components/social/friend-chat";
import { FriendSettings } from "@/components/social/friend-settings";

interface ConversationInterface {
  params: {
    friend_username: string;
  };
}

export default async function Conversation({ params }: ConversationInterface) {
  return (
    <>
      <FriendSettings friendUsername={params.friend_username} />
      <FriendChat friendUsername={params.friend_username} />
    </>
  );
}
