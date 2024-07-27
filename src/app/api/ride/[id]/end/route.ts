import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const ride = await Ride.findById(params.id);
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    ride.status = "Completed";
    ride.actualArrivalTime = new Date();
    // Calculate total earnings if not already set
    // if (!ride.totalEarnings) {
    //   ride.totalEarnings = ride.price * (ride.totalSeats - ride.availableSeats);
    // }
    await ride.save();

    // TODO: Send notification to passengers

    return NextResponse.json({ message: "Ride completed successfully" });
  } catch (error) {
    console.error("Failed to complete ride:", error);
    return NextResponse.json(
      { error: "Failed to complete ride" },
      { status: 500 }
    );
  }
}
