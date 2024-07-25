import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Review from "@/Models/reviewModel";
import { verifyToken } from "@/utils/verifyToken";

export async function DELETE(
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

    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user is the original reviewer or an admin
    if (
      review.reviewer.toString() !== decodedToken.id &&
      !decodedToken.isAdmin
    ) {
      return NextResponse.json(
        { error: "Not authorized to delete this review" },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
