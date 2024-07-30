"use client";
import { useState, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import {
  FaStar,
  FaCar,
  FaMapMarkerAlt,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaQuestionCircle,
} from "react-icons/fa";
import Loading from "@/components/Loading";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      profilePicture
      isDriver
      driverRating
      passengerRating
      totalRidesAsDriver
      totalRidesAsTakenPassenger
      membershipTier
      verifiedBadges
      driverVerificationStatus
    }
  }
`;

const GET_USER_REVIEWS = gql`
  query GetUserReviews($userId: ID!) {
    reviews(userId: $userId) {
      id
      reviewer {
        firstName
        lastName
        profilePicture
      }
      rating
      comment
      createdAt
    }
  }
`;

const GET_USER_RIDES = gql`
  query GetUserRides($userId: ID!) {
    rides(userId: $userId) {
      id
      startLocation {
        address
      }
      endLocation {
        address
      }
      departureTime
      status
    }
  }
`;
interface User {
  id: string;
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
  id: string;
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
  id: string;
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
  const [activeTab, setActiveTab] = useState("info");

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER, {
    variables: { id: params.id },
  });

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_USER_REVIEWS, {
    variables: { userId: params.id },
  });

  const {
    loading: ridesLoading,
    error: ridesError,
    data: ridesData,
  } = useQuery(GET_USER_RIDES, {
    variables: { userId: params.id },
  });

  const profileRef = useRef(null);
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  if (userLoading || reviewsLoading || ridesLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#F9D423] to-[#F96167]">
        <Loading />
      </div>
    );
  }

  if (userError || reviewsError || ridesError) {
    return (
      <div>
        Error:{" "}
        {userError?.message || reviewsError?.message || ridesError?.message}
      </div>
    );
  }

  const user: User = userData.user;
  const reviews: Review[] = reviewsData.reviews;
  const rides: Ride[] = ridesData.rides;

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
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}

                {activeTab === "rides" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                      Past Rides
                    </h2>
                    {rides.map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
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
