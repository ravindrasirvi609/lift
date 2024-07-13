"use client";
import React, { useState } from "react";
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

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    dateOfBirth: formatDate(user.dateOfBirth),
    gender: user.gender,
    preferredLanguage: user.preferredLanguage,
    notificationPreferences: {
      email: user?.notificationPreferences?.email,
      sms: user?.notificationPreferences?.sms,
      push: user?.notificationPreferences?.push,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (type: "email" | "sms" | "push") => {
    setFormData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the formData to your backend
    console.log("Form submitted with data:", formData);
    // Redirect to profile page or show success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423]">
      <header className="bg-[#F96167] text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <ProfileSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </div>
          </ProfileSection>

          <ProfileSection title="Preferences">
            <div className="space-y-4">
              <SelectField
                label="Preferred Language"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
                options={[
                  { value: "English", label: "English" },
                  { value: "Spanish", label: "Spanish" },
                  { value: "French", label: "French" },
                  // Add more language options as needed
                ]}
              />
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Notification Preferences
                </h3>
                <div className="space-y-2">
                  <NotificationToggle
                    label="Email Notifications"
                    checked={formData.notificationPreferences.email}
                    onChange={() => handleNotificationChange("email")}
                  />
                  <NotificationToggle
                    label="SMS Notifications"
                    checked={formData.notificationPreferences.sms}
                    onChange={() => handleNotificationChange("sms")}
                  />
                  <NotificationToggle
                    label="Push Notifications"
                    checked={formData.notificationPreferences.push}
                    onChange={() => handleNotificationChange("push")}
                  />
                </div>
              </div>
            </div>
          </ProfileSection>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-[#F96167] text-[#F96167] rounded-full hover:bg-[#F96167] hover:text-white transition duration-300"
              onClick={() => {
                /* Implement cancel logic */
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#F96167] text-white rounded-full hover:bg-opacity-90 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
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

const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}> = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:border-transparent"
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const NotificationToggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
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
