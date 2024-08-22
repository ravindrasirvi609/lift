// components/profile/BasicInfo.tsx
import React from "react";
import { formatDate } from "../../utils/utils";
import { User } from "@/types/types";
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";

interface BasicInfoProps {
  user: User;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<FaEnvelope />} label="Email" value={user.email} />
        <InfoItem icon={<FaPhone />} label="Phone" value={user.phoneNumber} />
        <InfoItem
          icon={<FaBirthdayCake />}
          label="Date of Birth"
          value={formatDate(new Date(user.dateOfBirth))}
        />
        <InfoItem icon={<FaVenusMars />} label="Gender" value={user.gender} />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <div className="text-xl text-blue-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default BasicInfo;
