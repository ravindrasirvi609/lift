import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import User from "@/Models/userModel"; // Ensure the User model is imported
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connect();
    const { payload } = await req.json();
    const { startLocation, endLocation, departureTime, availableSeats } =
      payload;

    if (
      !startLocation ||
      !endLocation ||
      !departureTime ||
      availableSeats == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields in the payload" },
        { status: 400 }
      );
    }

    const searchDate = new Date(departureTime);
    searchDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query = {
      "startLocation.city": startLocation.city,
      "endLocation.city": endLocation.city,
      departureTime: { $gte: searchDate },
      availableSeats: { $gte: availableSeats },
      status: "Scheduled",
    };

    const rides = await Ride.find(query)
      .populate({
        path: "driver",
        model: User, // Explicitly specify the User model
        select: "firstName lastName email",
      })
      .sort({ departureTime: 1 });
    console.log("rides", rides);

    return NextResponse.json({ rides }, { status: 200 });
  } catch (error) {
    console.error("Error in ride search:", error);
    return NextResponse.json(
      { error: "Failed to search for rides" },
      { status: 500 }
    );
  }
}
