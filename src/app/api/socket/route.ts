import { initSocket } from "@/utils/socket";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  await initSocket(req as any, res as any);
  return new NextResponse("Socket is running", { status: 200 });
}

export async function POST(req: NextRequest) {
  const { rideId, action, data } = await req.json();

  const res = NextResponse.next();
  const io = (res as any).socket.server.io;

  if (!io) {
    return new NextResponse("Socket is not initialized", { status: 500 });
  }

  switch (action) {
    case "update-location":
      io.to(rideId).emit("location-updated", { rideId, location: data });
      break;
    case "send-message":
      io.to(rideId).emit("new-message", { rideId, message: data });
      break;
    default:
      return new NextResponse("Invalid action", { status: 400 });
  }

  return new NextResponse("Action processed", { status: 200 });
}
