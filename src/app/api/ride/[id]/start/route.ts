import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { rideId: string } }
) {
  await connect();

  try {
    const ride = await Ride.findById(params.rideId);
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    ride.status = "In Progress";
    ride.actualDepartureTime = new Date();
    await ride.save();

    // TODO: Send notification to passengers

    return NextResponse.json({ message: "Ride started successfully" });
  } catch (error) {
    console.error("Failed to start ride:", error);
    return NextResponse.json(
      { error: "Failed to start ride" },
      { status: 500 }
    );
  }
}
