"use client";
"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { User } from "@/types/types";
import { formatDate } from "@/utils/utils";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch("/api/profile/profileDetails");
        if (!response.ok) {
          throw new Error("Failed to fetch profile details");
        }
        const data = await response.json();
        console.log(data);

        setUser(data.user);
      } catch (err) {
        setError("Error fetching profile details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  const formattedDateOfBirth = useMemo(
    () => (user ? formatDate(new Date(user.dateOfBirth)) : ""),
    [user]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423]">
      <header className="bg-[#F96167] text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-24 h-24 mr-6">
              <Image
                src={user.profilePicture || "/dummy-user.png"}
                alt={`${user.firstName} ${user.lastName}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-[#F9E795]"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-[#F9E795] font-medium">
                {user.isDriver ? "Driver" : "Passenger"}
              </p>
            </div>
          </div>
          <Link href={"/editProfile"}>
            <button className="bg-[#F9D423] text-[#F96167] px-6 py-2 rounded-full font-bold hover:bg-[#F9E795] transition duration-300">
              Edit Profile
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileSection title="Basic Information">
              <InfoGrid>
                <InfoItem icon="📧" label="Email" value={user.email} />
                <InfoItem icon="📱" label="Phone" value={user.phoneNumber} />
                <InfoItem
                  icon="🎂"
                  label="Date of Birth"
                  value={formattedDateOfBirth}
                />
                <InfoItem icon="⚧" label="Gender" value={user.gender} />
              </InfoGrid>
            </ProfileSection>

            <ProfileSection title="Account Status">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-2">
                    {user.isVerified ? "✅" : "🔒"}
                  </span>
                  <span className="font-medium">
                    {user.isVerified
                      ? "Verified Account"
                      : "Unverified Account"}
                  </span>
                </div>
                {!user.isVerified && (
                  <button className="bg-[#F96167] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
                    Verify Now
                  </button>
                )}
              </div>
              {user.isAdmin && (
                <p className="mt-4 text-[#F96167] font-medium flex items-center">
                  <span className="text-2xl mr-2">👑</span> Admin Account
                </p>
              )}
            </ProfileSection>

            {user.isDriver && (
              <ProfileSection title="Driver Information">
                <InfoGrid>
                  <InfoItem
                    icon="🚗"
                    label="Vehicle"
                    value={user.vehicleInfo}
                  />
                  <InfoItem
                    icon="📊"
                    label="Driver Rating"
                    value={`${user.driverRating.toFixed(1)} / 5`}
                  />
                  <InfoItem
                    icon="🚕"
                    label="Total Rides"
                    value={user.totalRidesAsDriver.toString()}
                  />
                  <InfoItem
                    icon="💰"
                    label="Total Earnings"
                    value={`$${user.earnings.toFixed(2)}`}
                  />
                </InfoGrid>
                <div className="mt-6 flex justify-between items-center">
                  <span className="font-medium">Availability Status:</span>
                  <ToggleSwitch
                    checked={user.driverAvailabilityStatus === "Available"}
                    onChange={() => {}}
                  />
                </div>
              </ProfileSection>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <ProfileSection title="Passenger Statistics">
              <div className="text-center">
                <div className="text-6xl font-bold text-[#F96167] mb-2">
                  {user?.passengerRating?.toFixed(1)}
                </div>
                <div className="text-xl font-medium mb-6">Passenger Rating</div>
                <div className="text-4xl font-bold text-[#F96167] mb-2">
                  {user.totalRidesAsTakenPassenger}
                </div>
                <div className="text-xl font-medium">Total Rides Taken</div>
              </div>
            </ProfileSection>

            <ProfileSection title="Preferences">
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Preferred Language:</span>
                  <span className="ml-2">{user.preferredLanguage}</span>
                </div>
                <div>
                  <span className="font-medium mb-2 block">
                    Notification Preferences:
                  </span>
                  <div className="space-y-2">
                    <NotificationToggle
                      label="Email"
                      checked={user?.notificationPreferences?.email}
                    />
                    <NotificationToggle
                      label="SMS"
                      checked={user?.notificationPreferences?.sms}
                    />
                    <NotificationToggle
                      label="Push Notifications"
                      checked={user?.notificationPreferences?.push}
                    />
                  </div>
                </div>
              </div>
            </ProfileSection>

            {user.isDriver && (
              <ProfileSection title="Bank Account">
                <div className="space-y-2">
                  <p className="font-medium">
                    {user?.bankAccountInfo?.bankName}
                  </p>
                  <p>{user?.bankAccountInfo?.accountNumber}</p>
                  <p>{user?.bankAccountInfo?.accountHolderName}</p>
                  <p className="text-sm text-gray-600">
                    IFSC: {user?.bankAccountInfo?.ifscCode}
                  </p>
                </div>
              </ProfileSection>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#F96167] text-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>&copy; 2024 Ride Sharing App</p>
          <div className="space-x-6">
            <a
              href="#"
              className="hover:text-[#F9E795] transition duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-[#F9E795] transition duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-[#F9E795] transition duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const ProfileSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="bg-[#F96167] text-white py-3 px-6">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const InfoItem: React.FC<{
  icon: string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center">
    <span className="text-2xl mr-3">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const NotificationToggle: React.FC<{ label: string; checked: boolean }> = ({
  label,
  checked,
}) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} readOnly />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? "bg-[#F96167]" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <span className="ml-3 text-gray-700">{label}</span>
  </label>
);

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? "bg-green-400" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <span className="ml-3 text-gray-700">
      {checked ? "Available" : "Unavailable"}
    </span>
  </label>
);
