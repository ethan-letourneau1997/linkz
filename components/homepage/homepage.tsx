import { Suspense } from "react";

export async function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" max-w-[800px]">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
