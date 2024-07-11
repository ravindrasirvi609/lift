// app/book/[rideId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Ride {
  _id: string;
  driver: {
    name: string;
    rating: number;
  };
  vehicle: string;
  startLocation: string;
  endLocation: string;
  departureTime: string;
  availableSeats: number;
  price: number;
}

const BookRidePage = () => {
  const params = useParams();
  const router = useRouter();
  const [ride, setRide] = useState<Ride | null>(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`/api/rides/${params.rideId}`);
        if (response.ok) {
          const data = await response.json();
          setRide(data);
        } else {
          console.error("Failed to fetch ride");
        }
      } catch (error) {
        console.error("Error fetching ride:", error);
      }
    };

    if (params.rideId) {
      fetchRide();
    }
  }, [params.rideId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rideId: { RideId: params.rideId },
          numberOfSeats,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Booking request sent successfully!");
        router.push(`/bookings/${data.booking._id}`);
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!ride) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Book Your Ride</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Ride Details</h2>
        <p>
          Driver: {ride.driver.name} (Rating: {ride.driver.rating})
        </p>
        <p>Vehicle: {ride.vehicle}</p>
        <p>From: {ride.startLocation}</p>
        <p>To: {ride.endLocation}</p>
        <p>Departure: {new Date(ride.departureTime).toLocaleString()}</p>
        <p>Available Seats: {ride.availableSeats}</p>
        <p>Price per seat: ${ride.price}</p>
      </div>
      <form onSubmit={handleBooking}>
        <div className="mb-4">
          <label htmlFor="seats" className="block mb-2">
            Number of Seats
          </label>
          <input
            type="number"
            id="seats"
            value={numberOfSeats}
            onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
            min="1"
            max={ride.availableSeats}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Sending Request..." : "Send Booking Request"}
        </button>
      </form>
    </div>
  );
};

export default BookRidePage;
