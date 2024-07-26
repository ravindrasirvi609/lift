"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Map from "./Map";
import Chat from "./Chat";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      const newSocket = io();
      setSocket(newSocket);

      newSocket.emit("join-ride", rideId);

      newSocket.on("location-updated", ({ location }) => {
        setCurrentLocation(location);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [rideId, socket]);

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
