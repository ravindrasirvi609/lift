import { User } from "@/types/types";
import React, { useState } from "react";
import {
  FaUniversity,
  FaUserAlt,
  FaCreditCard,
  FaBarcode,
  FaTimes,
  FaPencilAlt,
} from "react-icons/fa";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#F96167] border-b-2 border-yellow-400 pb-4 flex items-center">
        <FaUniversity className="mr-3" /> Bank Account Information
      </h2>
      <div className="space-y-6">
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
      <div className="mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F96167] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300 flex items-center justify-center w-full md:w-auto"
        >
          <FaPencilAlt className="mr-2" /> Update Bank Information
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#F96167]">
                  Update Bank Information
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  id="bankName"
                  name="bankName"
                  label="Bank Name"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  icon={<FaUniversity className="text-[#F96167]" />}
                />
                <InputField
                  id="accountHolderName"
                  name="accountHolderName"
                  label="Account Holder Name"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  icon={<FaUserAlt className="text-[#F96167]" />}
                />
                <InputField
                  id="accountNumber"
                  name="accountNumber"
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  icon={<FaCreditCard className="text-[#F96167]" />}
                />
                <InputField
                  id="ifscCode"
                  name="ifscCode"
                  label="IFSC Code"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  icon={<FaBarcode className="text-[#F96167]" />}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#F96167] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Updating..." : "Update"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center bg-white p-4 rounded-2xl shadow-md"
  >
    <div className="mr-4 bg-gray-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-800">{value || "Not provided"}</p>
    </div>
  </motion.div>
);

const InputField: React.FC<{
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}> = ({ id, name, label, value, onChange, icon }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167] transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        required
      />
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
