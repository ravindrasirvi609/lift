import React from "react";
import Image from "next/image";
import { Ride } from "./Ride";
import Link from "next/link";

interface Props {
  rides: Ride[];
}

const AvailableRides: React.FC<Props> = ({ rides }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rides.map((ride) => (
        <div key={ride._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Image
              src={ride.driver.image}
              alt={ride.driver.name}
              className="w-12 h-12 rounded-full mr-4"
              width={48}
              height={48}
            />
            <div>
              <h3 className="font-semibold">{ride.driver.name}</h3>
              <p className="text-sm text-gray-600">
                Rating: {ride.driver.rating}
              </p>
            </div>
          </div>
          <p>Vehicle: {ride.vehicle}</p>
          <p>From: {ride.startLocation.city}</p>
          <p>To: {ride.endLocation.city}</p>
          <p>Departure: {new Date(ride.departureTime).toLocaleString()}</p>
          <p>
            Estimated Arrival:{" "}
            {new Date(ride.estimatedArrivalTime).toLocaleString()}
          </p>
          <p>Available Seats: {ride.availableSeats}</p>
          <p className="font-bold mt-2">Price: {ride.price}</p>
          <Link href={`/book/${ride._id}`}>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Book Now
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AvailableRides;
