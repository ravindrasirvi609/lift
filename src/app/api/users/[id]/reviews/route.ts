import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Review from "@/Models/reviewModel";

connect();
mongoose.model("Review", Review.schema);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const reviews = await Review.find({ reviewed: id })
      .populate("reviewer", "firstName lastName profilePicture")
      .sort({ createdAt: -1 })
      .limit(10); // Limit to 10 most recent reviews

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
