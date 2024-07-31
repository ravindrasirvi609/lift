"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RideTracker from "@/components/RideTracker";
import { RideActions } from "@/components/RideActions";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  passengers: {
    _id: string;
    fullName: string;
  }[];
  status: string;
  departureTime: string;
  estimatedArrivalTime: string;
  price: number;
  availableSeats?: number;
}

const RidePage = () => {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.id ?? "";
  const id = params.id as string;
  const [rideData, setRideData] = useState<null | DataType>(null);
  const { startRide, endRide, cancelRide, isLoading, error } = useRideActions();

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

  const handleRideUpdate = async (action: "start" | "end" | "cancel") => {
    try {
      if (action === "start") {
        await startRide(id);
      } else if (action === "end") {
        await endRide(id);
        router.push("/driver/requests");
      } else {
        await cancelRide(id);
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

  const isDriver = userId === rideData.driver._id;

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
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                  Passengers
                </h2>
                {rideData?.passengers?.map((passenger, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <InfoItem
                      icon={FaUser}
                      label={`Passenger ${index + 1}`}
                      value={passenger.fullName}
                      iconColor="text-purple-500"
                    />
                    <Link href={`/profile/${passenger._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        View Profile
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
              {isDriver && (
                <InfoItem
                  icon={FaUser}
                  label="Available Seats"
                  value={rideData.availableSeats}
                  iconColor="text-yellow-500"
                />
              )}
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
                value={`₹${rideData.price.toFixed(2)}`}
                iconColor="text-green-500"
              />
              {isDriver && (
                <div className="flex justify-between items-center">
                  <Link href={"/driver/requests"}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Check Requests
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <RideActions
              rideId={id}
              status={rideData.status}
              onRideUpdate={handleRideUpdate}
              isDriver={isDriver}
            />
          </div>
          {error && <p className="text-[#F96167] mt-2">{error}</p>}
        </div>
        <RideTracker
          rideId={id}
          userId={userId}
          initialLocation={rideData.startLocation.coordinates}
          destination={rideData.endLocation.coordinates}
          isDriver={isDriver}
          passengers={rideData.passengers}
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
