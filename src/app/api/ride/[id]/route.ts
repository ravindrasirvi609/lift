import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

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

    const newRide = await Ride.findById(params.id)
      .populate("driver", "firstName lastName")
      .populate("bookings");

    if (!newRide) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Fetch all bookings for this ride
    const bookings = await Booking.find({ ride: params.id }).populate(
      "passenger",
      "firstName lastName"
    );

    const passengers = bookings.map((booking) => ({
      fullName: `${booking.passenger.firstName} ${booking.passenger.lastName}`,
      _id: booking.passenger._id,
      bookingId: booking._id,
      numberOfSeats: booking.numberOfSeats,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
    }));

    const ride = {
      ...newRide.toObject(),
      driver: {
        fullName: `${newRide.driver.firstName} ${newRide.driver.lastName}`,
        _id: newRide.driver._id,
      },
      passengers: passengers,
      totalBookedSeats: passengers.reduce((sum, p) => sum + p.numberOfSeats, 0),
      bookings: bookings.map((booking) => ({
        _id: booking._id,
        status: booking.status,
        numberOfSeats: booking.numberOfSeats,
        price: booking.price,
        paymentStatus: booking.paymentStatus,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
      })),
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
