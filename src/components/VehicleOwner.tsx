"use client";
import React, { useRef } from "react";
import {
  FaCar,
  FaRoute,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaLeaf,
  FaChevronRight,
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
    { icon: FaClock, text: "Flexible hours" },
    { icon: FaUsers, text: "Meet new people" },
    { icon: FaLeaf, text: "Reduce congestion" },
    { icon: FaMoneyBillWave, text: "Earn extra" },
    { icon: FaCar, text: "Use your vehicle" },
    { icon: FaRoute, text: "Choose your routes" },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-gradient-to-r from-[#F9E795] to-[#F9D423] py-16 px-4 md:px-8 lg:px-16 flex items-center"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[#F96167] mb-12 text-center animate-in"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Drive with LIFT
        </motion.h2>

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
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="text-[#F96167] text-2xl" />
                  <span className="text-gray-800 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-[#F96167] hover:bg-[#F9D423] text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#F9D423] focus:ring-opacity-50 text-lg flex items-center justify-center"
            >
              <Link href={"/trip-info"} className="flex items-center">
                Start Driving Today <FaChevronRight className="ml-2" />
              </Link>
            </motion.button>
          </div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-3xl font-semibold text-[#F96167] mb-6">
              Why Drive with LIFT?
            </h3>
            <ul className="space-y-4">
              {[
                "Earn money on your schedule",
                "Get paid weekly",
                "24/7 support team",
                "Exclusive driver perks",
                "Opportunity for bonuses",
                "Be your own boss",
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <svg
                    className="w-6 h-6 text-[#F9D423] mr-3 flex-shrink-0"
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
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VehicleOwnerSection;
