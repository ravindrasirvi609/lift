import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/Models/userModel";
import Ride from "@/Models/rideModel";
import Booking from "@/Models/bookingModel";
import { connect } from "@/dbConfig/dbConfig";

mongoose.model("User", User.schema);
mongoose.model("Ride", Ride.schema);
mongoose.model("Booking", Booking.schema);

connect();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let rides;

    if (user.isDriver) {
      rides = await Ride.find({ driver: id })
        .sort({ departureTime: -1 })
        .limit(10); // Limit to 10 most recent rides
    } else {
      const bookings = await Booking.find({ passenger: id })
        .populate("ride")
        .sort({ "ride.departureTime": -1 })
        .limit(10);
      rides = bookings.map((booking) => booking.ride);
    }

    return NextResponse.json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
