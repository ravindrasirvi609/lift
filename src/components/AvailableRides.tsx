import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaRoute,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Ride } from "@/types/types";
import { formatDateWithTime } from "@/utils/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  rides: Ride[];
}

const AvailableRides: React.FC<Props> = ({ rides }) => {
  console.log("rides", rides);

  useGSAP(() => {
    rides.forEach((_, index) => {
      gsap.from(`#ride-${index}`, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `#ride-${index}`,
          start: "top bottom-=100px",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, [rides]);

  return (
    <div className="space-y-8">
      {rides.map((ride, index) => (
        <motion.div
          key={ride._id}
          id={`ride-${index}`}
          className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <Image
                    src={ride.driver.profilePicture}
                    alt={ride.driver.name}
                    className="w-20 h-20 rounded-full mr-4 border-4 border-[#F9D423]"
                    width={80}
                    height={80}
                  />
                  {ride.driver.isVerified && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-[#F96167] rounded-full p-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaStar className="text-white" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#F96167] hover:text-[#F9D423]">
                    <Link href={`/profile/${ride.driver._id}`}>
                      {ride.driver.firstName} {ride.driver.lastName}
                    </Link>
                  </h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < Math.floor(ride.driver.driverRating)
                            ? "text-[#F9D423]"
                            : "text-gray-300"
                        } mr-1`}
                      />
                    ))}
                    <span className="ml-1 text-gray-600">
                      ({ride?.driver?.driverRating?.toFixed(1)})
                    </span>
                    <span>
                      {" "}
                      {ride.driver.driverVerificationStatus === "Approved" && (
                        <span className="text-[#089814] ml-1">
                          Verified Driver
                        </span>
                      )}
                      {ride.driver.driverVerificationStatus !== "Approved" && (
                        <span className="text-[#ff3a3a] ml-1">
                          Driver is Not Verified
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#F96167]">
                  ₹{ride.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <FaUsers className="inline mr-1" />
                  {ride.availableSeats} seats left
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* <RideInfoItem icon={FaCar} text={ride.vehicle} /> */}
              <RideInfoItem
                icon={FaUsers}
                text={`${ride.availableSeats} available seats`}
              />
              <RideInfoItem
                icon={FaMapMarkerAlt}
                text={ride.startLocation.city}
              />
              <RideInfoItem
                icon={FaMapMarkerAlt}
                text={ride.endLocation.city}
              />
              <RideInfoItem
                icon={FaClock}
                text={formatDateWithTime(new Date(ride.departureTime))}
              />
              <RideInfoItem
                icon={FaClock}
                text={formatDateWithTime(new Date(ride.estimatedArrivalTime))}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{ride.startLocation.city}</span>
                <span>{ride.endLocation.city}</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full mt-2">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#F96167] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <FaRoute className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
            </div>

            <Link href={`/book/${ride._id}`}>
              <motion.button
                className="w-full bg-[#F96167] text-white py-3 rounded-lg font-semibold transition duration-300 hover:bg-[#F9D423] hover:text-[#F96167]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book This Ride
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const RideInfoItem: React.FC<{ icon: React.ElementType; text: string }> = ({
  icon: Icon,
  text,
}) => (
  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
    <Icon className="text-[#F96167] mr-2" />
    <span className="text-gray-700">{text}</span>
  </motion.div>
);

export default AvailableRides;
