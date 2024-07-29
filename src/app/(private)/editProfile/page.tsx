"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/utils/utils";

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
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfileSection title="Profile Picture">
            <ProfilePictureUpload
              userId={formData.id}
              currentPictureUrl={formData.profilePicture}
              onPictureChange={handleProfilePictureChange}
            />
          </ProfileSection>

          <ProfileSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <input
                name="dateOfBirth"
                type="date"
                value={
                  formData.dateOfBirth instanceof Date
                    ? formData.dateOfBirth.toISOString().split("T")[0]
                    : new Date(formData.dateOfBirth).toISOString().split("T")[0]
                }
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

          {formData.isDriver && (
            <>
              <ProfileSection title="Vehicle Information">
                <div className="space-y-4">
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
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                /* Implement cancel logic */
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
