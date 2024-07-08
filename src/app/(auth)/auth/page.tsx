"use client";
import SignIn from "@/components/signin";
import React, { useState } from "react";

const AuthPage: React.FC = () => {
  const [userType, setUserType] = useState<"user" | "vehicle-owner">("user");

  const handleSwitch = () => {
    setUserType(userType === "user" ? "vehicle-owner" : "user");
  };

  return <SignIn userType={userType} onSwitch={handleSwitch} />;
};

export default AuthPage;
