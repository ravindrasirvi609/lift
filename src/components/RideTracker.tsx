"use client";
import { useEffect, useState } from "react";
import Map from "./Map";
import Chat from "./Chat";
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

      socket.on("location-updated", ({ location }) => {
        setCurrentLocation(location);
      });
    }

    return () => {
      if (socket) {
        socket.off("location-updated");
      }
    };
  }, [socket, isConnected, rideId]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-center mb-4">
        <button
          className={`flex items-center px-4 py-2 rounded-l-lg ${
            activeTab === "map"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("map")}
        >
          <FaMap className="mr-2" /> Map
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-r-lg ${
            activeTab === "chat"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <FaComments className="mr-2" /> Chat
        </button>
      </div>
      <div className="mt-4">
        {activeTab === "map" ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Live Ride Tracker
            </h2>
            <Map currentLocation={currentLocation} destination={destination} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700">Ride Chat</h2>
            <Chat rideId={rideId} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RideTracker;
