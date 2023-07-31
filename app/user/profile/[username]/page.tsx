import { UserProfile } from "@/components/user/profile/user-profile";

export interface UsernameIndexProps {
  params: {
    username: string;
  };
}

export default async function Index(context: UsernameIndexProps) {
  const { username } = context.params; // Extract the communityName from params

  return <UserProfile username={username} />;
}
