"use client";
import React, { useState } from "react";
import AvailableRides from "@/components/AvailableRides";
import Loading from "./Loading";

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

interface Filters {
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

const Rides: React.FC<Props> = ({ rides, loading, error }) => {
  console.log("RIDES IN RIDE COMPONENT", rides);

  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  // const filteredRides = Array.isArray(rides)
  //   ? rides.filter(
  //       (ride) =>
  //         ride.price >= filters.minPrice &&
  //         ride.price <= filters.maxPrice &&
  //         ride.driver.rating >= filters.minRating
  //     )
  //   : [];

  const filteredRides = rides;

  console.log("FILTERED RIDES", filteredRides);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  if (loading) return <Loading />;

  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;

  return (
    <div className="bg-yellow-50 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-red-600 text-center mb-8">
        Available Rides
      </h1>

      <div className="bg-yellow-200 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Price:
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Price:
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="minRating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Rating:
            </label>
            <input
              type="number"
              id="minRating"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              min="0"
              max="5"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      {filteredRides.length > 0 ? (
        <AvailableRides rides={filteredRides} />
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No rides available matching your criteria.
        </p>
      )}
    </div>
  );
};

export default Rides;
