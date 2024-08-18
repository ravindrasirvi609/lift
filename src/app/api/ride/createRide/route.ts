import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated and is a driver
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken.isDriver) {
      return NextResponse.json(
        { error: "Only drivers can create rides" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("body", body);

    // Validate required fields
    const requiredFields = [
      "startLocation",
      "endLocation",
      "departureTime",
      "estimatedArrivalTime",
      "availableSeats",
      "price",
      "vehicle",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new ride
    const newRide = new Ride({
      driver: decodedToken.id,
      startLocation: {
        type: "Point",
        coordinates: body.startLocation.coordinates,
        address: body.startLocation.address,
      },
      endLocation: {
        type: "Point",
        coordinates: body.endLocation.coordinates,
        address: body.endLocation.address,
      },
      intermediateStops: body.intermediateStops.map((stop: any) => ({
        type: "Point",
        coordinates: stop.coordinates,
        address: stop.address,
        estimatedArrivalTime: stop.dateTime,
      })),
      departureTime: new Date(body.departureTime),
      estimatedArrivalTime: new Date(body.estimatedArrivalTime),
      availableSeats: body.availableSeats,
      price: body.price,
      vehicle: {
        type: body.vehicle.type,
      },
      notes: body.notes,
    });

    await newRide.save();

    return NextResponse.json(
      {
        message: "Ride created successfully",
        ride: newRide,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating ride:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the ride" },
      { status: 500 }
    );
  }
}
