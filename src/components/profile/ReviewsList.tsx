import { Review } from "@/types/types";
import Image from "next/image";

interface ReviewsListProps {
  reviews: Review[];
  userType: "driver" | "passenger";
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  userType,
}) => {
  console.log("reviews", reviews);

  console.log("userType", userType);
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {userType === "driver" ? "Driver" : "Passenger"} Reviews
      </h3>
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <Image
              src={review?.reviewer?.profilePicture}
              alt="Reviewer profile picture"
              className="w-12 h-12 rounded-full"
              width={12}
              height={12}
            />
            <span className="font-medium">
              {review?.reviewer.firstName} {review?.reviewer.lastName}
            </span>
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
