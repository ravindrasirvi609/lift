"use client";

import React, { useEffect } from "react";
import Header from "@/components/Headers";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAuth } from "@/app/contexts/AuthContext";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { user, isLoading, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (isLoading || !isInitialized) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
