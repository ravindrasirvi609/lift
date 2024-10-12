"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/utils/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

import Loading from "@/components/Loading";
import {
  InputField,
  NotificationToggle,
  ProfileSection,
  SelectField,
} from "@/components/ProfileEditComponents";
import { User } from "@/types/types";
import toast, { Toaster } from "react-hot-toast";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

export default function EditProfilePage() {
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/profile/profileDetails");
      const userData = response.data.user;
      setFormData({
        ...userData,
        dateOfBirth: formatDate(new Date(userData.dateOfBirth)),
      });
    } catch (err) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null) as User);
  };

  const handleNestedInputChange = (
    section: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  const handleProfilePictureChange = (url: string) => {
    setFormData((prev) => (prev ? { ...prev, profilePicture: url } : null));
  };

  const handleNotificationChange = (type: "email" | "sms" | "push") => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            notificationPreferences: {
              ...(prev.notificationPreferences || {}),
              [type]: !prev.notificationPreferences?.[type],
            },
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put("/api/profile/profileDetails", formData);
      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!formData)
    return <div className="text-center mt-8">No user data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <Toaster position="top-right" />

      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Edit Profile
          </h1>
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full shadow-md"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div className="px-6 py-8">
              <ProfileSection title="Profile Picture">
                <ProfilePictureUpload
                  userId={formData.id}
                  currentPictureUrl={formData.profilePicture}
                  onPictureChange={handleProfilePictureChange}
                />
              </ProfileSection>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div className="px-6 py-8">
              <ProfileSection title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={
                        formData.dateOfBirth instanceof Date
                          ? formData.dateOfBirth.toISOString().split("T")[0]
                          : new Date(formData.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                      }
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                    />
                  </div>
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
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div className="px-6 py-8">
              <ProfileSection title="Preferences">
                <div className="space-y-8">
                  <SelectField
                    label="Preferred Language"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    options={[
                      { value: "English", label: "English" },
                      { value: "Hindi", label: "Hindi" },
                      { value: "Gujrati", label: "Gujrati" },
                      { value: "Marathi", label: "Marathi" },
                      { value: "Punjabi", label: "Punjabi" },
                      { value: "Tamil", label: "Tamil" },
                      { value: "Telugu", label: "Telugu" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
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
            </div>
          </motion.div>

          {formData.isDriver && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="px-6 py-8">
                <ProfileSection title="Vehicle Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                      label="Make"
                      name="vehicleMake"
                      value={formData.vehicleInfo?.make || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "vehicleInfo",
                          "make",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      label="Model"
                      name="vehicleModel"
                      value={formData.vehicleInfo?.model || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "vehicleInfo",
                          "model",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      label="Year"
                      name="vehicleYear"
                      type="number"
                      value={formData.vehicleInfo?.year?.toString() || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "vehicleInfo",
                          "year",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      label="Color"
                      name="vehicleColor"
                      value={formData.vehicleInfo?.color || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "vehicleInfo",
                          "color",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      label="License Plate"
                      name="vehicleLicensePlate"
                      value={formData.vehicleInfo?.licensePlate || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "vehicleInfo",
                          "licensePlate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </ProfileSection>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md"
              onClick={() => router.back()}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
