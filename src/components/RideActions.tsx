import { useRideActions } from "@/app/hooks/useRideActions";
import React from "react";
import { FaPlay, FaStop, FaClock } from "react-icons/fa";

interface RideActionsProps {
  rideId: string;
  status: string;
  onRideUpdate: (action: "start" | "end") => Promise<void>;
}

export function RideActions({
  rideId,
  status,
  onRideUpdate,
}: RideActionsProps) {
  const { startRide, endRide, isLoading, error } = useRideActions();

  const handleStartRide = async () => {
    try {
      await startRide(rideId);
      onRideUpdate("start");
    } catch (err) {
      console.error("Failed to start ride:", err);
    }
  };

  const handleEndRide = async () => {
    try {
      await endRide(rideId);
      onRideUpdate("end");
    } catch (err) {
      console.error("Failed to end ride:", err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Ride Actions</h3>
      <div className="flex items-center space-x-4">
        {status === "Scheduled" && (
          <button
            onClick={handleStartRide}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <FaClock className="animate-spin mr-2" />
                Starting...
              </span>
            ) : (
              <>
                <FaPlay className="mr-2" />
                Start Ride
              </>
            )}
          </button>
        )}
        {status === "In Progress" && (
          <button
            onClick={handleEndRide}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <FaClock className="animate-spin mr-2" />
                Ending...
              </span>
            ) : (
              <>
                <FaStop className="mr-2" />
                End Ride
              </>
            )}
          </button>
        )}
        {status === "Completed" && (
          <div className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
            <FaStop className="mr-2" />
            Ride Completed
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-red-500 bg-red-100 border border-red-400 rounded-lg p-2">
          {error}
        </p>
      )}
    </div>
  );
}
