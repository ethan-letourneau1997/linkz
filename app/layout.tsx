import "./globals.css";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Inter } from "next/font/google";
import { IBM_Plex_Sans } from "next/font/google";

import { NavHeader } from "@/components/navigation/nav-header";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // get supabase
  const supabase = createServerComponentClient({ cookies });

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`dark ${plex.className}`}>
      <body className="min-h-screen dark:bg-neutral-950 ">
        <div className="absolute w-screen view">
          <NavHeader />
        </div>

        <main className="flex flex-col items-center px-5 pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
