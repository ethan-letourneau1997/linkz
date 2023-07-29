import { PublicProfile } from "@/components/user/profile/public-profile";

export interface UsernameIndexProps {
  params: {
    username: string;
  };
}

export default async function Index(context: UsernameIndexProps) {
  const { username } = context.params; // Extract the communityName from params

  return <PublicProfile username={username} />;
}
