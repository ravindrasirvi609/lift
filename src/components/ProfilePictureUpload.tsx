"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import Image from "next/image";

interface ProfilePictureUploadProps {
  userId: string;
  currentPictureUrl: string;
  onPictureChange: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userId,
  currentPictureUrl,
  onPictureChange,
}) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentPictureUrl
  );
  const [error, setError] = useState<string | null>(null);
  const {
    uploadFile,
    uploadProgress,
    isUploading,
    error: uploadError,
  } = useFirebaseStorage();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      handleUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== currentPictureUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, currentPictureUrl]);

  const handleUpload = async (file: File) => {
    setError(null);

    try {
      const pictureUrl = await uploadFile(file);
      onPictureChange(pictureUrl);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-center text-[#F96167]">
        Profile Picture
      </h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition duration-300 ${
            isDragActive
              ? "border-[#F9D423] bg-[#FFF9E6]"
              : "border-gray-300 hover:border-[#F9D423]"
          }`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <div className="flex justify-center">
              <Image
                src={previewUrl}
                alt="Profile preview"
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="text-gray-500 text-center">
              Drag & drop your profile picture here, or click to select file
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Accepted formats: JPEG, PNG
        </div>
      </div>

      {error && (
        <div className="mt-2 text-[#F96167] text-sm font-medium text-center">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#F9D423] h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
