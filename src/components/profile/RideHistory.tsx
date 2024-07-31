import { Ride } from "@/types/types";
import { formatDate } from "@/utils/utils";
import Link from "next/link";

interface RideHistoryProps {
  rides: Ride[];
  userType: "driver" | "passenger";
}

export const RideHistory: React.FC<RideHistoryProps> = ({
  rides,
  userType,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Recent Rides</h3>
      {rides.map((ride) => (
        <Link href={`/rides/${ride._id}`} key={ride._id}>
          <div key={ride._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <span>{formatDate(new Date(ride.departureTime))}</span>
              <span className="font-medium">₹{ride.price.toFixed(2)}</span>
            </div>
            <div className="mt-2">
              <p>From: {ride.startLocation.city}</p>
              <p>To: {ride.endLocation.city}</p>
            </div>
            {/* <p className="mt-2 text-sm text-gray-600">
            {userType === "driver" ? "Passenger" : "Driver"}:{" "}
            {ride.otherUserName}
          </p> */}
          </div>
        </Link>
      ))}
    </div>
  );
};
