import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaUserCheck,
  FaHeadset,
  FaWallet,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.from(section.querySelectorAll(".feature-item"), {
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

  const features = [
    {
      icon: FaMapMarkedAlt,
      title: "Real-time tracking",
      description:
        "Track your ride in real-time and share your journey with loved ones for added safety.",
    },
    {
      icon: FaUserCheck,
      title: "Verified users",
      description:
        "All drivers and passengers are verified, ensuring a trustworthy community.",
    },
    {
      icon: FaHeadset,
      title: "24/7 support",
      description:
        "Our dedicated support team is always ready to assist you, anytime, anywhere.",
    },
    {
      icon: FaWallet,
      title: "Cashless payments",
      description:
        "Enjoy the convenience of secure, cashless transactions for all your rides.",
    },
    {
      icon: FaClock,
      title: "Scheduled rides",
      description:
        "Plan ahead by scheduling your rides in advance for important appointments.",
    },
    {
      icon: FaShieldAlt,
      title: "Insurance coverage",
      description:
        "Travel with peace of mind knowing that all rides are covered by our insurance policy.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-[#F96167]">
          Features That Set Us Apart
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-item text-center p-6 bg-gradient-to-br from-[#F9E795] to-[#F9D423] rounded-lg shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <feature.icon className="text-5xl mb-4 text-[#F96167] mx-auto" />
              <h3 className="text-2xl font-semibold mb-3 text-[#F96167]">
                {feature.title}
              </h3>
              <p className="text-gray-800">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#F96167] hover:bg-[#F9D423] text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300"
          >
            Explore All Features
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Features;
