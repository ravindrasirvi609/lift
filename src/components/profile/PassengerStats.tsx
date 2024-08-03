import { User } from "@/types/types";
import React from "react";

interface PassengerStatsProps {
  user: User;
}

const PassengerStats: React.FC<PassengerStatsProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Rating Statistics</h2>
      <div className="text-center">
        <div className="text-6xl font-bold text-[#F96167] mb-2">
          {user.isDriver
            ? user.driverRating.toFixed(1)
            : user.passengerRating.toFixed(1)}
        </div>
        <div className="text-xl font-medium mb-6"> Rating</div>
        <div className="text-4xl font-bold text-[#F96167] mb-2">
          {user.isDriver
            ? user.totalRidesAsDriver
            : user.totalRidesAsTakenPassenger}
        </div>
        <div className="text-xl font-medium">Total Rides Taken</div>
        {/* <div className="mt-4 text-lg">
          Total Distance Traveled: {user.totalDistanceTraveled.toFixed(2)} km
        </div> */}
      </div>
    </div>
  );
};

export default PassengerStats;
