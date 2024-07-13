import React from "react";
import Image from "next/image";
import { Ride } from "./Ride";
import Link from "next/link";
import {
  FaStar,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";

interface Props {
  rides: Ride[];
}

const AvailableRides: React.FC<Props> = ({ rides }) => {
  return (
    <div className="space-y-6">
      {rides.map((ride) => (
        <div
          key={ride._id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Image
                  src={ride.driver.image}
                  alt={ride.driver.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-[#F9D423]"
                  width={64}
                  height={64}
                />
                <div>
                  <h3 className="font-semibold text-lg">{ride.driver.name}</h3>
                  <div className="flex items-center">
                    <FaStar className="text-[#F9D423] mr-1" />
                    <span>{ride?.driver?.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#F96167]">
                  ${ride.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {ride.availableSeats} seats left
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <FaCar className="text-[#F96167] mr-2" />
                <span>{ride.vehicle}</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-[#F96167] mr-2" />
                <span>{ride.availableSeats} available seats</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-[#F96167] mr-2" />
                <span>{ride.startLocation.city}</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-[#F96167] mr-2" />
                <span>{ride.endLocation.city}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-[#F96167] mr-2" />
                <span>{new Date(ride.departureTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-[#F96167] mr-2" />
                <span>
                  {new Date(ride.estimatedArrivalTime).toLocaleString()}
                </span>
              </div>
            </div>

            <Link href={`/book/${ride._id}`}>
              <button className="w-full bg-[#F96167] text-white py-3 rounded-lg font-semibold transition duration-300 hover:bg-[#F9D423] hover:text-[#F96167]">
                Book This Ride
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableRides;
