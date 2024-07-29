import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendSMS, sendWhatsApp } from "@/utils/messaging";
import User from "@/Models/userModel";

connect();

function isValidCoordinate(coord: string[]) {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    coord.every((n) => typeof n === "number" && !isNaN(n))
  );
}

export async function POST(req: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error("Database not connected");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const body = await req.json();
    const { rideId, numberOfSeats } = body;
    console.log("Received request body:", body);

    if (!rideId || !numberOfSeats) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rideIdString =
      typeof rideId === "object" && rideId.RideId ? rideId.RideId : rideId;
    console.log("Ride ID:", rideIdString);

    if (!mongoose.Types.ObjectId.isValid(rideIdString)) {
      return NextResponse.json({ error: "Invalid ride ID" }, { status: 400 });
    }

    const ride = await Ride.findById(rideIdString);
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }
    console.log("Ride:", JSON.stringify(ride, null, 2));

    if (ride.availableSeats < numberOfSeats) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    if (!ride.startLocation?.coordinates || !ride.endLocation?.coordinates) {
      return NextResponse.json(
        { error: "Ride location data is incomplete" },
        { status: 400 }
      );
    }

    if (
      !isValidCoordinate(ride.startLocation.coordinates) ||
      !isValidCoordinate(ride.endLocation.coordinates)
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates in ride data" },
        { status: 400 }
      );
    }

    const totalPrice = ride.price * numberOfSeats;

    const newBooking = new Booking({
      ride: rideIdString,
      passenger: decodedToken.id,
      driver: ride.driver,
      numberOfSeats,
      price: totalPrice,
      status: "Pending",
      pickupLocation: {
        type: "Point",
        coordinates: ride.startLocation.coordinates,
      },
      dropoffLocation: {
        type: "Point",
        coordinates: ride.endLocation.coordinates,
      },
    });

    console.log("Creating new booking:", JSON.stringify(newBooking, null, 2));

    await newBooking.save();

    // Notify the driver about the new booking request
    // await sendSMS(
    //   ride.driver.phoneNumber,
    //   `New ride request (ID: ${rideIdString}) for ${numberOfSeats} seats. Please check your app to accept or reject.`
    // );

    // await sendWhatsApp(
    //   ride.driver.phoneNumber,
    //   `New ride request (ID: ${rideIdString}) for ${numberOfSeats} seats. Tap to view details: http://localhost:3000/driver/requests/${newBooking._id}`
    // );

    return NextResponse.json(
      { message: "Booking request created successfully", booking: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating booking request:", error);
    console.error("Error stack:", error.stack);
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

export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = await verifyToken(token);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const rideId = searchParams.get("rideId");

    let query = {};

    if (user.role === "driver") {
      query = { driver: decodedToken.id };
    } else if (user.role === "passenger") {
      query = { passenger: decodedToken.id };
    }

    if (rideId) {
      query = { ...query, ride: rideId };
    }

    const bookings = await Booking.find(query)
      .populate({
        path: "ride",
        populate: { path: "driver", select: "firstName lastName" },
      })
      .populate("passenger", "firstName lastName");

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
