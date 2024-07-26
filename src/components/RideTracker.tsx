"use client";
import { useEffect, useState } from "react";
import Map from "./Map";
import Chat from "./Chat";
import { useSocket } from "@/app/hooks/useSocket";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Ride Tracker</h2>
        <Map currentLocation={currentLocation} destination={destination} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <Chat rideId={rideId} userId={userId} />
      </div>
    </div>
  );
};

export default RideTracker;
