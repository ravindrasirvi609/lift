"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import RideReviewForm from "@/components/RideReviewForm";
import Loading from "@/components/Loading";

interface RideDetails {
  _id: string;
  driver: { _id: string; fullName: string };
  passengers: Array<{ _id: string; fullName: string }>;
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
  const [reviewedPassengers, setReviewedPassengers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rideResponse, userResponse, reviewResponse] = await Promise.all([
          axios.get(`/api/ride/${rideId}`),
          axios.get("/api/profile/profileDetails"),
          axios.get(`/api/reviews/getRideReviews/${rideId}`),
        ]);

        setRideDetails(rideResponse.data);
        setCurrentUser(userResponse.data);
        setReviewedPassengers(
          reviewResponse.data.map((review: any) => review.reviewed)
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load necessary data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [rideId]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!rideDetails || !currentUser)
    return <div>Failed to load necessary data. Please try again.</div>;

  const isDriver = currentUser.user._id === rideDetails.driver._id;
  const reviewerRole = isDriver ? "driver" : "passenger";

  const getRevieweeId = () => {
    if (isDriver) {
      const unreviewed = rideDetails.passengers.find(
        (p) => !reviewedPassengers.includes(p._id)
      );
      return unreviewed?._id;
    }
    return rideDetails.driver._id;
  };

  const revieweeId = getRevieweeId();

  const handleReviewSubmit = (passengerId: string) => {
    setReviewedPassengers([...reviewedPassengers, passengerId]);
  };

  if (isDriver && reviewedPassengers.length === rideDetails.passengers.length) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">
          All passengers have been reviewed
        </h2>
        <p>Thank you for providing feedback for all your passengers.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#F96167]">
        Ride Completed!
      </h1>
      <p className="text-center mb-8">
        Thank you for using our service. Please take a moment to rate your
        experience.
      </p>
      {revieweeId ? (
        <RideReviewForm
          rideId={rideId as string}
          revieweeId={revieweeId}
          reviewerRole={reviewerRole}
          onReviewSubmit={handleReviewSubmit}
        />
      ) : (
        <p className="text-center text-gray-600">
          No more reviews to submit for this ride.
        </p>
      )}
      {isDriver && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Passengers to Review:</h2>
          <ul>
            {rideDetails.passengers.map((passenger) => (
              <li
                key={passenger._id}
                className={`mb-2 ${
                  reviewedPassengers.includes(passenger._id)
                    ? "text-gray-400"
                    : ""
                }`}
              >
                {passenger.fullName} -{" "}
                {reviewedPassengers.includes(passenger._id)
                  ? "Reviewed"
                  : "Pending"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
