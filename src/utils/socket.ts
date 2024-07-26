import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";
import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export const initSocket = (
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server as any);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("join-ride", (rideId) => {
        socket.join(rideId);
      });

      socket.on("update-location", async ({ rideId, location }) => {
        // Update the ride's current location in the database
        const db = await connect();
        await Ride.findByIdAndUpdate(rideId, {
          currentLocation: location,
        });

        // Broadcast the updated location to all clients in the ride room
        io.to(rideId).emit("location-updated", { rideId, location });
      });

      socket.on("send-message", async ({ rideId, message }) => {
        // Save the message to the database
        const db = await connect();
        const updatedRide = await Ride.findByIdAndUpdate(
          rideId,
          { $push: { messages: message } },
          { new: true }
        );

        // Broadcast the message to all clients in the ride room
        io.to(rideId).emit("new-message", { rideId, message });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
  res.end();
};
