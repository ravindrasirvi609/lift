// components/profile/BasicInfo.tsx
import React from "react";
import { formatDate } from "../../utils/utils";
import { User } from "@/types/types";

interface BasicInfoProps {
  user: User;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Email" value={user.email} />
        <InfoItem label="Phone" value={user.phoneNumber} />
        <InfoItem
          label="Date of Birth"
          value={formatDate(new Date(user.dateOfBirth))}
        />
        <InfoItem label="Gender" value={user.gender} />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default BasicInfo;
