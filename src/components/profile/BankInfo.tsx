import { User } from "@/types/types";
import React, { useState } from "react";
import {
  FaUniversity,
  FaUserAlt,
  FaCreditCard,
  FaBarcode,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

interface BankInfoProps {
  user: User;
}

const BankInfo: React.FC<BankInfoProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankName: user.bankAccountInfo?.bankName || "",
    accountHolderName: user.bankAccountInfo?.accountHolderName || "",
    accountNumber: user.bankAccountInfo?.accountNumber || "",
    ifscCode: user.bankAccountInfo?.ifscCode || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("/api/profile/update-bank-info", {
        userId: user.id,
        bankAccountInfo: formData,
      });
      setSuccess("Bank information updated successfully!");
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setError("Failed to update bank information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Bank Account Information</h2>
      <div className="space-y-4">
        <InfoItem
          icon={<FaUniversity className="text-2xl text-[#F96167]" />}
          label="Bank Name"
          value={user.bankAccountInfo?.bankName}
        />
        <InfoItem
          icon={<FaUserAlt className="text-2xl text-[#F96167]" />}
          label="Account Holder"
          value={user.bankAccountInfo?.accountHolderName}
        />
        {user?.bankAccountInfo?.accountNumber && (
          <InfoItem
            icon={<FaCreditCard className="text-2xl text-[#F96167]" />}
            label="Account Number"
            value={maskAccountNumber(
              user?.bankAccountInfo?.accountNumber || ""
            )}
          />
        )}
        <InfoItem
          icon={<FaBarcode className="text-2xl text-[#F96167]" />}
          label="IFSC Code"
          value={user.bankAccountInfo?.ifscCode}
        />
      </div>
      <div className="mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300"
        >
          Update Bank Information
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">
                Update Bank Information
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="accountHolderName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="ifscCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  IFSC Code
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167]"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
