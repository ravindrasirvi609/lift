"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaFlag } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { Location, SearchParams } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface Props {
  onSearch: (params: SearchParams) => void;
}

const RideSearch: React.FC<Props> = ({ onSearch }) => {
  const [departure, setDeparture] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [date, setDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [minDate, setMinDate] = useState(getTodayDate());

  useEffect(() => {
    setMinDate(getTodayDate());
  }, []);

  useEffect(() => {
    setIsFormValid(
      !!departure && !!destination && !!date && passengerCount > 0
    );
  }, [departure, destination, date, passengerCount]);

  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    if (formRef.current) {
      gsap.from(formRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSearch({
        departure: departure!,
        destination: destination!,
        date,
        passengerCount,
      });
    }
  };

  const handleLocationChange =
    (field: "departure" | "destination") =>
    (value: Location & { address: string }) => {
      if (field === "departure") {
        setDeparture(value);
      } else {
        setDestination(value);
      }
    };

  return (
    <section className=" py-20 text-center">
      <div className="container mx-auto px-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <AutocompleteInput
                placeholder="Departure From"
                value={departure?.address || ""}
                onChange={handleLocationChange("departure")}
                aria-label="Departure Location"
                className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F96167]"
              />
            </div>
            <div className="relative">
              <FaFlag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <AutocompleteInput
                placeholder="Destination"
                value={destination?.address || ""}
                onChange={handleLocationChange("destination")}
                aria-label="Destination"
                className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F96167]"
              />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                required
              />
            </div>
            <div className="relative">
              <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                placeholder="Passenger Count"
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                min="1"
                required
              />
            </div>
          </div>
          <AnimatePresence>
            {isFormValid && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 w-full bg-[#F96167] text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-[#F9D423] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Search Rides
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
};

export default RideSearch;
