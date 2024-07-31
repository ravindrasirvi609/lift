"use client";

import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { FaCar, FaCheck, FaIdCard, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface DocumentVerificationProps {
  userId: string;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({
  userId,
}) => {
  const router = useRouter();
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [licenseState, setLicenseState] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const {
    uploadFile,
    uploadProgress,
    isUploading,
    error: uploadError,
  } = useFirebaseStorage();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDriverLicense(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleVehicleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setVerificationStatus(null);

    let documentUrl = "";
    if (driverLicense) {
      documentUrl = await uploadFile(driverLicense);
    }

    const formData = {
      userId,
      driverLicense: {
        number: licenseNumber,
        expirationDate,
        state: licenseState,
        documentUrl,
      },
      vehicleInfo,
    };

    try {
      const response = await axios.post(
        "/api/profile/submit-license",
        formData
      );
      setSuccess(true);
      setVerificationStatus(response.data.status);
      setShowModal(true);
      setTimeout(() => {
        router.push("/profile");
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError("Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Driver Document Verification
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaIdCard className="mr-2" /> Driver&apos;s License Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                License Number
              </label>
              <input
                id="licenseNumber"
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your driver&apos;s license number as it appears on your
                license.
              </p>
            </div>
            <div>
              <label
                htmlFor="expirationDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiration Date
              </label>
              <input
                id="expirationDate"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the expiration date of your driver&apos;s license.
              </p>
            </div>
            <div>
              <label
                htmlFor="licenseState"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State
              </label>
              <input
                id="licenseState"
                type="text"
                value={licenseState}
                onChange={(e) => setLicenseState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the state that issued your driver&apos;s license.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaUpload className="mr-2" /> Driver&apos;s License Document
          </h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition duration-300 ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <input {...getInputProps()} />
            {driverLicense ? (
              <p className="text-green-600 flex items-center justify-center">
                <FaCheck className="mr-2" /> File selected: {driverLicense.name}
              </p>
            ) : (
              <p className="text-gray-500 text-center">
                Drag & drop your driver&apos;s license here, or click to select
                file
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Accepted formats: JPEG, PNG, PDF. Please ensure the image is clear
            and all information is legible.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FaCar className="mr-2" /> Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(vehicleInfo).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  id={key}
                  type={key === "year" ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleVehicleInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {key === "make" &&
                    "Enter the manufacturer of your vehicle (e.g., Toyota, Ford)."}
                  {key === "model" &&
                    "Enter the specific model of your vehicle (e.g., Camry, F-150)."}
                  {key === "year" &&
                    "Enter the year your vehicle was manufactured."}
                  {key === "color" &&
                    "Enter the primary color of your vehicle."}
                  {key === "licensePlate" &&
                    "Enter your vehicle's license plate number."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm font-medium text-center">
            Documents uploaded successfully!
          </p>
        )}
        {verificationStatus && (
          <p className="text-blue-500 text-sm font-medium text-center">
            Verification Status: {verificationStatus}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#F96167] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Submit for Verification"}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <h3 className="text-2xl font-semibold mb-4">Thank You!</h3>
            <p>Your license was successfully submitted.</p>
            <p>Please check your verification status on the profile page.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;
