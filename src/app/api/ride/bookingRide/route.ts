import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendSMS, sendWhatsApp } from "@/utils/messaging";

connect();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const body = await req.json();
    const { rideId, numberOfSeats } = body;
    const RIDEID = rideId.RideId;

    // Log the received data for debugging
    console.log("Received request body:", body);

    if (!rideId || !numberOfSeats) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure rideId is a string
    const rideIdString =
      typeof rideId === "object" && rideId.RideId ? rideId.RideId : rideId;

    // Validate that rideIdString is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(rideIdString)) {
      return NextResponse.json({ error: "Invalid ride ID" }, { status: 400 });
    }

    // Find the ride
    const ride = await Ride.findById(rideIdString);
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Check if enough seats are available
    if (ride.availableSeats < numberOfSeats) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    // Calculate the total price
    const totalPrice = ride.price * numberOfSeats;

    // Create the pending booking request
    const newBooking = new Booking({
      ride: rideIdString,
      passenger: decodedToken.id,
      driver: ride.driver,
      numberOfSeats,
      price: totalPrice,
      status: "pending",
    });

    await newBooking.save();

    // Notify the driver about the new booking request
    await sendSMS(
      ride.driver.phoneNumber,
      `New ride request (ID: ${RIDEID}) for ${numberOfSeats} seats. Please check your app to accept or reject.`
    );

    await sendWhatsApp(
      ride.driver.phoneNumber,
      `New ride request (ID: ${RIDEID}) for ${numberOfSeats} seats. Tap to view details: http://localhost:3000/driver/requests/${newBooking._id}`
    );

    return NextResponse.json(
      { message: "Booking request created successfully", booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking request:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Internal server error: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

// ... rest of the code (GET function) remains the same

export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const { searchParams } = new URL(req.url);
    const rideId = searchParams.get("rideId");

    let query: { passenger: string; ride?: string } = {
      passenger: decodedToken.id,
    };
    if (rideId) {
      query = { ...query, ride: rideId };
    }

    const bookings = await Booking.find(query).populate("ride");

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
