import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import { getServerSession } from "@/utils/getServerSession";
import Header from "@/components/Headers";
import ApolloWrapper from "@/components/ApolloWrapper";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "RideShare Connect",
  description:
    "RideShare Connect emphasizes the platform’s core purpose of connecting drivers and passengers for shared rides between cities.",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider initialSession={session}>
          <ApolloWrapper>
            {" "}
            <div>
              <Header />
            </div>
            <div className="pt-16">
              <main>{children}</main>
              <Footer />
            </div>
          </ApolloWrapper>{" "}
        </AuthProvider>
      </body>
    </html>
  );
}
