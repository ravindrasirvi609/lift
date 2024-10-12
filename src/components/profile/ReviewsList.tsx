import React from "react";
import { Review } from "@/types/types";
import Image from "next/image";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewsListProps {
  reviews: Review[];
  userType: "driver" | "passenger";
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  userType,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-3xl shadow-2xl"
    >
      <h3 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-yellow-400 pb-4">
        {userType === "driver" ? "Driver" : "Passenger"} Reviews
      </h3>
      <AnimatePresence>
        {reviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={review?.reviewer?.profilePicture}
                alt="Reviewer profile picture"
                className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md"
                width={80}
                height={80}
              />
              <div>
                <h4 className="font-semibold text-xl text-gray-800">
                  {review?.reviewer.firstName} {review?.reviewer.lastName}
                </h4>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      } w-6 h-6 transition-colors duration-200`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative mt-4">
              <FaQuoteLeft className="absolute top-0 left-0 text-yellow-400 opacity-50 text-xl" />
              <p className="mt-2 text-gray-700 italic px-8 py-2 text-lg leading-relaxed">
                {review.comment}
              </p>
              <FaQuoteRight className="absolute bottom-0 right-0 text-yellow-400 opacity-50 text-xl" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
