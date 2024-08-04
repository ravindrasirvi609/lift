import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import { NextRequest, NextResponse } from "next/server";
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

    // First, find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Then, find the ride associated with this booking
    const ride = await Ride.findOne({ bookings: bookingId })
      .populate("driver", "name email") // Adjust fields as needed
      .populate("passengers", "name email") // Adjust fields as needed
      .lean();

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json({ ride }, { status: 200 });
  } catch (error) {
    console.error("Error finding ride:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
