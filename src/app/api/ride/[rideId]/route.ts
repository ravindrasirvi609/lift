import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { NextResponse } from "next/server";

connect();
export async function GET(
  req: Request,
  { params }: { params: { rideId: string } }
) {
  try {
    const { rideId } = params;

    const ride = await Ride.findById(rideId).populate(
      "driver",
      "name image rating"
    );

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(ride);
  } catch (error) {
    console.error("Error fetching ride:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
