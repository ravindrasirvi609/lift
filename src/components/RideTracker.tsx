"use client";
import React, { useState, useEffect } from "react";
import DynamicMap from "./DynamicMap";
import DynamicChat from "./DynamicChat";
import { useSocket } from "@/app/hooks/useSocket";
import { FaMap, FaComments } from "react-icons/fa";

interface RideTrackerProps {
  rideId: string;
  userId: string;
  initialLocation: [number, number];
  destination: [number, number];
}

const RideTracker: React.FC<RideTrackerProps> = ({
  rideId,
  userId,
  initialLocation,
  destination,
}) => {
  const { socket, isConnected } = useSocket();
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [activeTab, setActiveTab] = useState<"map" | "chat">("map");

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-ride", rideId);

      socket.on("location-update", (data: { location: [number, number] }) => {
        setCurrentLocation(data.location);
      });

      return () => {
        socket.off("location-update");
      };
    }
  }, [socket, isConnected, rideId]);

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
        {activeTab === "map" ? (
          <DynamicMap
            rideId={rideId}
            initialLocation={initialLocation}
            destination={destination}
            currentLocation={currentLocation}
          />
        ) : (
          <DynamicChat rideId={rideId} userId={userId} />
        )}
      </div>
    </div>
  );
};

export default RideTracker;
