"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaCar,
  FaEnvelope,
  FaExchangeAlt,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

interface SignInProps {
  userType: "user" | "vehicle-owner";
  onSwitch: () => void;
}

const SignIn: React.FC<SignInProps> = ({ userType, onSwitch }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    isDriver: false,
    driverLicense: "",
    vehicleInfo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/signin" : "/api/auth/login";
      const response = await axios.post(endpoint, {
        ...formData,
        isDriver: userType === "vehicle-owner",
      });

      console.log("Success:", response.data);
      if (response.data.success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E795] to-[#F9D423] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-[#F96167]">
            {isSignUp ? "Join Us" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userType === "user" ? "Passenger" : "Vehicle Owner"} Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUp && (
              <>
                <InputField
                  icon={<FaUser className="h-5 w-5 text-[#F96167]" />}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaUser className="h-5 w-5 text-[#F96167]" />}
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaBirthdayCake className="h-5 w-5 text-[#F96167]" />}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <SelectField
                  icon={<FaVenusMars className="h-5 w-5 text-[#F96167]" />}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </>
            )}
            <InputField
              icon={<FaEnvelope className="h-5 w-5 text-[#F96167]" />}
              id="email-address"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              icon={<FaPhone className="h-5 w-5 text-[#F96167]" />}
              id="phone-number"
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <InputField
              icon={<FaLock className="h-5 w-5 text-[#F96167]" />}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {isSignUp && userType === "vehicle-owner" && (
              <>
                <InputField
                  icon={<FaCar className="h-5 w-5 text-[#F96167]" />}
                  id="driverLicense"
                  name="driverLicense"
                  type="text"
                  placeholder="Driver's License Number"
                  value={formData.driverLicense}
                  onChange={handleChange}
                />
                <InputField
                  icon={<FaCar className="h-5 w-5 text-[#F96167]" />}
                  id="vehicleInfo"
                  name="vehicleInfo"
                  type="text"
                  placeholder="Vehicle Information"
                  value={formData.vehicleInfo}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F96167] hover:bg-[#F9D423] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F96167] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              {isLoading ? (
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
              ) : (
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <button
            onClick={toggleSignUp}
            className="font-medium text-[#F96167] hover:text-[#F9D423] transition-colors duration-300"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <div className="text-sm text-center">
          <button
            onClick={onSwitch}
            className="inline-flex items-center font-medium text-[#F96167] hover:text-[#F9D423] transition-colors duration-300"
          >
            <FaExchangeAlt className="mr-2" />
            Switch to {userType === "user" ? "Vehicle Owner" : "Passenger"}{" "}
            Portal
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, ...props }: any) => (
  <div className="mb-4">
    <label
      htmlFor={props.id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {props.placeholder}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        {...props}
        required
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167] sm:text-sm"
      />
    </div>
  </div>
);

const SelectField = ({ icon, options, ...props }: any) => (
  <div className="mb-4">
    <label
      htmlFor={props.id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {props.name}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <select
        {...props}
        required
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#F96167] focus:border-[#F96167] sm:text-sm"
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SignIn;
