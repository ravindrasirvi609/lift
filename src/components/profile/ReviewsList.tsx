import React from "react";
import { Review } from "@/types/types";
import Image from "next/image";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";

interface ReviewsListProps {
  reviews: Review[];
  userType: "driver" | "passenger";
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  userType,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        {userType === "driver" ? "Driver" : "Passenger"} Reviews
      </h3>
      <div className="space-y-6">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            className="bg-gray-50 p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={review?.reviewer?.profilePicture}
                alt="Reviewer profile picture"
                className="w-16 h-16 rounded-full border-2 border-yellow-400"
                width={64}
                height={64}
              />
              <div>
                <h4 className="font-semibold text-lg text-gray-800">
                  {review?.reviewer.firstName} {review?.reviewer.lastName}
                </h4>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      } w-5 h-5`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <FaQuoteLeft className="absolute top-0 left-0 text-gray-300 opacity-50" />
              <p className="mt-2 text-gray-700 italic px-6">{review.comment}</p>
              <FaQuoteRight className="absolute bottom-0 right-0 text-gray-300 opacity-50" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
