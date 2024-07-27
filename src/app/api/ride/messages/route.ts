import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  const rideId = await req.json();
  const id = rideId.rideId;
  console.log("rideId", id);

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Ride ID is required" },
      { status: 400 }
    );
  }

  try {
    const ride = await Ride.findById(id).select("messages");
    if (!ride) {
      return NextResponse.json(
        { success: false, message: "Ride not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, messages: ride.messages });
  } catch (error) {
    console.error(`Error fetching messages for ride ${id}:`, error);
    return NextResponse.json(
      { success: false, message: "Error fetching messages" },
      { status: 500 }
    );
  }
}
