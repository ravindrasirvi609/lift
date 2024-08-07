import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/Models/bookingModel";
import Ride from "@/Models/rideModel";
import Notification from "@/Models/notificationModel";
import { verifyToken } from "@/utils/verifyToken";
import { sendSMS, sendWhatsApp } from "@/utils/messaging";

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
    await booking.save();

    if (status === "Confirmed") {
      await Ride.findByIdAndUpdate(booking.ride, {
        $inc: { availableSeats: -booking.numberOfSeats },
        $push: { bookings: booking._id, passengers: booking.passenger._id },
      });
    }

    // Create a notification
    const notificationType =
      status === "Confirmed" ? "ride_accepted" : "ride_cancelled";
    const notificationMessage =
      status === "Confirmed"
        ? `Your booking (ID: ${booking._id}) has been Confirmed by the driver.`
        : `Your booking (ID: ${booking._id}) has been Cancelled by the driver.`;

    const notification = new Notification({
      userId: booking.passenger._id,
      type: notificationType,
      message: notificationMessage,
      relatedId: booking._id,
    });

    await notification.save();

    // Emit socket event for real-time notification
    // We'll handle this in a separate function

    // Existing SMS and WhatsApp notifications
    // await sendSMS(booking.passenger.phoneNumber, notificationMessage);
    // await sendWhatsApp(
    //   booking.passenger.phoneNumber,
    //   `${notificationMessage} Tap for details: http://localhost:3000/bookings/${booking._id}`
    // );

    return NextResponse.json(
      { message: `Booking ${status} successfully`, booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
