import { useRideActions } from "@/app/hooks/useRideActions";
import React, { useState } from "react";
import {
  FaPlay,
  FaStop,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface RideActionsProps {
  rideId: string;
  status: string;
  onRideUpdate: (action: "start" | "end" | "cancel") => Promise<void>;
  isDriver: boolean;
}

export function RideActions({
  rideId,
  status,
  onRideUpdate,
  isDriver,
}: RideActionsProps) {
  const { startRide, endRide, cancelRide, isLoading, error } = useRideActions();
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

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

  const handleCancelRide = async () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancelRide = async () => {
    try {
      await cancelRide(rideId);
      onRideUpdate("cancel");
    } catch (err) {
      console.error("Failed to cancel ride:", err);
    } finally {
      setShowCancelConfirmation(false);
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

        {isDriver && status === "Scheduled" && (
          <button
            onClick={handleCancelRide}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#f54e54] text-white rounded-lg hover:bg-[#F96167] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F9D423] focus:ring-opacity-50 disabled:opacity-50 shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center">
                <FaClock className="animate-spin mr-2" />
                Cancelling...
              </span>
            ) : (
              <>
                <FaStop className="mr-2" />
                Cancel Ride
              </>
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 flex items-center">
          <FaStop className="mr-2 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-[#F96167]">
              <FaExclamationTriangle className="mr-2" />
              Confirm Cancellation
            </h3>
            <p className="mb-6">Are you sure you want to cancel this ride?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                No, Keep Ride
              </button>
              <button
                onClick={confirmCancelRide}
                className="px-4 py-2 bg-[#F96167] text-white rounded-lg hover:bg-[#f84b52] transition duration-300"
              >
                Yes, Cancel Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
