import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import User from "@/Models/userModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

mongoose.model("User", User.schema);

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

    const decodedToken = await verifyToken(token);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ride = await Ride.findById(params.id)
      .populate("driver", "firstName lastName profilePicture driverRating")
      .populate("bookings");

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Fetch all bookings for this ride
    const bookings = await Booking.find({ ride: params.id }).populate(
      "passenger",
      "firstName lastName profilePicture passengerRating"
    );

    const passengers = bookings.map((booking) => ({
      fullName: `${booking.passenger.firstName} ${booking.passenger.lastName}`,
      profilePicture: booking.passenger.profilePicture,
      passengerRating: booking.passenger.passengerRating,
      _id: booking.passenger._id,
      bookingId: booking._id,
      numberOfSeats: booking.numberOfSeats,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
    }));

    const totalBookedSeats = passengers.reduce(
      (sum, p) => sum + p.numberOfSeats,
      0
    );

    const rideDetails = {
      ...ride.toObject(),
      driver: {
        fullName: `${ride.driver.firstName} ${ride.driver.lastName}`,
        _id: ride.driver._id,
        profilePicture: ride.driver.profilePicture,
        driverRating: ride.driver.driverRating,
      },
      passengers,
      totalBookedSeats,
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

    return NextResponse.json(rideDetails);
  } catch (error) {
    console.error("Error fetching ride:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the ride" },
      { status: 500 }
    );
  }
}
