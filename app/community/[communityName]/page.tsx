import Community from "@/components/community/community";
import dynamic from "next/dynamic.js";
import { Suspense } from "react";

interface IndexProps {
  params: {
    communityName: string;
  };
}

export default function Index(context: IndexProps) {
  const { communityName } = context.params; // Extract the communityName from params

  return <Community communityName={communityName} />;
}
