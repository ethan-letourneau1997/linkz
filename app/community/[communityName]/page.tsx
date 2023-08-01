import Community from "@/components/community/community";

export interface CommunityIndexProps {
  params: {
    communityName: string;
  };
}

export default async function Index(context: CommunityIndexProps) {
  const { communityName } = context.params; // Extract the communityName from params

  return <Community communityName={communityName} />;
}
