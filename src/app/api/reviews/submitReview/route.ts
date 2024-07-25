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

    const body = await req.json();
    const { reviewerId, reviewedId, rideId, rating, comment } = body;

    // Validate input
    if (!reviewerId || !reviewedId || !rideId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user and ride exist
    const [reviewer, reviewed, ride] = await Promise.all([
      User.findById(reviewerId),
      User.findById(reviewedId),
      Ride.findById(rideId),
    ]);

    if (!reviewer || !reviewed || !ride) {
      return NextResponse.json(
        { error: "Invalid reviewer, reviewed user, or ride" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new Review({
      reviewer: reviewerId,
      reviewed: reviewedId,
      ride: rideId,
      rating,
      comment,
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
