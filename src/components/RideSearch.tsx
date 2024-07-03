"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";

const RideSearch: React.FC = () => {
  const [leavingFrom, setLeavingFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //     router.push(
    //       `/search-results?leavingFrom=${leavingFrom}&destination=${destination}&date=${date}&passengerCount=${passengerCount}`
    //     );
  };

  return (
    <section className="bg-[#F9E795] py-20 text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Find Your Ride</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Leaving From"
            value={leavingFrom}
            onChange={(e) => setLeavingFrom(e.target.value)}
            className="p-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="p-2 rounded border"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded border"
            required
          />
          <input
            type="number"
            placeholder="Passenger Count"
            value={passengerCount}
            onChange={(e) => setPassengerCount(Number(e.target.value))}
            className="p-2 rounded border"
            min="1"
            required
          />
          <button
            type="submit"
            className="bg-[#F96167] text-white py-2 px-4 rounded"
          >
            Search Rides
          </button>
        </form>
      </div>
    </section>
  );
};

export default RideSearch;
