import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserCheck, FaLock } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const SafetyAndSecurity: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.from(section.querySelectorAll(".safety-item"), {
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

  const safetyFeatures = [
    {
      icon: FaShieldAlt,
      title: "Rigorous Screening",
      description:
        "All drivers undergo thorough background checks and vehicle inspections.",
    },
    {
      icon: FaUserCheck,
      title: "User Verification",
      description: "We verify all users to ensure a trustworthy community.",
    },
    {
      icon: FaLock,
      title: "Secure Payments",
      description: "All transactions are protected with bank-level security.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-r from-[#F9E795] to-[#F9D423] py-20"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-[#F96167]">
          Safety and Security
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="safety-item bg-white p-6 rounded-lg shadow-lg text-center"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <feature.icon className="text-5xl mb-4 text-[#F96167] mx-auto" />
              <h3 className="text-2xl font-semibold mb-3 text-[#F96167]">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-xl mb-8">
            Your safety is our top priority. We implement rigorous measures and
            secure payment options to ensure a trustworthy experience for all
            our users.
          </p>
          <Link href={"/about"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#F96167] hover:bg-white hover:text-[#F96167] text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300"
            >
              Learn More About Our Safety Measures
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SafetyAndSecurity;
