"use client";
import Loading from "@/components/Loading";
import AccountStatus from "@/components/profile/AccountStatus";
import BankInfo from "@/components/profile/BankInfo";
import BasicInfo from "@/components/profile/BasicInfo";
import DriverInfo from "@/components/profile/DriverInfo";
import PassengerStats from "@/components/profile/PassengerStats";
import Preferences from "@/components/profile/Preferences";
import { ReviewsList } from "@/components/profile/ReviewsList";
import { RideHistory } from "@/components/profile/RideHistory";
import { Review, Ride, User } from "@/types/types";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaEdit, FaCar, FaUser } from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, reviewsResponse, ridesResponse] =
          await Promise.all([
            fetch("/api/profile/profileDetails"),
            fetch("/api/profile/reviews"),
            fetch("/api/profile/rides"),
          ]);

        if (!userResponse.ok || !reviewsResponse.ok || !ridesResponse.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const userData = await userResponse.json();
        const reviewsData = await reviewsResponse.json();
        const ridesData = await ridesResponse.json();

        setUser(userData.user);
        setReviews(reviewsData.reviews);
        setRides(ridesData.rides);
      } catch (err) {
        setError("Error fetching profile data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423]"
    >
      <header className="bg-[#F96167] text-white p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                src={user?.profilePicture}
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-md"
              />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-lg mt-2 flex items-center">
                {user.isDriver ? (
                  <FaCar className="mr-2" />
                ) : (
                  <FaUser className="mr-2" />
                )}
                {user.isDriver ? "Driver" : "Passenger"}
              </p>
            </div>
          </div>
          <Link href="/editProfile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#F96167] px-6 py-3 rounded-full shadow-md hover:shadow-lg flex items-center space-x-2 transition-all duration-300"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </motion.button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <BasicInfo user={user} />
            <AccountStatus user={user} />
            {user.isDriver && <DriverInfo user={user} />}
            <ReviewsList
              reviews={reviews}
              userType={user.isDriver ? "driver" : "passenger"}
            />
            <RideHistory
              rides={rides}
              userType={user.isDriver ? "driver" : "passenger"}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-8"
          >
            <PassengerStats user={user} />
            <Preferences user={user} />
            {user.isDriver && <BankInfo user={user} />}
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default ProfilePage;
