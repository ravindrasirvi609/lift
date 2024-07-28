import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { FaSearch, FaCarSide, FaCheckCircle } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.from(section.querySelectorAll(".step-item"), {
        opacity: 0,
        y: 50,
        stagger: 0.3,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }
  }, []);

  const steps = [
    {
      icon: FaSearch,
      title: "Search a Ride",
      description:
        "Enter your trip details to find available rides that match your needs.",
    },
    {
      icon: FaCarSide,
      title: "Choose a Ride",
      description:
        "Select the ride that best fits your schedule, budget, and preferences.",
    },
    {
      icon: FaCheckCircle,
      title: "Book and Go",
      description:
        "Confirm your booking, meet your driver, and enjoy your journey!",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-[#F96167]">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-item bg-gradient-to-br from-[#F9E795] to-[#F9D423] p-6 rounded-lg shadow-lg text-center"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <step.icon className="text-5xl mb-4 text-[#F96167] mx-auto" />
              <h3 className="text-2xl font-semibold mb-3 text-[#F96167]">
                {step.title}
              </h3>
              <p className="text-gray-800">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href={"/#rideSearch"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#F96167] hover:bg-[#F9D423] text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300"
            >
              Find a Ride Now
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
