import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import Review from "@/Models/reviewModel";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

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

    // Determine which reviews to fetch based on user type
    const reviewField = user.isDriver ? "reviewed" : "reviewer";
    const reviews = await Review.find({ [reviewField]: user._id })
      .populate("reviewer", "firstName lastName profilePicture")
      .populate("reviewed", "firstName lastName profilePicture")
      .populate("ride", "startLocation endLocation departureTime")
      .sort({ createdAt: -1 })
      .limit(10); // Limit to the 10 most recent reviews

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
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

export async function POST(req: NextRequest) {
  try {
    // Verify the user's token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    // Get the review data from the request body
    const reviewData = await req.json();

    // Create a new review
    const newReview = new Review({
      reviewer: decodedToken.id,
      ...reviewData,
    });

    await newReview.save();

    // Populate the reviewer and reviewed fields
    await newReview.populate("reviewer", "firstName lastName profilePicture");
    await newReview.populate("reviewed", "firstName lastName profilePicture");
    await newReview.populate("ride", "startLocation endLocation departureTime");

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
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
