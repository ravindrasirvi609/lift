import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import { getServerSession } from "@/utils/getServerSession";

export const metadata: Metadata = {
  title: "RideShare Connect",
  description:
    "RideShare Connect emphasizes the platform’s core purpose of connecting drivers and passengers for shared rides between cities.",
};
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialSession={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
