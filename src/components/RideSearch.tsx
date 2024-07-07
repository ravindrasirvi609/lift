"use client";
import React, { useState } from "react";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { useRouter } from "next/navigation";

const RideSearch: React.FC = () => {
  const router = useRouter();

  const [leavingFrom, setLeavingFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      leavingFrom,
      destination,
      date,
      passengerCount: passengerCount.toString(),
    });
    router.push(`/search/${searchParams.toString()}`);
  };

  return (
    <section className="bg-gradient-to-r from-[#F9E795] to-[#F9D423] py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-[#333] drop-shadow-lg">
          Find Your Perfect Ride
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutocompleteInput
              placeholder="Leaving From"
              value={leavingFrom}
              onChange={setLeavingFrom}
            />
            <AutocompleteInput
              placeholder="Destination"
              value={destination}
              onChange={setDestination}
            />
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
          <button
            type="submit"
            className="mt-6 w-full bg-[#F96167] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#F73D43] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Search Rides
          </button>
        </form>
      </div>
    </section>
  );
};

export default RideSearch;
