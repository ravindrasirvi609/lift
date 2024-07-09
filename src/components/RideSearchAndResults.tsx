"use client";
import React, { useState, useEffect } from "react";
import RideSearch from "./RideSearch";
import axios from "axios";
import Rides from "./Ride";
import { Ride, SearchParams } from "@/types/types";

const RideSearchAndResults: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      fetchRides(searchParams);
    }
  }, [searchParams]);

  const fetchRides = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Ride[]>("/api/search", {
        params: {
          startLocation: params.departure,
          endLocation: params.destination,
          departureTime: params.date,
          availableSeats: params.passengerCount,
        },
      });
      setRides(response.data);
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
    <div>
      <RideSearch onSearch={handleSearch} />
      {searchParams ? (
        <Rides rides={rides} loading={loading} error={error} />
      ) : (
        <div className="text-center mt-8">Search for rides to see results</div>
      )}
    </div>
  );
};

export default RideSearchAndResults;
