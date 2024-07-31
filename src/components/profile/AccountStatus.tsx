import { User } from "@/types/types";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";

interface AccountStatusProps {
  user: User;
  onStatusUpdate: (updatedUser: User) => void;
}

const AccountStatus: React.FC<AccountStatusProps> = ({
  user,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState(user);

  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/profile/verify-license", {
        requestId: localUser.driverLicense.requestId,
      });

      const updatedUser = response.data.updatedUser;
      setLocalUser(updatedUser);
      onStatusUpdate(updatedUser);

      if (updatedUser.driverVerificationStatus === "Approved") {
        // You can add a success message here if needed
        console.log("Verification approved!");
      }
    } catch (err) {
      setError("Failed to check verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusContent = () => {
    switch (localUser.driverVerificationStatus) {
      case "Not Applied":
        return (
          <>
            <span className="font-medium">Not Applied</span>
            <Link href="/driver/verify">
              <button className="bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
                Apply Now
              </button>
            </Link>
          </>
        );
      case "Pending":
        return (
          <>
            <span className="font-medium">Pending Verification</span>
            <button
              onClick={handleCheckStatus}
              disabled={loading}
              className="bg-[#F9D423] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </>
        );
      case "Approved":
        return <span className="font-medium">Verified Account</span>;
      case "Rejected":
        return (
          <>
            <span className="font-medium">Verification Rejected</span>
            <Link href="/driver/verify">
              <button className="bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
                Apply Again
              </button>
            </Link>
          </>
        );
      default:
        return <span className="font-medium">Unknown Status</span>;
    }
  };

  const getStatusIcon = () => {
    switch (localUser.driverVerificationStatus) {
      case "Approved":
        return "✅";
      case "Rejected":
        return "❌";
      case "Pending":
        return "⏳";
      default:
        return "🔒";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Account Status</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-3xl mr-2">{getStatusIcon()}</span>
          {renderStatusContent()}
        </div>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      {localUser.isAdmin && (
        <p className="mt-4 text-[#F96167] font-medium flex items-center">
          <span className="text-2xl mr-2">👑</span> Admin Account
        </p>
      )}
    </div>
  );
};

export default AccountStatus;
