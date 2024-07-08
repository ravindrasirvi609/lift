"use client";
import React from "react";
import { FaCar, FaRoute, FaMoneyBillWave } from "react-icons/fa";
import { useRouter } from "next/navigation";

const VehicleOwnerSection: React.FC = () => {
  const router = useRouter();
  const handleCreateRide = () => {
    router.push("/trip-info");
  };

  return (
    <section className="bg-[#F9E795] py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#F96167] mb-8 text-center">
          For Vehicle Owners
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-800 mb-6">
              Join our community of vehicle owners and start earning by offering
              rides. It&apos;s easy, flexible, and rewarding!
            </p>

            <ul className="space-y-4">
              {[
                { icon: FaCar, text: "Use your own vehicle" },
                { icon: FaRoute, text: "Choose your own routes and schedule" },
                { icon: FaMoneyBillWave, text: "Earn extra income" },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <item.icon className="text-[#F96167] text-xl" />
                  <span className="text-gray-800">{item.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCreateRide}
              className="mt-8 bg-[#F96167] hover:bg-[#F9D423] text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F9D423] focus:ring-opacity-50"
            >
              Create New Ride
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-[#F96167] mb-4">
              Why Join Us?
            </h3>
            <ul className="space-y-3">
              {[
                "Flexible working hours",
                "Meet new people",
                "Contribute to reducing traffic congestion",
                "Earn competitive rates",
                "24/7 support team",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-6 h-6 text-[#F9D423] mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleOwnerSection;
