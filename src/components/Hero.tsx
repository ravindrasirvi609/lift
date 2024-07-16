import Image from "next/image";
import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="bg-[#F96167] text-white py-20 text-center">
      <div className="container mx-auto">
        <div className="relative w-[200px] h-[200px] mx-auto mb-8">
          <Image
            src="/logo.png"
            alt="Platform Logo"
            fill
            style={{ objectFit: "contain" }}
            sizes="200px"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to RideSharing</h1>
        <p className="text-lg">
          Your reliable platform to find and book rides easily.
        </p>
      </div>
    </section>
  );
};

export default Hero;
