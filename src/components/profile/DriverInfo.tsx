import { User } from "@/types/types";
import React, { useState } from "react";
import { FaCar, FaStar, FaRoute, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

interface DriverInfoProps {
  user: User;
}

const DriverInfo: React.FC<DriverInfoProps> = ({ user }) => {
  const [isAvailable, setIsAvailable] = useState(
    user.driverAvailabilityStatus === "Available"
  );

  const handleAvailabilityChange = () => {
    setIsAvailable(!isAvailable);
    // Implement API call to update availability status
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#F96167]">
        Driver Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<FaCar className="text-3xl text-[#F96167]" />}
          label="Vehicle"
          value={`${user.vehicleInfo.make} ${user.vehicleInfo.model} (${user.vehicleInfo.year})`}
        />
        <InfoCard
          icon={<FaStar className="text-3xl text-[#F96167]" />}
          label="Driver Rating"
          value={`${user.driverRating.toFixed(1)} / 5`}
        />
        <InfoCard
          icon={<FaRoute className="text-3xl text-[#F96167]" />}
          label="Total Rides"
          value={user.totalRidesAsDriver.toString()}
        />
        <InfoCard
          icon={<FaMoneyBillWave className="text-3xl text-[#F96167]" />}
          label="Total Earnings"
          value={`₹${user.earnings.toFixed(2)}`}
        />
      </div>
      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-md">
        <span className="text-xl font-semibold text-gray-700">
          Availability Status:
        </span>
        <ToggleSwitch
          checked={isAvailable}
          onChange={handleAvailabilityChange}
        />
      </div>
    </motion.div>
  );
};

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4"
  >
    <div className="bg-[#F9D423] p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
          checked ? "bg-green-400" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <span className="ml-3 text-lg font-medium text-gray-700">
      {checked ? "Available" : "Unavailable"}
    </span>
  </label>
);

export default DriverInfo;
