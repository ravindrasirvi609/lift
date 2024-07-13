"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { User } from "@/types/types";
import { formatDate } from "@/utils/utils";

// Mock user data (replace this with actual data fetching logic)
const user: User = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  profilePicture:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  dateOfBirth: new Date("1990-1-1"),
  gender: "Male",
  isVerified: true,
  isAdmin: false,
  passengerRating: 4.5,
  totalRidesAsTakenPassenger: 25,
  isDriver: true,
  driverVerificationStatus: "Approved",
  driverLicense: "DL12345678",
  vehicleInfo: "Toyota Camry 2022",
  driverRating: 4.8,
  totalRidesAsDriver: 100,
  driverAvailabilityStatus: "Available",
  earnings: 5000,
  bankAccountInfo: {
    accountNumber: "**** **** 1234",
    bankName: "Example Bank",
    accountHolderName: "John Doe",
    ifscCode: "EXBK0000123",
  },
  preferredLanguage: "English",
  notificationPreferences: {
    email: true,
    sms: true,
    push: false,
  },
};

export default function ProfilePage() {
  const formattedDateOfBirth = useMemo(() => formatDate(user.dateOfBirth), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423]">
      <header className="bg-[#F96167] text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-24 h-24 mr-6">
              <Image
                src={user.profilePicture}
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
          <button className="bg-[#F9D423] text-[#F96167] px-6 py-2 rounded-full font-bold hover:bg-[#F9E795] transition duration-300">
            Edit Profile
          </button>
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
                  {user.passengerRating.toFixed(1)}
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
                      checked={user.notificationPreferences.email}
                    />
                    <NotificationToggle
                      label="SMS"
                      checked={user.notificationPreferences.sms}
                    />
                    <NotificationToggle
                      label="Push Notifications"
                      checked={user.notificationPreferences.push}
                    />
                  </div>
                </div>
              </div>
            </ProfileSection>

            {user.isDriver && (
              <ProfileSection title="Bank Account">
                <div className="space-y-2">
                  <p className="font-medium">{user.bankAccountInfo.bankName}</p>
                  <p>{user.bankAccountInfo.accountNumber}</p>
                  <p>{user.bankAccountInfo.accountHolderName}</p>
                  <p className="text-sm text-gray-600">
                    IFSC: {user.bankAccountInfo.ifscCode}
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
