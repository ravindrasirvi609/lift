import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import User from "@/Models/userModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connect();
    const { payload } = await req.json();
    const { startLocation, endLocation, departureTime, availableSeats } =
      payload;

    if (
      !startLocation ||
      !endLocation ||
      !departureTime ||
      availableSeats == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields in the payload" },
        { status: 400 }
      );
    }

    const searchDate = new Date(departureTime);
    searchDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query = {
      "startLocation.city": startLocation.city,
      "endLocation.city": endLocation.city,
      departureTime: { $gte: searchDate },
      availableSeats: { $gte: availableSeats },
      status: "Scheduled",
    };

    const rides = await Ride.find(query)
      .select(
        "startLocation endLocation departureTime availableSeats status price"
      )
      .populate({
        path: "driver",
        model: User,
        select:
          "firstName lastName email profilePicture driverVerificationStatus driverRating",
      })
      .sort({ departureTime: 1 });

    console.log("Rides found:", JSON.parse(JSON.stringify(rides)));
    const updatedRides = await Promise.all(
      rides.map(async (ride) => {
        const updatedDriver = await User.findById(ride.driver._id);
        await updatedDriver.updateRatings(); // Force update ratings
        ride.driver = updatedDriver;
        return ride;
      })
    );

    if (rides.length === 0) {
      return NextResponse.json(
        { rides, message: "No rides found matching the criteria" },
        { status: 200 }
      );
    }

    return NextResponse.json({ rides }, { status: 200 });
  } catch (error) {
    console.error("Error in ride search:", error);
    return NextResponse.json(
      { error: "Failed to search for rides" },
      { status: 500 }
    );
  }
}
