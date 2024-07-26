"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import RideReviewForm from "@/components/RideReviewForm";

export default function RideCompletePage() {
  const { rideId } = useParams();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`/api/ride/${rideId}`);
        console.log("Ride details:", response.data);

        setDriverId(response.data.driver._id);
        setLoading(false);
      } catch (err) {
        setError("Failed to load ride details");
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#F96167]">
        Ride Completed!
      </h1>
      <p className="text-center mb-8">
        Thank you for using our service. Please take a moment to rate your
        experience.
      </p>
      {driverId && (
        <RideReviewForm rideId={rideId as string} driverId={driverId} />
      )}
    </div>
  );
}
