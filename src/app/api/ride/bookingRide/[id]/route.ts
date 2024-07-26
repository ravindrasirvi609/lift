import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { sendSMS, sendWhatsApp } from "@/utils/messaging";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import mongoose from "mongoose";

mongoose.model("User", User.schema);
mongoose.model("Booking", Booking.schema);
mongoose.model("Ride", Ride.schema);

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const body = await req.json();
    const { status } = body;

    if (!status || !["Confirmed", "Cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await Booking.findById(params.id).populate(
      "ride passenger"
    );
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.driver.toString() !== decodedToken.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    booking.status = status;
    console.log("Updating booking:", JSON.stringify(booking, null, 2));

    await booking.save();

    if (status === "Confirmed") {
      await Ride.findByIdAndUpdate(booking.ride, {
        $inc: { availableSeats: -booking.numberOfSeats },
      });
    }

    // Notify the passenger about the booking status
    const message =
      status === "Confirmed"
        ? `Your booking (ID: ${booking._id}) has been Confirmed by the driver.`
        : `Your booking (ID: ${booking._id}) has been Cancelled by the driver.`;

    // await sendSMS(booking.passenger.phoneNumber, message);
    // await sendWhatsApp(
    //   booking.passenger.phoneNumber,
    //   `${message} Tap for details: http://localhost:3000/bookings/${booking._id}`
    // );

    return NextResponse.json(
      { message: `Booking ${status} successfully`, booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating booking:", error);
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
