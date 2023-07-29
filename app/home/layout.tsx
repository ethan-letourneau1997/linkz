import PostSelect from "@/components/homepage/post-select";
import { Suspense } from "react";

export default async function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[700px] space-y-3 pt-3">
      <PostSelect />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
