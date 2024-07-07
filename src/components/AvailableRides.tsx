import Image from "next/image";
import React from "react";
import {
  FaCar,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface Driver {
  id: string;
  name: string;
  image: string;
  isVerified: boolean;
  rating: number;
}

interface Ride {
  id: string;
  driver: Driver;
  travelTime: string;
  price: number;
  departureTime: string;
  availableSeats: number;
}

interface AvailableRidesProps {
  rides: Ride[];
}

const AvailableRides: React.FC<AvailableRidesProps> = ({ rides }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Rides</h2>
      {rides.map((ride) => (
        <div
          key={ride.id}
          className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={ride.driver.image}
                alt={ride.driver.name}
                className="w-16 h-16 rounded-full object-cover"
                width={48}
                height={48}
              />
              <div>
                <h3 className="text-lg font-semibold">{ride.driver.name}</h3>
                <div className="flex items-center mt-1">
                  {ride.driver.isVerified ? (
                    <FaCheckCircle className="text-green-500 mr-1" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-1" />
                  )}
                  <span>
                    {ride.driver.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="text-yellow-500 mt-1">
                  {"★".repeat(Math.floor(ride.driver.rating))}
                  {"☆".repeat(5 - Math.floor(ride.driver.rating))}
                  <span className="text-gray-600 ml-1">
                    ({ride.driver.rating.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ₹{ride.price}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center">
              <FaClock className="mr-2" />
              <span>Travel time: {ride.travelTime}</span>
            </div>
            <div className="flex items-center">
              <FaCar className="mr-2" />
              <span>Available seats: {ride.availableSeats}</span>
            </div>
            <div>
              <span>Departure: {ride.departureTime}</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableRides;
