import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Review from "@/Models/reviewModel";
import { verifyToken } from "@/utils/verifyToken";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const body = await req.json();
    const { rating, comment } = body;

    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user is the original reviewer
    if (review.reviewer.toString() !== decodedToken.id) {
      return NextResponse.json(
        { error: "Not authorized to update this review" },
        { status: 403 }
      );
    }

    const updatedReview = await Review.findByIdAndUpdate(
      params.id,
      { rating, comment, isEdited: true, lastEditedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
