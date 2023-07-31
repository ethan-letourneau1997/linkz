import { Friends } from "@/components/social/friends";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[900px] gap-5 space-y-3 pt-3">
      <Friends />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
