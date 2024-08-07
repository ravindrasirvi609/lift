import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Check if bookingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { error: "Invalid Booking ID format" },
        { status: 400 }
      );
    }

    // First, find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Then, find the ride associated with this booking
    console.log("Booking found:", booking, "Booking ID:", bookingId);

    const ride = await Ride.findOne({ bookings: bookingId }).lean();
    console.log("Ride without population:", ride);

    if (ride) {
      await Ride.populate(ride, [
        { path: "driver", select: "firstName lastName email" },
        { path: "passengers", select: "firstName lastName email" },
      ]);
      console.log("Ride after population:", ride);
    }

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json({ ride }, { status: 200 });
  } catch (error: any) {
    console.error("Error finding ride:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
