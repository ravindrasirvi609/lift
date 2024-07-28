import { User } from "@/types/types";
import React from "react";
import {
  FaUniversity,
  FaUserAlt,
  FaCreditCard,
  FaBarcode,
} from "react-icons/fa";

interface BankInfoProps {
  user: User;
}

const BankInfo: React.FC<BankInfoProps> = ({ user }) => {
  const { bankAccountInfo } = user;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Bank Account Information</h2>
      <div className="space-y-4">
        <InfoItem
          icon={<FaUniversity className="text-2xl text-[#F96167]" />}
          label="Bank Name"
          value={bankAccountInfo?.bankName}
        />
        <InfoItem
          icon={<FaUserAlt className="text-2xl text-[#F96167]" />}
          label="Account Holder"
          value={bankAccountInfo?.accountHolderName}
        />
        {/* <InfoItem
          icon={<FaCreditCard className="text-2xl text-[#F96167]" />}
          label="Account Number"
          value={maskAccountNumber(bankAccountInfo?.accountNumber)}
        /> */}
        <InfoItem
          icon={<FaBarcode className="text-2xl text-[#F96167]" />}
          label="IFSC Code"
          value={bankAccountInfo?.ifscCode}
        />
      </div>
      <div className="mt-6">
        <button className="bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
          Update Bank Information
        </button>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const maskAccountNumber = (accountNumber: string): string => {
  const visibleDigits = 4;
  const maskedPortion = accountNumber
    .slice(0, -visibleDigits)
    .replace(/./g, "*");
  const visiblePortion = accountNumber.slice(-visibleDigits);
  return maskedPortion + visiblePortion;
};

export default BankInfo;
