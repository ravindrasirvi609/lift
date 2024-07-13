"use client";
import React, { useState } from "react";
import AvailableRides from "@/components/AvailableRides";
import { motion } from "framer-motion";

export interface Ride {
  _id: string;
  driver: {
    _id: string;
    name: string;
    image: string;
    isVerified: boolean;
    rating: number;
  };
  vehicle: string;
  startLocation: {
    coordinates: [number, number];
    city: string;
    region: string;
    locationId: string;
  };
  endLocation: {
    coordinates: [number, number];
    city: string;
    region: string;
    locationId: string;
  };
  startAddress: string;
  endAddress: string;
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number;
  price: number;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

interface Props {
  rides: Ride[];
  loading: boolean;
  error: string | null;
}

const Slider = ({ value, onChange, min, max, step }: any) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-[#F9E795] rounded-md appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, #F96167 0%, #F96167 ${
          ((value - min) / (max - min)) * 100
        }%, #F9E795 ${((value - min) / (max - min)) * 100}%, #F9E795 100%)`,
      }}
    />
  );
};

const Rides: React.FC<Props> = ({ rides, loading, error }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rating, setRating] = useState(0);

  // const filteredRides = rides.filter(
  //   (ride) =>
  //     ride.price >= priceRange[0] &&
  //     ride.price <= priceRange[1] &&
  //     ride.driver.rating >= rating
  // );

  const filteredRides = rides;

  if (loading) return <Loading />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-[#F9E795] min-h-screen p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-[#F96167] text-center mb-8"
      >
        Available Rides
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#F9D423] p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">Filters</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex space-x-4">
              <Slider
                value={priceRange[0]}
                onChange={(value: any) => setPriceRange([value, priceRange[1]])}
                min={0}
                max={1000}
                step={10}
              />
              <Slider
                value={priceRange[1]}
                onChange={(value: any) => setPriceRange([priceRange[0], value])}
                min={0}
                max={1000}
                step={10}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating: {rating.toFixed(1)}
            </label>
            <Slider
              value={rating}
              onChange={setRating}
              min={0}
              max={5}
              step={0.1}
            />
          </div>
        </div>
      </motion.div>

      {filteredRides.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AvailableRides rides={filteredRides} />
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-[#F96167] text-lg bg-[#F9E795] p-4 rounded-lg shadow"
        >
          No rides available matching your criteria. Try adjusting your filters!
        </motion.p>
      )}
    </div>
  );
};

const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-[#F9E795]">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#F96167]"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen bg-[#F9E795]">
    <div className="bg-[#F96167] text-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Error</h2>
      <p>{message}</p>
    </div>
  </div>
);

export default Rides;
