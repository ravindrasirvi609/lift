"use client";
import React from "react";
import AvailableRides from "@/components/AvailableRides";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading";
import { Ride } from "@/types/types";
import { FaCar, FaSadTear } from "react-icons/fa";

interface Props {
  rides: Ride[];
  loading: boolean;
  error: string | null;
}

const Rides: React.FC<Props> = ({ rides, loading, error }) => {
  if (loading) return <Loading />;

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto mt-8"
      >
        <FaSadTear className="text-5xl text-[#F96167] mx-auto mb-4" />
        <p className="text-[#F96167] text-lg font-semibold mb-2">
          Oops! Something went wrong
        </p>
        <p className="text-gray-600">{error}</p>
      </motion.div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="bg-[#F96167] text-white p-6">
          <h2 className="text-3xl font-bold flex items-center justify-center">
            <FaCar className="mr-2" /> Available Rides
          </h2>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {rides.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AvailableRides rides={rides} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-[#F96167] p-6 rounded-lg"
              >
                <FaCar className="text-6xl mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-4">
                  No rides available at the moment.
                </p>
                <p className="mb-6 text-gray-600">
                  Check back later for new rides!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Rides;
