import { Review } from "@/types/types";

interface ReviewsListProps {
  reviews: Review[];
  userType: "driver" | "passenger";
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  userType,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {userType === "driver" ? "Driver" : "Passenger"} Reviews
      </h3>
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="font-medium">{review?.reviewer.firstName}</span>
            <span className="text-yellow-500">
              {"⭐".repeat(review.rating)}
            </span>
          </div>
          <p className="mt-2 text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};
