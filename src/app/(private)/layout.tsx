// app/(private)/layout.tsx
import Layout from "@/components/Layout";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
