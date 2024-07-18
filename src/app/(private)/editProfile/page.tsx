"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/types";
import { formatDate } from "@/utils/utils";
import Image from "next/image";

export default function EditProfilePage() {
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/profile/profileDetails");
      const userData = response.data.user;
      console.log("User data:", userData);

      setFormData({
        ...userData,
        dateOfBirth: formatDate(new Date(userData.dateOfBirth)),
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleNotificationChange = (type: "email" | "sms" | "push") => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            notificationPreferences: {
              ...(prev.notificationPreferences || {}), // Ensure it's an object
              [type]: !prev.notificationPreferences?.[type],
            },
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put("/api/profile/profileDetails", formData);
      console.log("Profile updated successfully:", response.data);
      // Optionally, you can show a success message or redirect the user
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!formData) return <div>No user data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423]">
      <header className="bg-[#F96167] text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <ProfileSection title="Profile Picture">
            <ProfilePictureUploader
              currentPicture={formData.profilePicture}
              onChange={handleFileChange}
            />
          </ProfileSection>
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
                value={formData.dateOfBirth.toString()}
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
                ]}
              />
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Notification Preferences
                </h3>
                <div className="space-y-2">
                  <NotificationToggle
                    label="Email Notifications"
                    checked={formData?.notificationPreferences?.email}
                    onChange={() => handleNotificationChange("email")}
                  />
                  <NotificationToggle
                    label="SMS Notifications"
                    checked={formData?.notificationPreferences?.sms}
                    onChange={() => handleNotificationChange("sms")}
                  />
                  <NotificationToggle
                    label="Push Notifications"
                    checked={formData?.notificationPreferences?.push}
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
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
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

const ProfilePictureUploader: React.FC<{
  currentPicture: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ currentPicture, onChange }) => (
  <div className="flex items-center space-x-6">
    <div className="shrink-0">
      <Image
        className="h-16 w-16 object-cover rounded-full"
        src={currentPicture || "/dummy-user.png"}
        alt="Current profile picture"
        width={64}
        height={64}
      />
    </div>
    <label className="block">
      <span className="sr-only">Choose profile photo</span>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
        "
      />
    </label>
  </div>
);
