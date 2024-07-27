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
      "vehicle",
      "startLocation",
      "endLocation",
      "departureTime",
      "estimatedArrivalTime",
      "totalSeats",
      "availableSeats",
      "price",
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
      vehicle: {
        type: body.vehicle.type,
        make: body.vehicle.make,
        model: body.vehicle.model,
        year: body.vehicle.year,
        color: body.vehicle.color,
        licensePlate: body.vehicle.licensePlate,
      },
      startLocation: {
        type: "Point",
        coordinates: body.startLocation.coordinates,
        city: body.startLocation.city,
        region: body.startLocation.region,
        locationId: body.startLocation.locationId,
        address: body.startLocation.address,
      },
      endLocation: {
        type: "Point",
        coordinates: body.endLocation.coordinates,
        city: body.endLocation.city,
        region: body.endLocation.region,
        locationId: body.endLocation.locationId,
        address: body.endLocation.address,
      },
      waypoints: body.waypoints || [],
      departureTime: new Date(body.departureTime),
      estimatedArrivalTime: new Date(body.estimatedArrivalTime),
      totalSeats: body.totalSeats,
      availableSeats: body.availableSeats,
      price: body.price,
      pricePerSeat: body.pricePerSeat,
      status: "Scheduled",
      distance: body.distance,
      duration: body.duration,
      recurrence: {
        isRecurring: body.recurrence.isRecurring,
        frequency: body.recurrence.frequency,
        endDate: body.recurrence.endDate
          ? new Date(body.recurrence.endDate)
          : undefined,
      },
      allowedLuggage: body.allowedLuggage,
      amenities: body.amenities,
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
