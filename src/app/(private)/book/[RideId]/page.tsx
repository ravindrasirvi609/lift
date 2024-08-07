"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { useAuth } from "@/app/contexts/AuthContext";
import Loading from "@/components/Loading";
import { Ride } from "@/types/types";
import {
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRupeeSign,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDateWithTime } from "@/utils/utils";
import { useSocket } from "@/app/hooks/useSocket";

const BookRidePage = () => {
  const { user } = useAuth();
  const params = useParams();
  const { RideId } = params;
  const router = useRouter();
  const [ride, setRide] = useState<Ride | null>(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { socket, isConnected, sendNotification } = useSocket(user?.id);

  useEffect(() => {
    if (user === null) {
      router.push("/auth");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`/api/ride/${RideId}`);
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

    if (RideId) {
      fetchRide();
    }
  }, [RideId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/ride/bookingRide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId: RideId, numberOfSeats }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          "Booking request sent successfully! Please wait for confirmation."
        );

        if (socket && isConnected && ride) {
          socket.emit("join-ride", RideId);

          // Send notification to driver
          const notificationMessage = `New booking request from ${user?.firstName} ${user?.lastName} for ${numberOfSeats} seat(s).`;
          sendNotification(ride.driver._id, {
            type: "booking_request",
            message: notificationMessage,
            bookingId: data._id,
            rideId: RideId,
          });

          console.log("Notification sent to driver");
        } else {
          console.log(
            "Socket not connected. Unable to join ride or send notification."
          );
        }

        router.push(`/waiting-room/${data.booking._id}`);
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
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#F96167] to-[#F9D423] px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Book Your Ride</h1>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Image
                  src={ride.driver.profilePicture}
                  alt={ride.driver.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-[#F96167]"
                />
                <div>
                  <Link
                    href={`/profile/${ride.driver._id}`}
                    className="text-2xl font-bold hover:text-[#F96167] transition-colors"
                  >
                    {ride.driver.fullName}
                  </Link>
                  <div className="flex items-center mt-1">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-gray-600">
                      {ride.driver?.driverRating?.toFixed(1)}
                    </span>
                  </div>
                  {ride.driver.driverVerificationStatus === "Approved" ? (
                    <span className="text-green-600 text-sm flex items-center mt-1">
                      <FaCheckCircle className="mr-1" /> Verified Driver
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm flex items-center mt-1">
                      <FaTimesCircle className="mr-1" /> Not Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#F96167]">
                  ₹{ride.price}
                </p>
                <p className="text-sm text-gray-600">per seat</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <RideInfoItem icon={FaCar} text={ride.vehicle.type} />
              <RideInfoItem
                icon={FaUsers}
                text={`${ride.availableSeats} available seats`}
              />
              <RideInfoItem
                icon={FaMapMarkerAlt}
                text={ride.startLocation.city}
              />
              <RideInfoItem
                icon={FaMapMarkerAlt}
                text={ride.endLocation.city}
              />
              <RideInfoItem
                icon={FaClock}
                text={formatDateWithTime(new Date(ride.departureTime))}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{ride.startLocation.city}</span>
                <FaArrowRight className="text-[#F96167]" />
                <span className="font-semibold">{ride.endLocation.city}</span>
              </div>
            </div>

            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label
                  htmlFor="seats"
                  className="block mb-2 font-semibold text-gray-700"
                >
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
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#F96167]"
                />
              </div>
              <div className="mb-6 text-right">
                <p className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-[#F96167]">
                    ₹{(numberOfSeats * ride.price).toFixed(2)}
                  </span>
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-[#F96167] text-white px-4 py-3 rounded-lg font-semibold transition-colors hover:bg-[#F9D423] hover:text-[#F96167] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F96167]"
                disabled={isLoading}
              >
                {isLoading ? "Sending Request..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RideInfoItem: React.FC<{ icon: React.ElementType; text: string }> = ({
  icon: Icon,
  text,
}) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <Icon className="text-[#F96167]" />
    <span>{text}</span>
  </div>
);

export default withAuth(BookRidePage);
