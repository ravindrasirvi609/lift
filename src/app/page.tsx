"use client";
import Hero from "@/components/Hero";
import React, { useEffect } from "react";
import HowItWorks from "@/components/HowItWorks";
import SafetyAndSecurity from "@/components/SafetyAndSecurity";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import VehicleOwnerSection from "@/components/VehicleOwner";
import RideSearchAndResults from "@/components/RideSearchAndResults";
import { useAuth } from "./contexts/AuthContext";
import Loading from "@/components/Loading";
import Header from "@/components/Headers";
import { useSocket } from "./hooks/useSocket";

const Home: React.FC = () => {
  const { user, isLoading, isInitialized } = useAuth();
  useSocket();
  if (isLoading || !isInitialized) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {user && <Header />}

      <Hero />
      <RideSearchAndResults />
      <VehicleOwnerSection />
      <HowItWorks />
      <SafetyAndSecurity />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
