import { User } from "@/types/types";
import React from "react";
import { FaStar, FaCar, FaRoute } from "react-icons/fa";
import { motion } from "framer-motion";

interface PassengerStatsProps {
  user: User;
}

const PassengerStats: React.FC<PassengerStatsProps> = ({ user }) => {
  const rating = user.isDriver ? user.driverRating : user.passengerRating;
  const totalRides = user.isDriver
    ? user.totalRidesAsDriver
    : user.totalRidesAsTakenPassenger;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#F96167] border-b-2 border-yellow-400 pb-4">
        Ride Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={<FaStar className="text-3xl text-yellow-400" />}
          label="Rating"
          value={rating.toFixed(1)}
          description="out of 5"
        />
        <StatCard
          icon={<FaCar className="text-3xl text-[#F96167]" />}
          label="Total Rides"
          value={totalRides.toString()}
          description="completed"
        />
        <StatCard
          icon={<FaRoute className="text-3xl text-green-500" />}
          label="Distance Traveled"
          value={(user.totalDistanceTraveled || 0).toFixed(2)}
          description="km"
        />
      </div>
    </motion.div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}> = ({ icon, label, value, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center space-y-2"
  >
    <div className="bg-gray-100 p-3 rounded-full mb-2">{icon}</div>
    <p className="text-lg font-medium text-gray-600">{label}</p>
    <p className="text-3xl font-bold text-[#F96167]">{value}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </motion.div>
);

export default PassengerStats;
