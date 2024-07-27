import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rideId = searchParams.get("rideId");

  if (!rideId) {
    return NextResponse.json(
      { success: false, message: "Ride ID is required" },
      { status: 400 }
    );
  }

  try {
    const ride = await Ride.findById(rideId).select("messages");
    if (!ride) {
      return NextResponse.json(
        { success: false, message: "Ride not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, messages: ride.messages });
  } catch (error) {
    console.error(`Error fetching messages for ride ${rideId}:`, error);
    return NextResponse.json(
      { success: false, message: "Error fetching messages" },
      { status: 500 }
    );
  }
}
