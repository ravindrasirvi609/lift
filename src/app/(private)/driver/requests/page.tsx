"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import Loading from "@/components/Loading";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaDollarSign,
  FaCheck,
  FaTimes,
  FaCar,
} from "react-icons/fa";
import Link from "next/link";
import { formatDateWithTime } from "@/utils/utils";
import { useSocket } from "@/app/hooks/useSocket";

interface Location {
  type: string;
  coordinates: [number, number];
  city: string;
  region: string;
  locationId: string;
}

interface Vehicle {
  type: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

interface Ride {
  startLocation: Location;
  endLocation: Location;
  _id: string;
  driver: string;
  vehicle: Vehicle;
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number;
  price: number;
  status: string;
}

interface BookingRequest {
  _id: string;
  ride: Ride;
  passenger: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  driver: string;
  numberOfSeats: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  price: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const DriverRequestsPage = () => {
  const { user } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (user === null) {
      setIsAuthLoading(false);
      router.push("/auth");
    } else if (user && !user.isDriver) {
      setIsAuthLoading(false);
      router.push("/auth");
    } else if (user && user.isDriver) {
      setIsAuthLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await fetch("/api/ride/bookingRide?status=Pending");
        if (response.ok) {
          const data = await response.json();
          console.log("Booking requests:", data);
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

  useEffect(() => {
    if (socket && user) {
      socket.on("booking-status-update", (updatedBooking: BookingRequest) => {
        setBookingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === updatedBooking._id ? updatedBooking : request
          )
        );
      });

      return () => {
        socket.off("booking-status-update");
      };
    }
  }, [socket, user]);

  useEffect(() => {
    if (socket && isConnected && bookingRequests.length > 0) {
      const joinedBookings = new Set();
      bookingRequests.forEach((request) => {
        if (!joinedBookings.has(request._id)) {
          socket.emit("join-ride", request._id);
          joinedBookings.add(request._id);
        }
      });
    }
  }, [socket, isConnected, bookingRequests]);

  if (isAuthLoading || isLoading) {
    return <Loading />;
  }

  if (!user || !user.isDriver) return null;

  const handleRequestAction = async (
    bookingId: string,
    action: "Confirmed" | "Cancelled"
  ) => {
    try {
      const response = await fetch(`/api/ride/bookingRide/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        console.log("updatedBooking", updatedBooking);

        setBookingRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === bookingId ? { ...request, status: action } : request
          )
        );
        alert(`Booking ${action} successfully`);
        console.log("updatedBooking.passenger._id", updatedBooking);

        if (socket && isConnected) {
          socket.emit("booking-action", {
            bookingId,
            action,
            passengerId: updatedBooking.booking.passenger._id,
          });

          alert("Booking-action emitted");
        } else {
          console.log("Socket not connected. Unable to emit booking-action.");
        }
      } else {
        const errorData = await response.json();
        alert(`Action failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
      alert(`An error occurred while ${action} the booking. Please try again.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#F9E795] rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-[#F96167] text-center">
        Booking Requests
      </h1>
      {!isConnected && (
        <p className="text-red-500 text-center mb-4">Connecting to server...</p>
      )}
      {bookingRequests.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No pending booking requests.
        </p>
      ) : (
        <ul className="space-y-6">
          {Array.isArray(bookingRequests) &&
            bookingRequests.map((request) => (
              <li
                key={request._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <FaUser className="text-[#F96167] mr-2" />
                    <span className="font-semibold">
                      <Link
                        href={`/profile/${request.passenger._id}`}
                        className="text-[#F96167] hover:underline"
                      >
                        {request.passenger.firstName}{" "}
                        {request.passenger.lastName}
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <FaDollarSign className="text-[#F96167] mr-2" />
                    <span className="font-bold text-lg">₹{request.price}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-[#F96167] mr-2" />
                    <span>
                      {request?.ride?.startLocation?.city},{" "}
                      {request?.ride?.startLocation?.region}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-[#F96167] mr-2" />
                    <span>
                      {request?.ride?.endLocation?.city},{" "}
                      {request?.ride?.endLocation?.region}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-[#F96167] mr-2" />
                    <span>
                      {formatDateWithTime(
                        new Date(request?.ride?.departureTime)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-[#F96167] mr-2" />
                    <span>{request?.numberOfSeats} seats</span>
                  </div>
                  <div className="flex items-center">
                    <FaCar className="text-[#F96167] mr-2" />
                    <span>
                      {request?.ride?.vehicle?.type}{" "}
                      {request?.ride?.vehicle?.make}{" "}
                      {request?.ride?.vehicle?.model}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaDollarSign className="text-[#F96167] mr-2" />
                    <span>Payment: {request?.paymentStatus}</span>
                  </div>
                </div>
                {request?.status === "Pending" && (
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() =>
                        handleRequestAction(request?._id, "Confirmed")
                      }
                      className="flex items-center bg-[#F9D423] text-[#F96167] px-4 py-2 rounded-full font-semibold transition-colors hover:bg-[#F96167] hover:text-white"
                    >
                      <FaCheck className="mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRequestAction(request._id, "Cancelled")
                      }
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full font-semibold transition-colors hover:bg-red-600"
                    >
                      <FaTimes className="mr-2" />
                      Reject
                    </button>
                  </div>
                )}
                {request.status !== "Pending" && (
                  <p className="mt-4 font-semibold text-right">
                    Status:{" "}
                    <span
                      className={`capitalize ${
                        request.status === "Confirmed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </p>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default withAuth(DriverRequestsPage);
