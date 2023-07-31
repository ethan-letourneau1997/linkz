import { ChatClient } from "@/components/social/chat-client";

interface IndexProps {
  params: {
    friend_username: string;
  };
}

export default async function Index({ params }: IndexProps) {
  return <ChatClient friendUsername={params.friend_username} />;
}
