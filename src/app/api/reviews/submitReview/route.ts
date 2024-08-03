import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import Ride from "@/Models/rideModel";
import Review from "@/Models/reviewModel";
import { verifyToken } from "@/utils/verifyToken";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
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

    if (!reviewer || !reviewed || !ride) {
      return NextResponse.json(
        { error: "Invalid reviewer, reviewed user, or ride" },
        { status: 400 }
      );
    }

    // Verify that the reviewer is part of the ride
    if (!ride.driver || !ride.passengers) {
      return NextResponse.json(
        { error: "Driver or passenger information not available" },
        { status: 400 }
      );
    }

    if (reviewerRole === "passenger" && !ride.passengers.includes(reviewerId)) {
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

    // Update user's ratings
    await Promise.all([reviewer.updateRatings(), reviewed.updateRatings()]);

    console.log("Updated reviewed user:", reviewed);

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: newReview,
        updatedUserRating:
          reviewerRole === "passenger"
            ? reviewed.driverRating
            : reviewed.passengerRating,
      },
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
