"use client";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaMoneyBillWave,
  FaCar,
  FaInfoCircle,
  FaArrowRight,
} from "react-icons/fa";
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-[#F9D423] to-[#F96167] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-white">
            Share your journey and reduce your carbon footprint!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Trip Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="startLocation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaMapMarkerAlt className="inline mr-2 text-[#F96167]" />
                    From
                  </label>
                  <AutocompleteInput
                    placeholder="Enter departure city"
                    value={tripInfo.startLocation.address}
                    onChange={handleLocationChange("startLocation")}
                    aria-label="Departure Location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  />
                </div>
                <FaArrowRight className="text-2xl text-gray-400" />
                <div className="flex-1">
                  <label
                    htmlFor="endLocation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaMapMarkerAlt className="inline mr-2 text-[#F96167]" />
                    To
                  </label>
                  <AutocompleteInput
                    placeholder="Enter destination city"
                    value={tripInfo.endLocation.address}
                    onChange={handleLocationChange("endLocation")}
                    aria-label="Destination"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="departureTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaClock className="inline mr-2 text-[#F96167]" />
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="estimatedArrivalTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaClock className="inline mr-2 text-[#F96167]" />
                    Estimated Arrival
                  </label>
                  <input
                    type="datetime-local"
                    id="estimatedArrivalTime"
                    name="estimatedArrivalTime"
                    value={tripInfo.estimatedArrivalTime}
                    onChange={handleChange}
                    min={tripInfo.departureTime || minDateTime}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="availableSeats"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaUsers className="inline mr-2 text-[#F96167]" />
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaMoneyBillWave className="inline mr-2 text-[#F96167]" />
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="vehicleType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaCar className="inline mr-2 text-[#F96167]" />
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="car">Car</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaInfoCircle className="inline mr-2 text-[#F96167]" />
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={tripInfo.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9D423] focus:border-transparent"
                  placeholder="Any additional information for your passengers..."
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-[#F9D423] to-[#F96167] hover:from-[#F96167] hover:to-[#F9D423] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F96167] transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  {isLoading ? "Creating Your Trip..." : "Publish Your Trip"}
                </button>
              </div>

              {success && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Trip created successfully! Redirecting you to the trip
                  details...
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <FaInfoCircle className="mr-2" />
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Share Your Ride?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <FaMoneyBillWave className="mx-auto text-4xl text-[#F96167] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Split fuel costs and reduce your travel expenses.
              </p>
            </div>
            <div>
              <FaUsers className="mx-auto text-4xl text-[#F96167] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Meet New People</h3>
              <p className="text-gray-600">
                Connect with fellow travelers and make new friends.
              </p>
            </div>
            <div>
              <FaCar className="mx-auto text-4xl text-[#F96167] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reduce Traffic</h3>
              <p className="text-gray-600">
                Help decrease congestion and lower carbon emissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CreateTrip);
