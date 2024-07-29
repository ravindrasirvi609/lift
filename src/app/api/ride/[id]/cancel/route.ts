import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  console.log("canceling ride", params);

  try {
    const ride = await Ride.findById(params.id);
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.status === "Completed" || ride.status === "In Progress") {
      return NextResponse.json(
        { error: "Cannot cancel a ride that has already started or completed" },
        { status: 400 }
      );
    }

    ride.status = "Cancelled";
    await ride.save();

    // TODO: Send notification to affected users (driver/passengers)

    return NextResponse.json({ message: "Ride cancelled successfully" });
  } catch (error) {
    console.error("Failed to cancel ride:", error);
    return NextResponse.json(
      { error: "Failed to cancel ride" },
      { status: 500 }
    );
  }
}
