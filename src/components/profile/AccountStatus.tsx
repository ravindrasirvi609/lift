import { User } from "@/types/types";
import React from "react";

interface AccountStatusProps {
  user: User;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Account Status</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-3xl mr-2">{user.isVerified ? "✅" : "🔒"}</span>
          <span className="font-medium">
            {user.isVerified ? "Verified Account" : "Unverified Account"}
          </span>
        </div>
        {!user.isVerified && (
          <button className="bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
            Verify Now
          </button>
        )}
      </div>
      {user.isAdmin && (
        <p className="mt-4 text-[#F96167] font-medium flex items-center">
          <span className="text-2xl mr-2">👑</span> Admin Account
        </p>
      )}
    </div>
  );
};

export default AccountStatus;
