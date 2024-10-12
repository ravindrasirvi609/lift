import React from "react";
import { Ride } from "@/types/types";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCar,
  FaRupeeSign,
  FaClock,
  FaRoute,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface RideHistoryProps {
  rides: Ride[];
  userType: "driver" | "passenger";
}

export const RideHistory: React.FC<RideHistoryProps> = ({
  rides,
  userType,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-3xl shadow-2xl"
    >
      <h3 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-yellow-400 pb-4">
        Recent Rides
      </h3>
      <AnimatePresence>
        {rides.map((ride, index) => (
          <motion.div
            key={ride._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/rides/${ride._id}`}>
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg mb-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCalendarAlt className="text-yellow-500" />
                    <span className="font-medium">
                      {formatDate(new Date(ride.departureTime))}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600 font-semibold">
                    <FaRupeeSign />
                    <span>{ride.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <FaMapMarkerAlt className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">From</p>
                      <p className="text-gray-600">
                        {ride.startLocation.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FaMapMarkerAlt className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">To</p>
                      <p className="text-gray-600">
                        {ride.endLocation.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span>Duration: {ride.duration} mins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaRoute />
                    <span>Distance: {ride.distance} km</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
