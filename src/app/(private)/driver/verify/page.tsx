"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import DocumentVerification from "@/components/DocumentVerification";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

export default function DriverVerifyPage() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  if (!userId) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DocumentVerification userId={userId} />
    </div>
  );
}
