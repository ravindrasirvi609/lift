"use client";
import React, { useEffect, useRef } from "react";
import {
  FaCar,
  FaRoute,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaLeaf,
} from "react-icons/fa";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const VehicleOwnerSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.from(section.querySelectorAll(".animate-in"), {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }
  }, []);

  const benefits = [
    { icon: FaClock, text: "Flexible working hours" },
    { icon: FaUsers, text: "Meet new people" },
    { icon: FaLeaf, text: "Contribute to reducing traffic congestion" },
    { icon: FaMoneyBillWave, text: "Earn competitive rates" },
    { icon: FaCar, text: "Use your own vehicle" },
    { icon: FaRoute, text: "Choose your own routes and schedule" },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-r from-[#F9E795] to-[#F9D423] py-16 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#F96167] mb-12 text-center animate-in">
          Drive with lift
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in">
            <p className="text-xl text-gray-800 mb-6">
              Join our community of vehicle owners and start earning by offering
              rides. It&apos;s easy, flexible, and rewarding!
            </p>

            <div className="grid grid-cols-2 gap-6">
              {benefits.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="text-[#F96167] text-2xl" />
                  <span className="text-gray-800 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-[#F96167] hover:bg-[#F9D423] text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#F9D423] focus:ring-opacity-50 text-lg"
            >
              <Link href={"/trip-info"}>Start Driving Today</Link>
            </motion.button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-xl animate-in">
            <h3 className="text-3xl font-semibold text-[#F96167] mb-6">
              Why Drive with lift?
            </h3>
            <ul className="space-y-4">
              {[
                "Earn money on your schedule",
                "Get paid weekly",
                "24/7 support team",
                "Exclusive driver perks and discounts",
                "Opportunity for bonuses and incentives",
                "Be your own boss",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-6 h-6 text-[#F9D423] mr-3"
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
                  <span className="text-lg">{benefit}</span>
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
