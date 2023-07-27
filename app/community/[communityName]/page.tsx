import Community from "@/components/community/community";

interface IndexProps {
  params: {
    communityName: string;
  };
}

export default function Index(context: IndexProps) {
  const { communityName } = context.params; // Extract the communityName from params

  return <Community communityName={communityName} />;
}
