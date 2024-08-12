import Image from "next/image";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

const Hero: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    const children = textRef.current?.children;
    if (children) {
      tl.from(logoRef.current, {
        scale: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      }).from(
        children,
        {
          y: 50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }
  }, []);

  return (
    <section className="h-screen w-screen bg-gradient-to-b from-[#F96167] to-[#F9D423] text-white flex flex-col justify-center items-center relative overflow-hidden">
      <div className="container mx-auto relative z-10 flex flex-col items-center">
        <div ref={logoRef} className="w-[400px] h-[400px] mb-2">
          <Image
            src="/logo.png"
            alt="Lift team"
            width={800}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div ref={textRef} className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to LIFT</h1>
          <p className="text-xl mb-8">
            Your reliable platform to find and book rides easily.
          </p>
          <Link href={"/#rideSearch"} className="mr-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#F96167] font-bold py-3 px-8 rounded-full text-lg shadow-lg"
            >
              Find a Ride
            </motion.button>
          </Link>
          <Link href={"/trip-info"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#F96167] font-bold py-3 px-8 rounded-full text-lg shadow-lg"
            >
              Offer a Ride
            </motion.button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillOpacity="0.2"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
