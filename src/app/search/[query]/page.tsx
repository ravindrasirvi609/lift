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
        setRides(rides);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ backgroundColor: "#F9E795", padding: "20px" }}>
      <h1 style={{ color: "#F96167", textAlign: "center" }}>Available Rides</h1>

      <div
        style={{
          backgroundColor: "#F9D423",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Filters</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <label htmlFor="minPrice">Min Price:</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="maxPrice">Max Price:</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="minRating">Min Rating:</label>
            <input
              type="number"
              id="minRating"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {filteredRides.length > 0 ? (
        <AvailableRides rides={filteredRides} />
      ) : (
        <p>No rides available matching your criteria.</p>
      )}
    </div>
  );
};

export default Rides;
