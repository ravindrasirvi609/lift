"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import {
  FaStar,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaQuestionCircle,
} from "react-icons/fa";
import Loading from "@/components/Loading";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  isDriver: boolean;
  driverRating: number;
  passengerRating: number;
  totalRidesAsDriver: number;
  totalRidesAsTakenPassenger: number;
  membershipTier: string;
  verifiedBadges: string[];
  driverVerificationStatus: string;
}

interface Review {
  _id: string;
  reviewer: {
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Ride {
  _id: string;
  startLocation: {
    address: string;
  };
  endLocation: {
    address: string;
  };
  departureTime: string;
  status: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  const profileRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/users/${params.id}`);
        setUser(userResponse.data);

        const reviewsResponse = await axios.get(
          `/api/users/${params.id}/reviews`
        );
        setReviews(reviewsResponse.data);

        const ridesResponse = await axios.get(`/api/users/${params.id}/rides`);
        setRides(ridesResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [params.id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#F9D423] to-[#F96167]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9D423] to-[#F96167] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div
          ref={profileRef}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden mb-8"
        >
          <div className="md:flex">
            <div className="md:w-1/3 bg-[#F96167] p-8 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <h1 className="text-3xl font-bold text-white text-center">{`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-white opacity-75 mt-2 text-center">
                {user.email}
              </p>
              {user.isDriver && (
                <p className="text-white mt-2 text-center flex items-center justify-center">
                  <VerificationStatusIcon
                    status={user.driverVerificationStatus}
                  />
                  <span>Driver Status: {user.driverVerificationStatus}</span>
                </p>
              )}

              <div className="flex flex-wrap justify-center mt-4">
                {user.verifiedBadges.map((badge) => (
                  <span
                    key={badge}
                    className="bg-[#F9D423] text-[#F96167] text-xs font-semibold m-1 px-3 py-1 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <div ref={tabsRef} className="flex mb-8 overflow-x-auto">
                {["info", "reviews", "rides"].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-shrink-0 px-6 py-2 rounded-full transition-all duration-300 mr-4 ${
                      activeTab === tab
                        ? "bg-[#F96167] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-[#F9D423] hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div
                ref={contentRef}
                className="overflow-y-auto max-h-[calc(100vh-300px)]"
              >
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                      User Information
                    </h2>
                    <InfoItem
                      label="Member Tier"
                      value={user.membershipTier}
                      isBadge
                    />
                    <InfoItem
                      label="Total Rides as Passenger"
                      value={user.totalRidesAsTakenPassenger.toString()}
                    />
                    {user.isDriver && (
                      <>
                        <InfoItem
                          label="Total Rides as Driver"
                          value={user.totalRidesAsDriver.toString()}
                        />
                        <InfoItem
                          label="Driver Rating"
                          value={user.driverRating.toFixed(1)}
                          isRating
                        />
                      </>
                    )}
                    <InfoItem
                      label="Passenger Rating"
                      value={user.passengerRating.toFixed(1)}
                      isRating
                    />
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                      Reviews
                    </h2>
                    {reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                )}

                {activeTab === "rides" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                      Past Rides
                    </h2>
                    {rides.map((ride) => (
                      <RideCard key={ride._id} ride={ride} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({
  label,
  value,
  isBadge = false,
  isRating = false,
}: {
  label: string;
  value: string | number;
  isBadge?: boolean;
  isRating?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-600 font-medium">{label}</span>
    {isBadge ? (
      <span className="bg-[#F9D423] text-[#F96167] px-3 py-1 rounded-full font-semibold">
        {value}
      </span>
    ) : isRating ? (
      <span className="flex items-center">
        {value} <FaStar className="text-[#F9D423] ml-1" />
      </span>
    ) : (
      <span className="font-semibold">{value}</span>
    )}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-gray-50 rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <Image
        src={review.reviewer.profilePicture || "/default-avatar.png"}
        alt={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
        width={48}
        height={48}
        className="rounded-full mr-4"
      />
      <div>
        <p className="font-semibold text-lg">{`${review.reviewer.firstName} ${review.reviewer.lastName}`}</p>
        <p className="text-sm text-gray-600">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${
            i < review.rating ? "text-[#F9D423]" : "text-gray-300"
          }`}
        />
      ))}
    </div>
    <p className="text-gray-700">{review.comment}</p>
  </div>
);

const RideCard = ({ ride }: { ride: Ride }) => (
  <div className="bg-gray-50 rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaMapMarkerAlt className="text-[#F96167] mr-2" />
      <p className="font-semibold">From: {ride.startLocation.address}</p>
    </div>
    <div className="flex items-center mb-4">
      <FaMapMarkerAlt className="text-[#F9D423] mr-2" />
      <p className="font-semibold">To: {ride.endLocation.address}</p>
    </div>
    <div className="flex items-center mb-4">
      <FaCalendar className="text-gray-500 mr-2" />
      <p>
        <span className="font-semibold">Departure:</span>{" "}
        {new Date(ride.departureTime).toLocaleString()}
      </p>
    </div>
    <div className="flex items-center">
      <FaCar className="text-gray-500 mr-2" />
      <p>
        <span className="font-semibold">Status:</span>{" "}
        <span className="bg-[#F9D423] text-[#F96167] px-3 py-1 rounded-full">
          {ride.status}
        </span>
      </p>
    </div>
  </div>
);

const VerificationStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Approved":
      return <FaCheckCircle className="text-green-500 inline-block mr-2" />;
    case "Rejected":
      return <FaTimesCircle className="text-red-500 inline-block mr-2" />;
    case "Pending":
      return <FaHourglassHalf className="text-yellow-500 inline-block mr-2" />;
    case "Not Applied":
    default:
      return <FaQuestionCircle className="text-gray-500 inline-block mr-2" />;
  }
};
