"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AutocompleteInput from "@/components/AutocompleteInput";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { useAuth } from "@/app/contexts/AuthContext";
import Loading from "@/components/Loading";

const PRIMARY_COLOR = "#F9D423";
const SECONDARY_COLOR = "#F9E795";

export interface LocationAddress {
  coordinates: [number, number];
  city: string;
  region: string;
  locationId: string;
  address: string;
}

interface TripInfo {
  startLocation: LocationAddress;
  endLocation: LocationAddress;
  waypoints: { coordinates: [number, number]; address: string }[];
  departureTime: string;
  estimatedArrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  vehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  distance: number;
  duration: number;
  recurrence: {
    isRecurring: boolean;
    frequency: "Daily" | "Weekly" | "Monthly" | "";
    endDate: string;
  };
  allowedLuggage: string;
  amenities: string[];
  notes: string;
}

const CreateTrip: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [tripInfo, setTripInfo] = useState<TripInfo>({
    startLocation: {
      coordinates: [0, 0],
      city: "",
      region: "",
      locationId: "",
      address: "",
    },
    endLocation: {
      coordinates: [0, 0],
      city: "",
      region: "",
      locationId: "",
      address: "",
    },
    waypoints: [],
    departureTime: "",
    estimatedArrivalTime: "",
    totalSeats: 1,
    availableSeats: 1,
    price: 0,
    vehicle: {
      type: "",
      make: "",
      model: "",
      year: 0,
      color: "",
      licensePlate: "",
    },
    distance: 0,
    duration: 0,
    recurrence: { isRecurring: false, frequency: "", endDate: "" },
    allowedLuggage: "",
    amenities: [],
    notes: "",
  });

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const getTodayDateTime = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [minDate, setMinDate] = useState(getTodayDateTime());

  useEffect(() => {
    setMinDate(getTodayDateTime());
  }, []);

  const handleLocationChange = useCallback(
    (field: "startLocation" | "endLocation") => (value: LocationAddress) => {
      setTripInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
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
    return <Loading />;
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

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTripInfo((prev) => ({
      ...prev,
      vehicle: { ...prev.vehicle, [name]: value },
    }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setTripInfo((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value),
    }));
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
          address: "",
        },
        endLocation: {
          coordinates: [0, 0],
          city: "",
          region: "",
          locationId: "",
          address: "",
        },
        waypoints: [],
        departureTime: "",
        estimatedArrivalTime: "",
        totalSeats: 1,
        availableSeats: 1,
        price: 0,
        vehicle: {
          type: "",
          make: "",
          model: "",
          year: 0,
          color: "",
          licensePlate: "",
        },
        distance: 0,
        duration: 0,
        recurrence: { isRecurring: false, frequency: "", endDate: "" },
        allowedLuggage: "",
        amenities: [],
        notes: "",
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
            {/* Location inputs */}
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
                  value={tripInfo.startLocation.address}
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
                  value={tripInfo.endLocation.address}
                  onChange={handleLocationChange("endLocation")}
                  aria-label="Destination"
                />
              </div>
            </div>

            {/* Time inputs */}
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
                  min={minDate}
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
                  min={minDate}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
            </div>

            {/* Seat and price inputs */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="totalSeats"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Seats
                </label>
                <input
                  type="number"
                  id="totalSeats"
                  name="totalSeats"
                  value={tripInfo.totalSeats}
                  onChange={handleChange}
                  min="1"
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
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
                  max={tripInfo.totalSeats}
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
                  value={tripInfo.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
            </div>

            {/* Vehicle information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="vehicleType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="type"
                  value={tripInfo.vehicle.type}
                  onChange={handleVehicleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                >
                  <option value="">Select a vehicle type</option>
                  <option value="car">Car</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="vehicleMake"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Make
                </label>
                <input
                  type="text"
                  id="vehicleMake"
                  name="make"
                  value={tripInfo.vehicle.make}
                  onChange={handleVehicleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label
                  htmlFor="vehicleModel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Model
                </label>
                <input
                  type="text"
                  id="vehicleModel"
                  name="model"
                  value={tripInfo.vehicle.model}
                  onChange={handleVehicleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="vehicleYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Year
                </label>
                <input
                  type="number"
                  id="vehicleYear"
                  name="year"
                  value={tripInfo.vehicle.year}
                  onChange={handleVehicleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label
                  htmlFor="vehicleColor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Color
                </label>
                <input
                  type="text"
                  id="vehicleColor"
                  name="color"
                  value={tripInfo.vehicle.color}
                  onChange={handleVehicleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label
                  htmlFor="licensePlate"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Plate
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={tripInfo.vehicle.licensePlate}
                  onChange={handleVehicleChange}
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Distance (km)
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={tripInfo.distance}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={tripInfo.duration}
                  onChange={handleChange}
                  min="0"
                  required
                  className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="recurrence"
                className="block text-sm font-medium text-gray-700"
              >
                Recurrence
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={tripInfo.recurrence.isRecurring}
                    onChange={(e) =>
                      setTripInfo((prev) => ({
                        ...prev,
                        recurrence: {
                          ...prev.recurrence,
                          isRecurring: e.target.checked,
                        },
                      }))
                    }
                    className="form-checkbox h-5 w-5 text-[${PRIMARY_COLOR}]"
                  />
                  <span className="ml-2">Is this a recurring trip?</span>
                </label>
              </div>
              {tripInfo.recurrence.isRecurring && (
                <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="frequency"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Frequency
                    </label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={tripInfo.recurrence.frequency}
                      onChange={(e) =>
                        setTripInfo((prev) => ({
                          ...prev,
                          recurrence: {
                            ...prev.recurrence,
                            frequency: e.target.value as
                              | "Daily"
                              | "Weekly"
                              | "Monthly",
                          },
                        }))
                      }
                      required={tripInfo.recurrence.isRecurring}
                      className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                    >
                      <option value="">Select frequency</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={tripInfo.recurrence.endDate}
                      onChange={(e) =>
                        setTripInfo((prev) => ({
                          ...prev,
                          recurrence: {
                            ...prev.recurrence,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      required={tripInfo.recurrence.isRecurring}
                      className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="allowedLuggage"
                className="block text-sm font-medium text-gray-700"
              >
                Allowed Luggage
              </label>
              <input
                type="text"
                id="allowedLuggage"
                name="allowedLuggage"
                value={tripInfo.allowedLuggage}
                onChange={handleChange}
                placeholder="e.g., 1 suitcase, 1 carry-on"
                className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amenities
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  "WiFi",
                  "Air Conditioning",
                  "Pet Friendly",
                  "Smoking Allowed",
                ].map((amenity) => (
                  <label key={amenity} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={amenity}
                      checked={tripInfo.amenities.includes(amenity)}
                      onChange={handleAmenitiesChange}
                      className="form-checkbox h-5 w-5 text-[${PRIMARY_COLOR}]"
                    />
                    <span className="ml-2">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={tripInfo.notes}
                onChange={handleChange}
                rows={3}
                className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[${PRIMARY_COLOR}] focus:ring focus:ring-[${SECONDARY_COLOR}] focus:ring-opacity-50`}
                placeholder="Any additional information or special instructions..."
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
        </div>
      </div>
    </div>
  );
};

export default withAuth(CreateTrip);
