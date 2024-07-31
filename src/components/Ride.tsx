"use client";
import React, { useRef, useEffect } from "react";
import AvailableRides from "@/components/AvailableRides";
import { motion, AnimatePresence } from "framer-motion";
import {
  Engine,
  Render,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
} from "matter-js";
import Loading from "./Loading";
import { Ride } from "@/types/types";
import { FaCar } from "react-icons/fa";
import Matter from "matter-js";

interface Props {
  rides: Ride[];
  loading: boolean;
  error: string | null;
}

const Rides: React.FC<Props> = ({ rides, loading, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && rides.length === 0) {
      const engine = Engine.create();
      const render = Render.create({
        canvas: canvasRef.current,
        engine: engine,
        options: {
          width: 300,
          height: 200,
          wireframes: false,
          background: "transparent",
        },
      });

      const car = Bodies.rectangle(150, 100, 60, 30, {
        chamfer: { radius: 10 },
        render: { fillStyle: "#F96167" },
      });
      const ground = Bodies.rectangle(150, 190, 300, 20, {
        isStatic: true,
        render: { fillStyle: "#F9D423" },
      });

      World.add(engine.world, [car, ground]);

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

      World.add(engine.world, mouseConstraint);

      Matter.Runner.run(engine);
      Render.run(render);

      return () => {
        Render.stop(render);
        World.clear(engine.world, true);
        Engine.clear(engine);
      };
    }
  }, [rides]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#F9E795] to-[#F9D423]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <p className="text-[#F96167] text-lg">{error}</p>
        </motion.div>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-[#F9E795] to-[#F9D423] min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="bg-[#F96167] text-white p-6">
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <FaCar className="mr-2" /> Available Rides
          </h1>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {rides.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AvailableRides rides={rides} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-[#F96167] p-6 rounded-lg"
              >
                <p className="text-xl font-semibold mb-4">
                  No rides available at the moment.
                </p>
                <p className="mb-6">Check back later for new rides!</p>
                <canvas ref={canvasRef} className="mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Rides;
