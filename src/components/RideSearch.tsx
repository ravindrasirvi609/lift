"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { Location, SearchParams } from "@/types/types";
import { motion } from "framer-motion";
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

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [minDate, setMinDate] = useState(getTodayDate());

  useEffect(() => {
    setMinDate(getTodayDate());
  }, []);

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
    if (departure && destination) {
      onSearch({
        departure,
        destination,
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
    <section className="py-20 text-center">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-[#F96167] drop-shadow-lg"
        >
          Find Your Perfect Ride
        </motion.h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutocompleteInput
              placeholder="Departure From"
              value={departure?.address || ""}
              onChange={handleLocationChange("departure")}
              aria-label="Departure Location"
            />
            <AutocompleteInput
              placeholder="Destination"
              value={destination?.address || ""}
              onChange={handleLocationChange("destination")}
              aria-label="Destination"
            />
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
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full bg-[#F96167] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#F9D423] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Search Rides
          </motion.button>
        </form>
      </div>
    </section>
  );
};

export default RideSearch;
