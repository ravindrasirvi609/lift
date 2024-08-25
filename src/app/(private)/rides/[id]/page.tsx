"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RideTracker from "@/components/RideTracker";
import { RideActions } from "@/components/RideActions";
import { useRideActions } from "@/app/hooks/useRideActions";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { formatDateWithTime } from "@/utils/utils";
import {
  FaMapMarkerAlt,
  FaUser,
  FaCar,
  FaInfoCircle,
  FaClock,
  FaRupeeSign,
  FaSuitcase,
  FaWifi,
  FaSnowflake,
  FaPaw,
  FaMapMarkedAlt,
  FaRoad,
  FaHourglass,
} from "react-icons/fa";

interface Location {
  coordinates: [number, number];
  city: string;
  region: string;
  locationId: string;
  address: string;
}

interface IntermediateStop extends Location {
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
}

interface Vehicle {
  type: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

interface DataType {
  _id: string;
  startLocation: Location;
  endLocation: Location;
  intermediateStops: IntermediateStop[];
  driver: {
    _id: string;
    fullName: string;
  };
  passengers: {
    _id: string;
    fullName: string;
  }[];
  vehicle: Vehicle;
  status: string;
  departureTime: string;
  estimatedArrivalTime: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  price: number;
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  distance: number;
  duration: number;
  allowedLuggage: string;
  amenities: string[];
  notes: string;
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
        router.push(`/ride-complete/${id}`);
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
                value={`${rideData.startLocation.address}, ${rideData.startLocation.city}`}
                iconColor="text-green-500"
              />
              <InfoItem
                icon={FaMapMarkerAlt}
                label="To"
                value={`${rideData.endLocation.address}, ${rideData.endLocation.city}`}
                iconColor="text-[#F96167]"
              />
              <InfoItem
                icon={FaCar}
                label="Driver"
                value={rideData.driver.fullName}
                iconColor="text-blue-500"
              />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2 text-[#F96167]">
                  Passengers
                </h3>
                {rideData.passengers.map((passenger, index) => (
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
              <InfoItem
                icon={FaUser}
                label="Available Seats"
                value={`${rideData.availableSeats} / ${rideData.totalSeats}`}
                iconColor="text-yellow-500"
              />
              <StatusBadge status={rideData.status} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                Ride Details
              </h2>
              <InfoItem
                icon={FaClock}
                label="Departure Time"
                value={formatDateWithTime(new Date(rideData.departureTime))}
                iconColor="text-[#F9D423]"
              />
              <InfoItem
                icon={FaClock}
                label="Estimated Arrival Time"
                value={formatDateWithTime(
                  new Date(rideData.estimatedArrivalTime)
                )}
                iconColor="text-[#F9D423]"
              />
              <InfoItem
                icon={FaRupeeSign}
                label="Price per Seat"
                value={`₹${rideData?.pricePerSeat?.toFixed(2)}`}
                iconColor="text-green-500"
              />
              <InfoItem
                icon={FaRoad}
                label="Distance"
                value={`${rideData?.distance?.toFixed(2)} km`}
                iconColor="text-gray-500"
              />
              <InfoItem
                icon={FaHourglass}
                label="Duration"
                value={`${Math.floor(rideData.duration / 60)} hours ${
                  rideData.duration % 60
                } minutes`}
                iconColor="text-orange-500"
              />
              <InfoItem
                icon={FaSuitcase}
                label="Allowed Luggage"
                value={rideData.allowedLuggage}
                iconColor="text-indigo-500"
              />
              <div className="flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                <strong className="mr-2">Amenities:</strong>
                <div className="flex space-x-2">
                  {rideData.amenities.includes("WiFi") && (
                    <FaWifi className="text-blue-500" title="WiFi" />
                  )}
                  {rideData.amenities.includes("Air Conditioning") && (
                    <FaSnowflake
                      className="text-blue-300"
                      title="Air Conditioning"
                    />
                  )}
                  {rideData.amenities.includes("Pet Friendly") && (
                    <FaPaw className="text-brown-500" title="Pet Friendly" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={FaCar}
                label="Vehicle"
                value={`${rideData.vehicle.make} ${rideData.vehicle.model} (${rideData.vehicle.year})`}
                iconColor="text-gray-500"
              />
              <InfoItem
                icon={FaCar}
                label="Color"
                value={rideData.vehicle.color}
                iconColor="text-gray-500"
              />
              <InfoItem
                icon={FaCar}
                label="License Plate"
                value={rideData.vehicle.licensePlate}
                iconColor="text-gray-500"
              />
              <InfoItem
                icon={FaCar}
                label="Vehicle Type"
                value={rideData.vehicle.type}
                iconColor="text-gray-500"
              />
            </div>
          </div>

          {rideData.intermediateStops.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                Intermediate Stops
              </h2>
              {rideData.intermediateStops.map((stop, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <InfoItem
                    icon={FaMapMarkedAlt}
                    label={`Stop ${index + 1}`}
                    value={`${stop.address}, ${stop.city}`}
                    iconColor="text-purple-500"
                  />
                  <InfoItem
                    icon={FaClock}
                    label="Estimated Arrival"
                    value={formatDateWithTime(
                      new Date(stop.estimatedArrivalTime)
                    )}
                    iconColor="text-[#F9D423]"
                  />
                  {stop.actualArrivalTime && (
                    <InfoItem
                      icon={FaClock}
                      label="Actual Arrival"
                      value={formatDateWithTime(
                        new Date(stop.actualArrivalTime)
                      )}
                      iconColor="text-green-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {rideData.notes && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-[#F96167]">
                Additional Notes
              </h2>
              <p className="bg-gray-100 p-4 rounded-lg">{rideData.notes}</p>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <RideActions
              rideId={id}
              status={rideData.status}
              onRideUpdate={handleRideUpdate}
              isDriver={isDriver}
            />
            {isDriver && (
              <Link href="/driver/requests">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Check Requests
                </button>
              </Link>
            )}
          </div>
          {error && <p className="text-[#F96167] mt-2">{error}</p>}
        </div>
        <RideTracker
          rideId={id}
          userId={userId}
          initialLocation={rideData.startLocation}
          destination={rideData.endLocation}
          intermediateStops={rideData.intermediateStops.map((stop) => stop)}
          isDriver={isDriver}
          passengers={rideData.passengers}
          status={rideData.status}
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
          : status === "Cancelled"
          ? "bg-red-500"
          : "bg-[#F9D423]"
      }`}
    >
      {status}
    </span>
  </div>
);

export default RidePage;
