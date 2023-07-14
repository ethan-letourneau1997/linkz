import Community from "@/components/community/community";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface IndexProps {
  params: {
    communityName: string;
  };
}

export default async function Index({ params }: IndexProps) {
  const communityName = params.communityName; // Extract the communityName from params

  return <Community communityName={communityName} />;
}
