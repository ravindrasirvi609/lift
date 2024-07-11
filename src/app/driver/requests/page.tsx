"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BookingRequest {
  _id: string;
  ride: {
    _id: string;
    startLocation: string;
    endLocation: string;
    departureTime: string;
  };
  passenger: {
    name: string;
  };
  numberOfSeats: number;
  price: number;
  status: "pending" | "accepted" | "rejected";
}

const DriverRequestsPage = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await fetch("/api/bookings?status=pending");
        if (response.ok) {
          const data = await response.json();
          setBookingRequests(data);
        } else {
          console.error("Failed to fetch booking requests");
        }
      } catch (error) {
        console.error("Error fetching booking requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingRequests();
  }, []);

  const handleRequestAction = async (
    bookingId: string,
    action: "accepted" | "rejected"
  ) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        setBookingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === bookingId ? { ...request, status: action } : request
          )
        );
        alert(`Booking ${action} successfully`);
      } else {
        const errorData = await response.json();
        alert(`Action failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
      alert(`An error occurred while ${action} the booking. Please try again.`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Booking Requests</h1>
      {bookingRequests.length === 0 ? (
        <p>No pending booking requests.</p>
      ) : (
        <ul>
          {bookingRequests.map((request) => (
            <li key={request._id} className="mb-6 p-4 border rounded">
              <p>Passenger: {request.passenger.name}</p>
              <p>From: {request.ride.startLocation}</p>
              <p>To: {request.ride.endLocation}</p>
              <p>
                Departure:{" "}
                {new Date(request.ride.departureTime).toLocaleString()}
              </p>
              <p>Seats Requested: {request.numberOfSeats}</p>
              <p>Total Price: ${request.price}</p>
              {request.status === "pending" && (
                <div className="mt-4">
                  <button
                    onClick={() => handleRequestAction(request._id, "accepted")}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestAction(request._id, "rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
              {request.status !== "pending" && (
                <p className="mt-4 font-semibold">Status: {request.status}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverRequestsPage;
