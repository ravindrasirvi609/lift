import React from "react";
import { Ride } from "@/types/types";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCar,
  FaRupeeSign,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface RideHistoryProps {
  rides: Ride[];
  userType: "driver" | "passenger";
}

export const RideHistory: React.FC<RideHistoryProps> = ({
  rides,
  userType,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Recent Rides</h3>
      <div className="space-y-4">
        {rides.map((ride) => (
          <Link href={`/rides/${ride._id}`} key={ride._id}>
            <motion.div
              className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(new Date(ride.departureTime))}</span>
                </div>
                <div className="flex items-center text-green-600 font-semibold">
                  <FaRupeeSign className="mr-1" />
                  <span>{ride.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-red-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium text-gray-800">From</p>
                    <p className="text-gray-600">{ride.startLocation.city}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium text-gray-800">To</p>
                    <p className="text-gray-600">{ride.endLocation.city}</p>
                  </div>
                </div>
              </div>
              {/* <div className="mt-3 flex items-center text-gray-500 text-sm">
                <FaCar className="mr-2" />
                <span>
                  {userType === "driver" ? "Passenger" : "Driver"}:{" "}
                  {ride.otherUserName || "Not available"}
                </span>
              </div> */}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
