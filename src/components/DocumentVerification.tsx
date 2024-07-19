"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import Link from "next/link";

interface DocumentVerificationProps {
  userId: string;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({
  userId,
}) => {
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
    } catch (err) {
      setError("Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const response = await axios.post("/api/profile/verify-license", {
        requestId: "1234",
      });
      setVerificationStatus(response.data.status);
    } catch (err) {
      setError("Failed to check verification status. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-[#F9E795] p-8 border border-[#F9D423] rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#F96167]">
        Driver Document Verification
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-[#F96167]">
            Driver&apos;s License Information
          </h3>
          <div className="space-y-4">
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F9D423]"
                required
              />
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F9D423]"
                required
              />
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F9D423]"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-[#F96167]">
            Driver&apos;s License Document
          </h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition duration-300 ${
              isDragActive
                ? "border-[#F9D423] bg-[#F9E795]"
                : "border-gray-300 hover:border-[#F9D423]"
            }`}
          >
            <input {...getInputProps()} />
            {driverLicense ? (
              <p className="text-green-600">
                File selected: {driverLicense.name}
              </p>
            ) : (
              <p className="text-gray-500 text-center">
                Drag & drop your driver&apos;s license here, or click to select
                file
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Accepted formats: JPEG, PNG, PDF
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-[#F96167]">
            Vehicle Information
          </h3>
          <div className="space-y-4">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F9D423]"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[#F96167] text-sm font-medium text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm font-medium text-center">
            Documents uploaded successfully!
          </p>
        )}
        {verificationStatus && (
          <p className="text-[#F96167] text-sm font-medium text-center">
            Verification Status: {verificationStatus}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#F96167] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#F9D423] transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Submit for Verification"}
        </button>
      </form>

      <button
        onClick={handleCheckVerification}
        className="w-full bg-[#F9D423] text-white my-3 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#F96167] transition duration-300"
      >
        Check Verification
      </button>
    </div>
  );
};

export default DocumentVerification;
