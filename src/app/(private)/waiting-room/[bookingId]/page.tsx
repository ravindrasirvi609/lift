"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/app/hooks/useSocket";
import { useParams } from "next/navigation";

const WaitingRoom: React.FC = () => {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [status, setStatus] = useState<"waiting" | "confirmed" | "cancelled">(
    "waiting"
  );
  const [data, setData] = useState<any>(null);
  const { bookingId } = useParams();

  useEffect(() => {
    const getRideDetails = async () => {
      try {
        const response = await fetch("/api/ride/find-by-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Ride details:", data.ride._id);
          setData(data);
        } else {
          console.error("Failed to fetch ride details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
      }
    };

    getRideDetails();
  }, [bookingId, router]);

  useEffect(() => {
    if (socket && isConnected && bookingId) {
      console.log(`Joining room for booking: ${bookingId}`);
      socket.emit("join-ride", bookingId);

      socket.on(
        "ride-status",
        (data: { bookingId: string; status: "confirmed" | "cancelled" }) => {
          console.log("Received ride-status event:", data);
          if (data.bookingId === bookingId) {
            setStatus(data.status);
            console.log("Updated status:", data.status);
          }
        }
      );

      return () => {
        console.log(`Leaving room for booking: ${bookingId}`);
        socket.off("ride-status");
        socket.emit("leave-ride", bookingId);
      };
    }
  }, [socket, isConnected, bookingId]);

  const handleRedirectToRide = () => {
    router.push(`/rides/${data.ride._id}`);
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

        {status === "confirmed" && (
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

        {status === "cancelled" && (
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
