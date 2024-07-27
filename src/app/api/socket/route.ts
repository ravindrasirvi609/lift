import { Server as SocketIOServer } from "socket.io";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponseServerIO } from "@/types/next";
import Ride from "@/Models/rideModel";
import { connect } from "@/dbConfig/dbConfig";

export const dynamic = "force-dynamic";

let io: SocketIOServer;
console.log("Initializing Socket.IO server...");

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

      socket.on("join-ride", (rideId: string) => {
        socket.join(rideId);
        console.log(`Client joined ride: ${rideId}`);
      });

      socket.on("update-location", ({ rideId, location }) => {
        console.log(`Location update for ride ${rideId}:`, location);
        io.to(rideId).emit("location-updated", { rideId, location });
      });

      socket.on("send-message", async ({ rideId, message }) => {
        console.log(`New message in riderer ${rideId}:`, message);
        await addMessageToRide(rideId, message);
        io.to(rideId).emit("new-message", { rideId, message });
      });

      socket.on("disconnect", () => {
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
