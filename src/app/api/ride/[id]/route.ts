import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);

    const newRide = await Ride.findById(params.id).populate(
      "driver",
      "firstName lastName"
    );

    if (!newRide) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    const ride = {
      ...newRide.toObject(),
      driver: {
        fullName: `${newRide.driver.firstName} ${newRide.driver.lastName}`,
      },
      passenger: {
        _id: user.id,
      },
    };

    return NextResponse.json(ride);
  } catch (error) {
    console.error("Error fetching ride:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the ride" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const ride = await Ride.findById(params.id);

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.driver.toString() !== decodedToken.id) {
      return NextResponse.json(
        { error: "Not authorized to update this ride" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updatedRide = await Ride.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Ride updated successfully",
      ride: updatedRide,
    });
  } catch (error) {
    console.error("Error updating ride:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the ride" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const ride = await Ride.findById(params.id);

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.driver.toString() !== decodedToken.id) {
      return NextResponse.json(
        { error: "Not authorized to cancel this ride" },
        { status: 403 }
      );
    }

    if (ride.status === "Cancelled") {
      return NextResponse.json(
        { error: "This ride is already cancelled" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { cancellationReason } = body;

    ride.status = "Cancelled";
    ride.cancellationReason = cancellationReason;

    await ride.save();

    return NextResponse.json({
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (error) {
    console.error("Error cancelling ride:", error);
    return NextResponse.json(
      { error: "An error occurred while cancelling the ride" },
      { status: 500 }
    );
  }
}
