"use client";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import AutocompleteInput from "@/components/AutocompleteInput";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { useAuth } from "@/app/contexts/AuthContext";
import Loading from "@/components/Loading";

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
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number;
  price: number;
  vehicle: {
    type: string;
  };
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
    departureTime: "",
    estimatedArrivalTime: "",
    availableSeats: 1,
    price: 0,
    vehicle: { type: "" },
    notes: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [minDateTime, setMinDateTime] = useState("");

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  const handleLocationChange = useCallback(
    (field: "startLocation" | "endLocation") => (value: LocationAddress) => {
      setTripInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  if (!user || !user.isDriver) return <Loading />;

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
      const response = await axios.post("/api/ride/createRide", tripInfo);
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
        departureTime: "",
        estimatedArrivalTime: "",
        availableSeats: 1,
        price: 0,
        vehicle: { type: "" },
        notes: "",
      });
      console.log("response", response);

      router.push(`/rides/${response.data.ride._id}`);
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
    <div className="min-h-screen bg-gradient-to-b from-[#F9D423] to-[#F96167] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#F9D423] py-6 px-8">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Create Your Trip
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                min={minDateTime}
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9D423] focus:ring-opacity-50"
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
                min={tripInfo.departureTime || minDateTime}
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9D423] focus:ring-opacity-50"
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
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9D423] focus:ring-opacity-50"
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
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9D423] focus:ring-opacity-50"
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
                name="type"
                value={tripInfo.vehicle.type}
                onChange={(e) =>
                  setTripInfo((prev) => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, type: e.target.value },
                  }))
                }
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9D423] focus:ring-opacity-50"
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
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F9D423] focus:ring focus:ring-[#F9D423] focus:ring-opacity-50"
                placeholder="Any additional information..."
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F96167] hover:bg-[#F9D423] hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F96167] transition duration-150 ease-in-out"
              >
                {isLoading ? "Creating Trip..." : "Create Trip"}
              </button>
              <div className="mt-4">
                {success && (
                  <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                    Trip created successfully!
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CreateTrip);
