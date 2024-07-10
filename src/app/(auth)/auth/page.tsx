"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import Loading from "@/components/Loading";
import SignIn from "@/components/signin";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthPage: React.FC = () => {
  const [userType, setUserType] = useState<"user" | "vehicle-owner">("user");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div>
        {" "}
        <Loading />{" "}
      </div>
    );
  }

  if (user) {
    return null; // This will briefly show while redirecting
  }

  const handleSwitch = () => {
    setUserType(userType === "user" ? "vehicle-owner" : "user");
  };

  return <SignIn userType={userType} onSwitch={handleSwitch} />;
};

export default AuthPage;
