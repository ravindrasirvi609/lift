"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AvailableRides from "@/components/AvailableRides";

interface Driver {
  id: string;
  name: string;
  image: string;
  isVerified: boolean;
  rating: number;
}

interface Ride {
  id: string;
  driver: Driver;
  travelTime: string;
  price: number;
  departureTime: string;
  availableSeats: number;
}

interface Filters {
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

const Rides: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get<Ride[]>("/api/search", {
          params: {
            leavingFrom: "Pali",
            destination: "Jodhpur",
            date: "2024-07-02",
            passengerCount: 1,
          },
        });
        setRides(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch rides. Please try again.");
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const filteredRides = rides.filter(
    (ride) =>
      ride.price >= filters.minPrice &&
      ride.price <= filters.maxPrice &&
      ride.driver.rating >= filters.minRating
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );

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
