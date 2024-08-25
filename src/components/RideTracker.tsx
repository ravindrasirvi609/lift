"use client";
import React, { useState, useEffect } from "react";
import DynamicMap from "./DynamicMap";
import DynamicChat from "./DynamicChat";
import { useSocket } from "@/app/hooks/useSocket";
import { FaMap, FaComments, FaMapMarkedAlt } from "react-icons/fa";

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
  const { socket, isConnected } = useSocket();
  const [currentLocation, setCurrentLocation] = useState(
    initialLocation.coordinates
  );
  const [activeTab, setActiveTab] = useState<"map" | "chat" | "stops">("map");
  const [arrivedStops, setArrivedStops] = useState<string[]>([]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-ride", rideId);

      socket.on("location-update", (data: { location: [number, number] }) => {
        setCurrentLocation(data.location);
      });

      socket.on("stop-arrived", (stopId: string) => {
        setArrivedStops((prev) => [...prev, stopId]);
      });

      return () => {
        socket.off("location-update");
        socket.off("stop-arrived");
      };
    }
  }, [socket, isConnected, rideId]);

  const handleStopArrival = (stopId: string) => {
    if (isDriver && status === "In Progress" && socket) {
      socket.emit("mark-stop-arrived", { rideId, stopId });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
          <FaMapMarkedAlt className="mr-2" /> Stops
        </button>
        <button
          className={`flex items-center px-6 py-3 rounded-r-lg transition duration-300 ${
            activeTab === "chat"
              ? "bg-[#F96167] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <FaComments className="mr-2" /> Chat
        </button>
      </div>
      <div className="p-6">
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
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">
                Start: {initialLocation.address}, {initialLocation.city}
              </h4>
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
                <h4 className="font-semibold">
                  Stop {index + 1}: {stop.address}, {stop.city}
                </h4>
                <p>
                  Estimated Arrival:{" "}
                  {new Date(stop.estimatedArrivalTime).toLocaleString()}
                </p>
                {arrivedStops.includes(stop.estimatedArrivalTime) &&
                  stop.actualArrivalTime && (
                    <p>
                      Actual Arrival:{" "}
                      {new Date(stop.actualArrivalTime).toLocaleString()}
                    </p>
                  )}
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
            <div className="bg-red-100 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">
                End: {destination.address}, {destination.city}
              </h4>
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
