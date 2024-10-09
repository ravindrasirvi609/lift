import React, { useState, useEffect } from "react";
import { FaMap, FaList, FaComment } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useSocket } from "@/app/hooks/useSocket";
import DynamicChat from "@/components/DynamicChat";
import DynamicMap from "@/components/DynamicMap";

interface Location {
  coordinates: [number, number];
  address: string;
  city: string;
}

interface IntermediateStop extends Location {
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
  coordinates: [number, number];
  address: string;
  city: string;
}

interface RideTrackerProps {
  rideId: string;
  userId: string;
  initialLocation: Location;
  destination: Location;
  intermediateStops: IntermediateStop[];
  isDriver: boolean;
  passengers: { _id: string; fullName: string }[];
  status: string;
}

const RideTracker: React.FC<RideTrackerProps> = ({
  rideId,
  userId,
  initialLocation,
  destination,
  intermediateStops,
  isDriver,
  passengers,
  status,
}) => {
  const [activeTab, setActiveTab] = useState<"map" | "stops" | "chat">("map");
  const [currentLocation, setCurrentLocation] = useState<[number, number]>(
    initialLocation.coordinates
  );
  const [arrivedStops, setArrivedStops] = useState<string[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        console.log("New location:", newLocation);
        setCurrentLocation(newLocation);
      },
      (error) => {
        console.error("Error getting current location:", error);
        // Handle the error based on its code
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Please allow location access to use this feature.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert(
              "Location information is unavailable. Please check your device settings."
            );
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          default:
            alert("An unknown error occurred while trying to get location.");
            break;
        }
        // You might want to set a default location or disable location-dependent features
        setCurrentLocation(initialLocation.coordinates);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [initialLocation.coordinates]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-ride", rideId);

      const handleLocationUpdate = (data: { location: [number, number] }) => {
        setCurrentLocation(data.location);
      };

      const handleStopArrival = (stopId: string) => {
        setArrivedStops((prev) => [...prev, stopId]);
      };

      socket.on("location-update", handleLocationUpdate);
      socket.on("stop-arrived", handleStopArrival);

      return () => {
        socket.off("location-update", handleLocationUpdate);
        socket.off("stop-arrived", handleStopArrival);
      };
    }
  }, [socket, isConnected, rideId]);

  const handleStopArrival = (stopId: string) => {
    if (socket && isConnected) {
      socket.emit("mark-stop-arrived", { rideId, stopId });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Ride Tracker</h2>

      <div className="flex justify-center p-4 bg-gray-100">
        <button
          className={`flex items-center px-6 py-3 rounded-l-lg transition duration-300 ${
            activeTab === "map"
              ? "bg-[#F9D423] text-gray-800"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("map")}
        >
          <FaMap className="mr-2" /> Map
        </button>
        <button
          className={`flex items-center px-6 py-3 transition duration-300 ${
            activeTab === "stops"
              ? "bg-[#F9D423] text-gray-800"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("stops")}
        >
          <FaList className="mr-2" /> Stops
        </button>
        <button
          className={`flex items-center px-6 py-3 rounded-r-lg transition duration-300 ${
            activeTab === "chat"
              ? "bg-[#F9D423] text-gray-800"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <FaComment className="mr-2" /> Chat
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "map" && (
          <DynamicMap
            rideId={rideId}
            initialLocation={initialLocation.coordinates}
            destination={destination.coordinates}
            currentLocation={currentLocation}
            intermediateStops={intermediateStops.map((stop) => ({
              coordinates: stop.coordinates,
              address: `${stop.address}, ${stop.city}`,
            }))}
          />
        )}

        {activeTab === "stops" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Ride Stops</h3>
            <div className="p-4 rounded-lg bg-green-100">
              <p className="font-semibold">Initial Location</p>
              <p>
                {initialLocation.address}, {initialLocation.city}
              </p>
            </div>
            {intermediateStops.map((stop, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  arrivedStops.includes(stop.estimatedArrivalTime)
                    ? "bg-green-100"
                    : "bg-yellow-100"
                }`}
              >
                <p className="font-semibold">Stop {index + 1}</p>
                <p>
                  {stop.address}, {stop.city}
                </p>
                <p>Estimated arrival: {stop.estimatedArrivalTime}</p>
                {isDriver &&
                  status === "In Progress" &&
                  !arrivedStops.includes(stop.estimatedArrivalTime) && (
                    <button
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() =>
                        handleStopArrival(stop.estimatedArrivalTime)
                      }
                    >
                      Mark as Arrived
                    </button>
                  )}
              </div>
            ))}
            <div className="p-4 rounded-lg bg-red-100">
              <p className="font-semibold">Destination</p>
              <p>
                {destination.address}, {destination.city}
              </p>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <DynamicChat
            rideId={rideId}
            userId={userId}
            isDriver={isDriver}
            passengers={passengers}
          />
        )}
      </div>
    </div>
  );
};

export default RideTracker;
