import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import Ride from "@/Models/rideModel";
import Review from "@/Models/reviewModel";
import { verifyToken } from "@/utils/verifyToken";
import mongoose from "mongoose"; // Import mongoose to handle ObjectId

export async function POST(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    console.log("Decoded token:", decodedToken);
    const reviewerId = decodedToken.id;

    const body = await req.json();
    const {
      reviewedId,
      rideId,
      rating,
      driverRating,
      vehicleRating,
      punctualityRating,
      comment,
      reviewerRole,
    } = body;

    // Validate input
    if (!reviewerId || !reviewedId || !rideId || !rating || !reviewerRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user and ride exist
    const reviewer = await User.findById(reviewerId);
    const reviewed = await User.findById(reviewedId);
    const ride = await Ride.findById(rideId);
    console.log("ride", ride);

    if (!reviewer || !reviewed || !ride) {
      return NextResponse.json(
        { error: "Invalid reviewer, reviewed user, or ride" },
        { status: 400 }
      );
    }

    // Verify that the reviewer is part of the ride
    console.log("reviewerRole:", reviewerRole);
    console.log("reviewerId:", reviewerId);
    console.log("ride.passengerId:", ride.passenger.toString());
    console.log("ride.driverId:", ride.driver.toString());

    if (
      reviewerRole === "passenger" &&
      ride.passenger.toString() !== reviewerId
    ) {
      return NextResponse.json(
        { error: "You are not authorized to review this ride as a passenger" },
        { status: 403 }
      );
    }

    if (reviewerRole === "driver" && ride.driver.toString() !== reviewerId) {
      return NextResponse.json(
        { error: "You are not authorized to review this ride as a driver" },
        { status: 403 }
      );
    }

    // Create new review
    const newReview = new Review({
      reviewer: reviewerId,
      reviewed: reviewedId,
      ride: rideId,
      rating,
      driverRating: reviewerRole === "passenger" ? driverRating : undefined,
      vehicleRating: reviewerRole === "passenger" ? vehicleRating : undefined,
      punctualityRating:
        reviewerRole === "passenger" ? punctualityRating : undefined,
      comment,
      reviewerRole,
    });

    await newReview.save();

    return NextResponse.json(
      { message: "Review submitted successfully", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
