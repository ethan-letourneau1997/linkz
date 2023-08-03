import "./globals.css";

import { IBM_Plex_Sans } from "next/font/google";

import { NavHeader } from "@/components/navigation/nav-header";

import { Suspense } from "react";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plex.className}`}>
      <body className="min-h-screen overscroll-auto bg-neutral-300 dark:bg-neutral-950">
        <div className="view sticky top-0 z-50 w-screen">
          {/* <NavigationMenuDemo /> */}
          <NavHeader />
        </div>

        <main className="mb-3 flex flex-col items-center ">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}
