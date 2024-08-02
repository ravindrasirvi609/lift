"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { useAuth } from "@/app/contexts/AuthContext";
import Loading from "@/components/Loading";
import { Ride } from "@/types/types";
import {
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import Matter from "matter-js";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { formatDateWithTime } from "@/utils/utils";

const BookRidePage = () => {
  const { user } = useAuth();
  const params = useParams();
  const { RideId } = params;

  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [ride, setRide] = useState<Ride | null>(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(() => {
    // GSAP animation for page entrance
    gsap.from(pageRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    // Matter.js background animation
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    const engine = Engine.create();
    const render = Render.create({
      element: canvasRef.current || undefined,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    const circle = Bodies.circle(150, 200, 30, {
      restitution: 0.9,
      render: { fillStyle: "#F9D423" },
    });

    World.add(engine.world, [
      Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth, 20, {
        isStatic: true,
      }),
      Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight, {
        isStatic: true,
      }),
      Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight + 10,
        window.innerWidth,
        20,
        { isStatic: true }
      ),
      Bodies.rectangle(
        window.innerWidth + 10,
        window.innerHeight / 2,
        20,
        window.innerHeight,
        { isStatic: true }
      ),
      circle,
    ]);

    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas;
      render.context;
      render.textures = {};
    };
  }, []);

  useEffect(() => {
    if (user === null) {
      setIsAuthLoading(false);
      router.push("/auth");
    } else if (user) {
      setIsAuthLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`/api/ride/${RideId}`);
        if (response.ok) {
          const data = await response.json();
          setRide(data);
        } else {
          console.error("Failed to fetch ride");
        }
      } catch (error) {
        console.error("Error fetching ride:", error);
      }
    };

    if (RideId) {
      fetchRide();
    }
  }, [RideId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/ride/bookingRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rideId: { RideId: RideId },
          numberOfSeats,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          "Booking request sent successfully! Please wait for confirmation."
        );
        router.push(`/waiting-room`);
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || !ride) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-[#F9E795] rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-[#F96167] text-center">
        Book Your Ride
      </h1>

      <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image
              src={ride.driver.profilePicture}
              alt={ride.driver.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full mr-4 border-2 border-[#F9D423]"
            />
            <div>
              <h2 className="text-xl font-semibold">
                <Link
                  href={`/profile/${ride.driver._id}`}
                  className="hover:text-[#F96167] hover:underline"
                >
                  {ride.driver.fullName}
                </Link>
              </h2>
              <div className="flex items-center">
                <FaStar className="text-[#F9D423] mr-1" />
                <span>{ride.driver?.driverRating?.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#F96167]">₹{ride.price}</p>
            <p className="text-sm text-gray-600">per seat</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <FaCar className="text-[#F96167] mr-2" />
            <span>{ride.vehicle.type}</span>
          </div>
          <div className="flex items-center">
            <FaUsers className="text-[#F96167] mr-2" />
            <span>{ride.availableSeats} available seats</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-[#F96167] mr-2" />
            <span>{ride.startLocation.city}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-[#F96167] mr-2" />
            <span>{ride.endLocation.city}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="text-[#F96167] mr-2" />
            <span>{formatDateWithTime(new Date(ride.departureTime))}</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleBooking}
        className="bg-white rounded-lg p-6 shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="seats"
            className="block mb-2 font-semibold text-[#F96167]"
          >
            Number of Seats
          </label>
          <input
            type="number"
            id="seats"
            value={numberOfSeats}
            onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
            min="1"
            max={ride.availableSeats}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#F9D423]"
          />
        </div>
        <div className="mb-4 text-right">
          <p className="text-lg font-semibold">
            Total:{" "}
            <span className="text-[#F96167]">
              ₹{(numberOfSeats * ride.price).toFixed(2)}
            </span>
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-[#F96167] text-white px-4 py-3 rounded-lg font-semibold transition-colors hover:bg-[#F9D423] hover:text-[#F96167]"
          disabled={isLoading}
        >
          {isLoading ? "Sending Request..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default withAuth(BookRidePage);
