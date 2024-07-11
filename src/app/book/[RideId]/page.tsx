"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Ride } from "@/types/types";

const BookRidePage = () => {
  const rideId = useParams();
  console.log(rideId.RideId);

  const [ride, setRide] = useState<Ride | null>(null);

  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchRide = async () => {
      const response = await fetch(`/api/ride/${rideId.RideId}`);
      const data = await response.json();
      setRide(data);
    };

    fetchRide();
  }, [rideId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/ride/bookingRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rideId,
          numberOfSeats: seats,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Booking successful!");
        // Redirect to a confirmation page or back to available rides
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking. Please try again.");
    }
  };

  if (!ride) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Book Your Ride</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Ride Details</h2>
        <p>From: {ride.startLocation.city}</p>
        <p>To: {ride.endLocation.city}</p>
        <p>Departure: {new Date(ride.departureTime).toLocaleString()}</p>
        <p>Price: {ride.price}</p>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        onClick={handleSubmit}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookRidePage;
