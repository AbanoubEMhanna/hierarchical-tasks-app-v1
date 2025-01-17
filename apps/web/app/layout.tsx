import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import SessionProvider from "../components/SessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Toaster from "../components/Toaster";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <SessionProvider session={session}>
            {children}
            <Toaster />
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}