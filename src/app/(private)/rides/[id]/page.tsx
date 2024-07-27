"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RideTracker from "@/components/RideTracker";
import { RideActions } from "@/components/RideActions";
import RideReviewForm from "@/components/RideReviewForm";
import { useRideActions } from "@/app/hooks/useRideActions";
import { FaMapMarkerAlt, FaUser, FaCar, FaInfoCircle } from "react-icons/fa";

interface DataType {
  _id: string;
  startLocation: {
    city: string;
    coordinates: [number, number];
  };
  endLocation: {
    city: string;
    coordinates: [number, number];
  };
  driver: {
    _id: string;
    fullName: string;
  };
  passenger: {
    _id: string;
    fullName: string;
  };
  status: string;
  departureTime: string;
  estimatedArrivalTime: string;
  price: number;
}

const RidePage = () => {
  const params = useParams();
  const id = params.id as string;
  const [rideData, setRideData] = useState<null | DataType>(null);
  const { startRide, endRide, isLoading, error } = useRideActions();

  useEffect(() => {
    if (id) {
      fetchRideData();
    }
  }, [id]);

  const fetchRideData = async () => {
    try {
      const response = await fetch(`/api/ride/${id}`);
      const data = await response.json();
      setRideData(data);
    } catch (error) {
      console.error("Failed to fetch ride data:", error);
    }
  };

  const handleRideUpdate = async (action: "start" | "end") => {
    try {
      if (action === "start") {
        await startRide(id);
      } else {
        await endRide(id);
      }
      await fetchRideData();
    } catch (error) {
      console.error(`Failed to ${action} ride:`, error);
    }
  };

  if (!rideData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Ride Details
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Trip Information
            </h2>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                <strong>From:</strong> {rideData.startLocation.city}
              </p>
              <p className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                <strong>To:</strong> {rideData.endLocation.city}
              </p>
              <p className="flex items-center text-gray-600">
                <FaCar className="mr-2 text-blue-500" />
                <strong>Driver:</strong> {rideData.driver.fullName}
              </p>
              <p className="flex items-center text-gray-600">
                <FaUser className="mr-2 text-purple-500" />
                <strong>Passenger:</strong> {rideData.passenger.fullName}
              </p>
              <p className="flex items-center text-gray-600">
                <FaInfoCircle className="mr-2 text-yellow-500" />
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-white ${
                    rideData.status === "Completed"
                      ? "bg-green-500"
                      : rideData.status === "In Progress"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {rideData.status}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Ride Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <strong>Departure:</strong>{" "}
                {new Date(rideData.departureTime).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Estimated Arrival:</strong>{" "}
                {new Date(rideData.estimatedArrivalTime).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Price:</strong> ${rideData.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <RideActions
            rideId={id}
            status={rideData.status}
            onRideUpdate={handleRideUpdate}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <RideTracker
        rideId={id}
        userId={rideData.passenger._id}
        initialLocation={rideData.startLocation.coordinates}
        destination={rideData.endLocation.coordinates}
      />
      {rideData.status === "Completed" && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Rate Your Ride
          </h2>
          <RideReviewForm rideId={id} driverId={rideData.driver._id} />
        </div>
      )}
    </div>
  );
};

export default RidePage;
