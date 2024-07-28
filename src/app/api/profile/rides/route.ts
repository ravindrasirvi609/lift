import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Booking from "@/Models/bookingModel";
import mongoose from "mongoose";
mongoose.model("Booking", Booking.schema);

connect();

export async function GET(req: NextRequest) {
  try {
    // Verify the user's token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    // Fetch the user
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine which rides to fetch based on user type
    let rides;
    if (user.isDriver) {
      rides = await Ride.find({ driver: user._id })
        .populate("bookings.passenger", "firstName lastName profilePicture")
        .sort({ departureTime: -1 })
        .limit(10); // Limit to the 10 most recent rides
    } else {
      rides = await Ride.find({ "bookings.passenger": user._id })
        .populate("driver", "firstName lastName profilePicture")
        .sort({ departureTime: -1 })
        .limit(10); // Limit to the 10 most recent rides
    }

    return NextResponse.json({ rides }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user rides:", error);
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
