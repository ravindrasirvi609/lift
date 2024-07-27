import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReactStars from "react-stars";

interface RideReviewFormProps {
  rideId: string;
  revieweeId: string;
  reviewerRole: "passenger" | "driver";
  onReviewSubmit?: (revieweeId: string) => void; // Add this line
}

export default function RideReviewForm({
  rideId,
  revieweeId,
  reviewerRole,
  onReviewSubmit, // Add this line
}: RideReviewFormProps) {
  const router = useRouter();
  const [reviewData, setReviewData] = useState({
    reviewedId: revieweeId,
    rideId: rideId,
    rating: 0,
    driverRating: 0,
    vehicleRating: 0,
    punctualityRating: 0,
    comment: "",
    reviewerRole: reviewerRole,
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
      if (onReviewSubmit) {
        onReviewSubmit(revieweeId); // Call the onReviewSubmit function if it exists
      }
      router.push("/review-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name: string) => (newRating: number) => {
    setReviewData((prev) => ({ ...prev, [name]: newRating }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#F96167]">
        Rate Your {reviewerRole === "passenger" ? "Driver" : "Passenger"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <label
            htmlFor="rating"
            className="block mb-2 font-medium text-gray-700"
          >
            Overall Rating
          </label>
          <ReactStars
            count={5}
            onChange={handleRatingChange("rating")}
            size={40}
            color2={"#F9D423"}
            value={reviewData.rating}
          />
        </div>
        {reviewerRole === "passenger" && (
          <>
            <div className="flex flex-col items-center">
              <label
                htmlFor="driverRating"
                className="block mb-2 font-medium text-gray-700"
              >
                Driver Rating
              </label>
              <ReactStars
                count={5}
                onChange={handleRatingChange("driverRating")}
                size={40}
                color2={"#F9D423"}
                value={reviewData.driverRating}
              />
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="vehicleRating"
                className="block mb-2 font-medium text-gray-700"
              >
                Vehicle Rating
              </label>
              <ReactStars
                count={5}
                onChange={handleRatingChange("vehicleRating")}
                size={40}
                color2={"#F9D423"}
                value={reviewData.vehicleRating}
              />
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="punctualityRating"
                className="block mb-2 font-medium text-gray-700"
              >
                Punctuality Rating
              </label>
              <ReactStars
                count={5}
                onChange={handleRatingChange("punctualityRating")}
                size={40}
                color2={"#F9D423"}
                value={reviewData.punctualityRating}
              />
            </div>
          </>
        )}
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
