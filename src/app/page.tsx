import Hero from "@/components/Hero";
import React from "react";
import RideSearch from "@/components/RideSearch";
import HowItWorks from "@/components/HowItWorks";
import SafetyAndSecurity from "@/components/SafetyAndSecurity";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import VehicleOwnerSection from "@/components/VehicleOwner";

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <RideSearch />
      <VehicleOwnerSection />
      <HowItWorks />
      <SafetyAndSecurity />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
