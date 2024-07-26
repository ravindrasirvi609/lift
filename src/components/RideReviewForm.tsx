"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReactStars from "react-stars";

interface RideReviewFormProps {
  rideId: string;
  driverId: string;
}

export default function RideReviewForm({
  rideId,
  driverId,
}: RideReviewFormProps) {
  const router = useRouter();
  const [reviewData, setReviewData] = useState({
    reviewedId: driverId,
    rideId: rideId,
    rating: 0,
    comment: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "/api/reviews/submitReview",
        reviewData
      );
      router.push("/review-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setReviewData((prev) => ({ ...prev, rating: newRating }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#F96167]">
        Rate Your Ride
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <label
            htmlFor="rating"
            className="block mb-2 font-medium text-gray-700"
          >
            Your Rating
          </label>
          <ReactStars
            count={5}
            onChange={handleRatingChange}
            size={40}
            color2={"#F9D423"}
            value={reviewData.rating}
          />
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block mb-1 font-medium text-gray-700"
          >
            Your Feedback
          </label>
          <textarea
            id="comment"
            name="comment"
            value={reviewData.comment}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9D423]"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#F96167] text-white py-2 px-4 rounded-md hover:bg-[#F9D423] transition duration-300"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
