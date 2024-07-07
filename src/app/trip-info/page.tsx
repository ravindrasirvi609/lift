"use client";
import React, { useState } from "react";
import axios from "axios";
import AutocompleteInput from "@/components/AutocompleteInput";

interface TripInfo {
  departureLocation: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  price: number;
  vehicleType: string;
  additionalInfo: string;
}

const CreateTrip: React.FC = () => {
  const [tripInfo, setTripInfo] = useState<TripInfo>({
    departureLocation: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    availableSeats: 1,
    price: 0,
    vehicleType: "",
    additionalInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTripInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange =
    (field: "departureLocation" | "destination") => (value: string) => {
      setTripInfo((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post("/api/create-trip", tripInfo);
      setSuccess(true);
      setTripInfo({
        departureLocation: "",
        destination: "",
        departureDate: "",
        departureTime: "",
        availableSeats: 1,
        price: 0,
        vehicleType: "",
        additionalInfo: "",
      });
    } catch (err) {
      setError("Failed to create trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9E795] to-[#F9D423] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#F9D423] py-6 px-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Create Your Trip
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Share your journey and make new connections!
          </p>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Trip created successfully! Get ready for an amazing journey.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="departureLocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departure Location
                </label>
                <AutocompleteInput
                  placeholder="Enter departure city"
                  value={tripInfo.departureLocation}
                  onChange={handleLocationChange("departureLocation")}
                />
              </div>
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination
                </label>
                <AutocompleteInput
                  placeholder="Enter destination city"
                  value={tripInfo.destination}
                  onChange={handleLocationChange("destination")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="departureDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departure Date
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={tripInfo.departureDate}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9E795] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="departureTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departure Time
                </label>
                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={tripInfo.departureTime}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9E795] focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="availableSeats"
                  className="block text-sm font-medium text-gray-700"
                >
                  Available Seats
                </label>
                <input
                  type="number"
                  id="availableSeats"
                  name="availableSeats"
                  value={tripInfo.availableSeats}
                  onChange={handleChange}
                  min="1"
                  required
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9E795] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price per Seat
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={tripInfo.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9E795] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="vehicleType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={tripInfo.vehicleType}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9E795] focus:ring-opacity-50"
                >
                  <option value="">Select a vehicle type</option>
                  <option value="car">Car</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={tripInfo.additionalInfo}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9E795] focus:ring-opacity-50"
                placeholder="Any special instructions or details about the trip..."
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F9D423] hover:bg-[#F9E795] hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9D423] transition duration-150 ease-in-out"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
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
                    Creating Trip...
                  </span>
                ) : (
                  "Create Trip"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">
              Why share your trip?
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <svg
                  className="flex-shrink-0 h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="ml-3 text-sm text-gray-700">
                  Save on travel costs by sharing expenses
                </p>
              </li>
              <li className="flex items-start">
                <svg
                  className="flex-shrink-0 h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="ml-3 text-sm text-gray-700">
                  Reduce your carbon footprint
                </p>
              </li>
              <li className="flex items-start">
                <svg
                  className="flex-shrink-0 h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="ml-3 text-sm text-gray-700">
                  Meet new people and make connections
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
