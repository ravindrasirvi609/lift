"use client";
import React, { useState, useEffect, useRef } from "react";
import RideSearch from "./RideSearch";
import axios from "axios";
import { Ride, SearchParams } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Rides from "./Ride";
import { useGSAP } from "@gsap/react";
import { FaSearch, FaCar } from "react-icons/fa";

const RideSearchAndResults: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (componentRef.current) {
      gsap.from(componentRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, []);

  useEffect(() => {
    if (searchParams) {
      fetchRides(searchParams);
    }
  }, [searchParams]);

  const fetchRides = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    const payload = {
      startLocation: params.departure,
      endLocation: params.destination,
      departureTime: params.date,
      availableSeats: params.passengerCount,
    };
    try {
      const response = await axios.post("/api/ride/rideSearch", {
        payload,
      });
      setRides(response.data.rides);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setError("Failed to fetch rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  return (
    <div
      ref={componentRef}
      className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423] py-12 px-4 sm:px-6 lg:px-8"
      id="rideSearch"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-[#F96167] flex items-center justify-center">
          <FaSearch className="mr-4" /> Find Your Ride
        </h1>
        <RideSearch onSearch={handleSearch} />
      </motion.div>
      <AnimatePresence>
        {searchParams ? (
          <motion.div
            key="rides"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <Rides rides={rides} loading={loading} error={error} />
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12 p-8 bg-white rounded-lg shadow-lg"
          >
            <FaCar className="text-6xl text-[#F96167] mx-auto mb-4" />
            <p className="text-2xl font-semibold text-[#F96167] mb-2">
              Ready to go?
            </p>
            <p className="text-gray-600">
              Search for rides to see available options
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RideSearchAndResults;
