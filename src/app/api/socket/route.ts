import { Server as SocketIOServer } from "socket.io";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponseServerIO } from "@/types/next";
import Ride from "@/Models/rideModel";
import { connect } from "@/dbConfig/dbConfig";

export const dynamic = "force-dynamic";

let io: SocketIOServer;
console.log("Initializing Socket.IO server...");

// Store connected users
const connectedUsers = new Map();

connect();
export async function GET(req: NextRequest, res: NextApiResponseServerIO) {
  if (!io) {
    console.log("Initializing Socket.IO server...");
    // @ts-ignore
    io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    io.on("connection", (socket) => {
      console.log("New client connected");

      // User authentication
      socket.on("authenticate", (userId: string) => {
        connectedUsers.set(userId, socket.id);
        console.log(`User ${userId} authenticated`);
      });

      socket.on("join-ride", (rideId: string) => {
        socket.join(rideId);
        console.log(`Client joined ride: ${rideId}`);
      });

      socket.on("update-location", ({ rideId, location }) => {
        console.log(`Location update for ride ${rideId}:`, location);
        io.to(rideId).emit("location-updated", { rideId, location });
      });

      socket.on("send-message", async ({ rideId, message }) => {
        console.log(`New message in ride ${rideId}:`, message);
        await addMessageToRide(rideId, message);
        io.to(rideId).emit("new-message", { rideId, message });
      });

      // New event for booking actions
      socket.on("booking_action", ({ bookingId, action, passengerId }) => {
        console.log(`Booking action: ${action} for booking ${bookingId}`);

        // Emit to the specific passenger
        const passengerSocketId = connectedUsers.get(passengerId);
        if (passengerSocketId) {
          io.to(passengerSocketId).emit("ride_status", {
            status: action.toLowerCase(),
          });
        }

        // Emit to all connected clients
        io.emit("booking_status_update", { bookingId, status: action });
      });

      socket.on("disconnect", () => {
        // Remove user from connectedUsers on disconnect
        for (const [userId, socketId] of connectedUsers.entries()) {
          if (socketId === socket.id) {
            connectedUsers.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
        console.log("Client disconnected");
      });
    });
  }

  // @ts-ignore
  res.socket.server.io = io;

  return NextResponse.json({ success: true, message: "Socket is running" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { rideId, action, data } = body;

  if (!io) {
    return NextResponse.json(
      { success: false, message: "Socket is not initialized" },
      { status: 500 }
    );
  }

  switch (action) {
    case "update-location":
      io.to(rideId).emit("location-updated", { rideId, location: data });
      break;
    case "send-message":
      await addMessageToRide(rideId, data);
      io.to(rideId).emit("new-message", { rideId, message: data });
      break;
    case "booking_action":
      const { bookingId, action: bookingAction, passengerId } = data;
      const passengerSocketId = connectedUsers.get(passengerId);
      if (passengerSocketId) {
        io.to(passengerSocketId).emit("ride_status", {
          status: bookingAction.toLowerCase(),
        });
      }
      io.emit("booking_status_update", { bookingId, status: bookingAction });
      break;
    default:
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
  }

  return NextResponse.json({ success: true, message: "Action processed" });
}

export async function addMessageToRide(rideId: string, message: any) {
  try {
    console.log("Adding message to ride", message);

    await Ride.findByIdAndUpdate(rideId, {
      $push: {
        messages: {
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
        },
      },
    });
    console.log(`Message added to ride ${rideId}`);
  } catch (error) {
    console.error(`Error adding message to ride ${rideId}:`, error);
  }
}
