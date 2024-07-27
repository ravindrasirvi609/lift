"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RideTracker from "@/components/RideTracker";
import { RideActions } from "@/components/RideActions";
import RideReviewForm from "@/components/RideReviewForm";
import { useRideActions } from "@/app/hooks/useRideActions";
import {
  FaMapMarkerAlt,
  FaUser,
  FaCar,
  FaInfoCircle,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { useAuth } from "@/app/contexts/AuthContext";

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
  const userId = useAuth().user?.id ?? "";
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
      console.log("data", data);

      setRideData(data);
    } catch (error) {
      console.error("Failed to fetch ride data:", error);
    }
  };

  console.log("userId", userId);

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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F96167]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9D423] to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#F96167]">
          Ride Details
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                Trip Information
              </h2>
              <InfoItem
                icon={FaMapMarkerAlt}
                label="From"
                value={rideData.startLocation?.city}
                iconColor="text-green-500"
              />
              <InfoItem
                icon={FaMapMarkerAlt}
                label="To"
                value={rideData.endLocation?.city}
                iconColor="text-[#F96167]"
              />
              <InfoItem
                icon={FaCar}
                label="Driver"
                value={rideData.driver.fullName}
                iconColor="text-blue-500"
              />
              <InfoItem
                icon={FaUser}
                label="Passenger"
                value={rideData.passenger?.fullName}
                iconColor="text-purple-500"
              />
              <StatusBadge status={rideData.status} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                Ride Details
              </h2>
              <InfoItem
                icon={FaClock}
                label="Departure"
                value={new Date(rideData.departureTime).toLocaleString()}
                iconColor="text-[#F9D423]"
              />
              <InfoItem
                icon={FaClock}
                label="Estimated Arrival"
                value={new Date(rideData.estimatedArrivalTime).toLocaleString()}
                iconColor="text-[#F9D423]"
              />
              <InfoItem
                icon={FaDollarSign}
                label="Price"
                value={`$${rideData.price.toFixed(2)}`}
                iconColor="text-green-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <RideActions
              rideId={id}
              status={rideData.status}
              onRideUpdate={handleRideUpdate}
            />
            {error && <p className="text-[#F96167] mt-2">{error}</p>}
          </div>
        </div>
        <RideTracker
          rideId={id}
          userId={userId}
          initialLocation={rideData.startLocation.coordinates}
          destination={rideData.endLocation.coordinates}
        />
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, iconColor }: any) => (
  <p className="flex items-center text-gray-700">
    <Icon className={`mr-2 ${iconColor}`} />
    <strong className="mr-2">{label}:</strong> {value}
  </p>
);

const StatusBadge = ({ status }: any) => (
  <div className="flex items-center">
    <FaInfoCircle className="mr-2 text-[#F9D423]" />
    <strong className="mr-2">Status:</strong>
    <span
      className={`px-3 py-1 rounded-full text-white ${
        status === "Completed"
          ? "bg-green-500"
          : status === "In Progress"
          ? "bg-blue-500"
          : "bg-[#F9D423]"
      }`}
    >
      {status}
    </span>
  </div>
);

export default RidePage;
