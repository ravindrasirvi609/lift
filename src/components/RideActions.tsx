import { useRideActions } from "@/app/hooks/useRideActions";
import React from "react";
import { FaPlay, FaStop, FaClock, FaCheckCircle } from "react-icons/fa";

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
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-[#F96167]">
        Ride Actions
      </h3>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {status === "Scheduled" && (
          <button
            onClick={handleStartRide}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#F9D423] text-gray-800 rounded-lg hover:bg-[#f7c800] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F9D423] focus:ring-opacity-50 disabled:opacity-50 shadow-md"
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
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#F96167] text-white rounded-lg hover:bg-[#f84b52] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-opacity-50 disabled:opacity-50 shadow-md"
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
          <div className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg shadow-md">
            <FaCheckCircle className="mr-2" />
            Ride Completed
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 flex items-center">
          <FaStop className="mr-2 text-red-500" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
