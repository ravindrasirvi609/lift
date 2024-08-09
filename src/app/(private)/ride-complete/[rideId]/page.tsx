"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import RideReviewForm from "@/components/RideReviewForm";
import Loading from "@/components/Loading";
import { toast } from "react-hot-toast";

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
  const router = useRouter();
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewedPassengers, setReviewedPassengers] = useState<string[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!rideDetails || !currentUser)
    return (
      <div className="text-center mt-10">
        Failed to load necessary data. Please try again.
      </div>
    );

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

  const handleReviewSubmit = async (passengerId: string) => {
    setReviewedPassengers([...reviewedPassengers, passengerId]);
    setReviewSubmitted(true);
    toast.success("Review submitted successfully!");

    // Delay redirect to show the success message
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (reviewSubmitted) {
    return (
      <div className="text-center mt-10 p-6 bg-green-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Thank you for your review!
        </h2>
        <p className="text-green-600">
          Your feedback is valuable to us. You&apos;ll be redirected to the home
          page shortly.
        </p>
      </div>
    );
  }

  if (isDriver && reviewedPassengers.length === rideDetails.passengers.length) {
    return (
      <div className="text-center mt-10 p-6 bg-blue-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          All passengers have been reviewed
        </h2>
        <p className="text-blue-600 mb-4">
          Thank you for providing feedback for all your passengers.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Return to Home
        </button>
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
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Passengers to Review:</h2>
          <ul>
            {rideDetails.passengers.map((passenger) => (
              <li
                key={passenger._id}
                className={`mb-2 p-2 rounded ${
                  reviewedPassengers.includes(passenger._id)
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
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
