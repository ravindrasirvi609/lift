"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import RideReviewForm from "@/components/RideReviewForm";

interface RideDetails {
  _id: string;
  driver: { _id: string };
  bookings: Array<{ passenger: { _id: string } }>;
  passengers: Array<{ _id: string }>;
}

interface User {
  user: {
    _id: string;
  };
}

export default function RideCompletePage() {
  const { rideId } = useParams();
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rideResponse, userResponse] = await Promise.all([
          axios.get(`/api/ride/${rideId}`),
          axios.get("/api/profile/profileDetails"),
        ]);

        setRideDetails(rideResponse.data);
        setCurrentUser(userResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load necessary data");
        setLoading(false);
      }
    };

    fetchData();
  }, [rideId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  if (!rideDetails || !currentUser)
    return <div className="text-center mt-10">No data available</div>;
  console.log("rideDetails", rideDetails.driver._id);
  console.log("currentUser", currentUser.user._id);

  const isDriver = currentUser.user._id === rideDetails.driver._id;
  console.log("isDriver", isDriver);

  const reviewerRole = isDriver ? "driver" : "passenger";
  const revieweeId = isDriver
    ? rideDetails.passengers[0]?._id
    : rideDetails.driver._id;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#F96167]">
        Ride Completed!
      </h1>
      <p className="text-center mb-8">
        Thank you for using our service. Please take a moment to rate your
        experience.
      </p>
      {revieweeId && (
        <RideReviewForm
          rideId={rideId as string}
          revieweeId={revieweeId}
          reviewerRole={reviewerRole}
        />
      )}
    </div>
  );
}
