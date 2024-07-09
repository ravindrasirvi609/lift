"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AutocompleteInput from "@/components/AutocompleteInput";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

// Color constants
const PRIMARY_COLOR = "#F9D423";
const SECONDARY_COLOR = "#F9E795";

interface Location {
  coordinates: [number, number];
  city: string;
  region: string;
  locationId: string;
}

interface TripInfo {
  startLocation: Location;
  endLocation: Location;
  startAddress: string;
  endAddress: string;
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number;
  price: number;
  vehicle: string;
  additionalInfo: string;
}

interface User {
  id: string;
  email: string;
  isDriver: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const CreateTrip: React.FC = () => {
  const { user } = useAuth();
  console.log("user", user);

  const router = useRouter();

  const [tripInfo, setTripInfo] = useState<TripInfo>({
    startLocation: {
      coordinates: [0, 0],
      city: "",
      region: "",
      locationId: "",
    },
    endLocation: { coordinates: [0, 0], city: "", region: "", locationId: "" },
    startAddress: "",
    endAddress: "",
    departureTime: "",
    estimatedArrivalTime: "",
    availableSeats: 1,
    price: 0,
    vehicle: "",
    additionalInfo: "",
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleLocationChange = useCallback(
    (field: "startLocation" | "endLocation") =>
      (value: Location & { address: string }) => {
        setTripInfo((prev) => ({
          ...prev,
          [field]: {
            coordinates: value.coordinates,
            city: value.city,
            region: value.region,
            locationId: value.locationId,
          },
          [`${field === "startLocation" ? "start" : "end"}Address`]:
            value.address,
        }));
      },
    [setTripInfo]
  );

  useEffect(() => {
    if (user === null) {
      setIsAuthLoading(false);
      router.push("/auth");
    } else if (user && !user.isDriver) {
      setIsAuthLoading(false);
      router.push("/auth");
    } else if (user && user.isDriver) {
      setIsAuthLoading(false);
    }
  }, [user, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800"
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
      </div>
    );
  }

  if (!user || !user.isDriver) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTripInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post("/api/ride/createRide", tripInfo);
      setSuccess(true);
      setTripInfo({
        startLocation: {
          coordinates: [0, 0],
          city: "",
          region: "",
          locationId: "",
        },
        endLocation: {
          coordinates: [0, 0],
          city: "",
          region: "",
          locationId: "",
        },
        startAddress: "",
        endAddress: "",
        departureTime: "",
        estimatedArrivalTime: "",
        availableSeats: 1,
        price: 0,
        vehicle: "",
        additionalInfo: "",
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Failed to create trip. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-[${SECONDARY_COLOR}] to-[${PRIMARY_COLOR}] py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`bg-[${PRIMARY_COLOR}] py-6 px-8`}>
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
                  htmlFor="startLocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departure Location
                </label>
                <AutocompleteInput
                  placeholder="Enter departure city"
                  value={tripInfo.startAddress}
                  onChange={handleLocationChange("startLocation")}
                  aria-label="Departure Location"
                />
              </div>
              <div>
                <label
                  htmlFor="endLocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination
                </label>
                <AutocompleteInput
                  placeholder="Enter destination city"
                  value={tripInfo.endAddress}
                  onChange={handleLocationChange("endLocation")}
                  aria-label="Destination"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="departureTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  value={tripInfo.departureTime}
                  onChange={handleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label
                  htmlFor="estimatedArrivalTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estimated Arrival Time
                </label>
                <input
                  type="datetime-local"
                  id="estimatedArrivalTime"
                  name="estimatedArrivalTime"
                  value={tripInfo.estimatedArrivalTime}
                  onChange={handleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
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
                  value={tripInfo.availableSeats.toString()}
                  onChange={handleChange}
                  min="1"
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
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
                  value={tripInfo.price.toString()}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label
                  htmlFor="vehicle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle
                </label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={tripInfo.vehicle}
                  onChange={handleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                >
                  <option value="">Select a vehicle</option>
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
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                placeholder="Any special instructions or details about the trip..."
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[${PRIMARY_COLOR}] hover:bg-[${SECONDARY_COLOR}] hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${PRIMARY_COLOR}] transition duration-150 ease-in-out`}
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
