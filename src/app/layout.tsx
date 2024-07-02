import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare Connect",
  description:
    "RideShare Connect emphasizes the platform’s core purpose of connecting drivers and passengers for shared rides between cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter">
        <main className="min-h-screen bg-gray-100">{children}</main>
      </body>{" "}
    </html>
  );
}
