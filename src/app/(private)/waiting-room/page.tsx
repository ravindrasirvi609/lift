"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/app/hooks/useSocket";

const WaitingRoom: React.FC = () => {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [status, setStatus] = useState<"waiting" | "accepted" | "rejected">(
    "waiting"
  );

  useEffect(() => {
    if (socket) {
      socket.on("ride_status", (data: { status: "accepted" | "rejected" }) => {
        setStatus(data.status);
      });
    }

    return () => {
      if (socket) {
        socket.off("ride_status");
      }
    };
  }, [socket]);

  const handleRedirectToRide = () => {
    router.push("/ride");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Waiting Room</h1>

        {!isConnected && (
          <p className="text-red-500 text-center mb-4">
            Connecting to server...
          </p>
        )}

        {status === "waiting" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">
              Waiting for a driver to accept your request...
            </p>
          </div>
        )}

        {status === "accepted" && (
          <div className="text-center">
            <p className="text-lg text-green-600 mb-4">
              A driver has accepted your ride!
            </p>
            <button
              onClick={handleRedirectToRide}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Ride Page
            </button>
          </div>
        )}

        {status === "rejected" && (
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">
              Sorry, your ride request was rejected.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
