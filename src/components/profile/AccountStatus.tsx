import { User } from "@/types/types";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaLock,
  FaCrown,
} from "react-icons/fa";

interface AccountStatusProps {
  user: User;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState(user);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/profile/verify-license", {
        requestId: localUser.driverLicense.requestId,
      });

      const updatedUser = response.data.updatedUser;
      setLocalUser(updatedUser);

      if (updatedUser.driverVerificationStatus === "Approved") {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <span className="font-medium text-lg">Not Applied</span>
            <Link href="/driver/verify">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#F96167] to-[#F9D423] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300"
              >
                Apply Now
              </motion.button>
            </Link>
          </motion.div>
        );
      case "Pending":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <span className="font-medium text-lg">Pending Verification</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckStatus}
              disabled={loading}
              className="bg-gradient-to-r from-[#F9D423] to-[#F96167] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Status"}
            </motion.button>
          </motion.div>
        );
      case "Approved":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <span className="font-medium text-lg">Verified Account</span>
            <FaCheckCircle className="text-green-500 text-4xl" />
          </motion.div>
        );
      case "Rejected":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <span className="font-medium text-lg">Verification Rejected</span>
            <Link href="/driver/verify">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#F96167] to-[#F9D423] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300"
              >
                Apply Again
              </motion.button>
            </Link>
          </motion.div>
        );
      default:
        return <span className="font-medium text-lg">Unknown Status</span>;
    }
  };

  const getStatusIcon = () => {
    switch (localUser.driverVerificationStatus) {
      case "Approved":
        return <FaCheckCircle className="text-green-500" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />;
      case "Pending":
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return <FaLock className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-2xl rounded-2xl p-8 hover:shadow-3xl transition-all duration-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Account Status
      </h2>
      <div className="flex flex-col items-center justify-center space-y-6">
        <motion.div
          className="text-6xl mb-4"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {getStatusIcon()}
        </motion.div>
        {renderStatusContent()}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {localUser.isAdmin && (
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 text-[#F96167] font-medium flex items-center justify-center"
        >
          <FaCrown className="text-2xl mr-2" /> Admin Account
        </motion.p>
      )}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Verification approved!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountStatus;
