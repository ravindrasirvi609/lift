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
import React, { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423]">
      <header className="bg-[#F96167] text-white p-6">
        <h1 className="text-3xl font-bold">
          {user.firstName} {user.lastName}&apos;s Profile
        </h1>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
          </div>
          <div className="space-y-8">
            <PassengerStats user={user} />
            <Preferences user={user} />
            {user.isDriver && <BankInfo user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
