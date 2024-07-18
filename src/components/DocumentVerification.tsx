"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

interface DocumentVerificationProps {
  userId: string;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({
  userId,
}) => {
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("userId", userId);
    if (driverLicense) {
      formData.append("driverLicense", driverLicense);
    }
    formData.append("vehicleInfo", vehicleInfo);

    try {
      await axios.post("/api/driver/verify-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
    } catch (err) {
      setError("Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Driver Document Verification
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="driverLicense"
            className="block text-lg font-medium text-gray-700 mb-3"
          >
            Driver&apos;s License
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition duration-300 ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            {driverLicense ? (
              <p className="text-green-600">
                File selected: {driverLicense.name}
              </p>
            ) : (
              <p className="text-gray-500 text-center">
                Drag &amp; drop your driver&apos;s license here, or click to
                select file
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Accepted formats: JPEG, PNG, PDF
          </p>
        </div>
        <div>
          <label
            htmlFor="vehicleInfo"
            className="block text-lg font-medium text-gray-700 mb-3"
          >
            Vehicle Information
          </label>
          <textarea
            id="vehicleInfo"
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Enter vehicle make, model, year, and any other relevant details"
          ></textarea>
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
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
};

export default DocumentVerification;
