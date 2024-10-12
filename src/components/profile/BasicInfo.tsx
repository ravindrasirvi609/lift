import React from "react";
import { formatDate } from "../../utils/utils";
import { User } from "@/types/types";
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";

interface BasicInfoProps {
  user: User;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-8">
        <div className="relative w-24 h-24 mr-6">
          <Image
            src={user.profilePicture || "/default-avatar.png"}
            alt={user.fullName}
            layout="fill"
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{user.fullName}</h2>
          <p className="text-lg text-gray-600">
            {user.occupation || "Traveler"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={<FaEnvelope />} label="Email" value={user.email} />
        <InfoItem icon={<FaPhone />} label="Phone" value={user.phoneNumber} />
        <InfoItem
          icon={<FaBirthdayCake />}
          label="Date of Birth"
          value={formatDate(new Date(user.dateOfBirth))}
        />
        <InfoItem icon={<FaVenusMars />} label="Gender" value={user.gender} />
        <InfoItem icon={<FaUser />} label="Username" value={user.username} />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
    <div className="text-2xl text-indigo-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default BasicInfo;
