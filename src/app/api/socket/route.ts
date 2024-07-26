import { NextApiRequest } from "next";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextResponse } from "next/server";
import { NextApiResponseServerIO } from "@/types/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;

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

      socket.on("send-message", ({ rideId, message }) => {
        console.log(`New message in ride ${rideId}:`, message);
        io.to(rideId).emit("new-message", { rideId, message });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
  return NextResponse.json({ success: true, message: "Socket is running" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { rideId, action, data } = body;

  const res: NextApiResponseServerIO = NextResponse.next() as any;

  if (res.socket.server.io) {
    const io = res.socket.server.io;

    switch (action) {
      case "update-location":
        io.to(rideId).emit("location-updated", { rideId, location: data });
        break;
      case "send-message":
        io.to(rideId).emit("new-message", { rideId, message: data });
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, message: "Action processed" });
  } else {
    return NextResponse.json(
      { success: false, message: "Socket is not initialized" },
      { status: 500 }
    );
  }
}
