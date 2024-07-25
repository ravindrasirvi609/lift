import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import Review from "@/Models/reviewModel";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await verifyToken(token);

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passengerReviews = await Review.find({
      reviewed: params.id,
      ride: { $exists: true },
    });
    const driverReviews = await Review.find({
      reviewed: params.id,
      ride: { $exists: true },
      "ride.driver": params.id,
    });

    const passengerRating =
      passengerReviews.length > 0
        ? passengerReviews.reduce((sum, review) => sum + review.rating, 0) /
          passengerReviews.length
        : 0;

    const driverRating =
      driverReviews.length > 0
        ? driverReviews.reduce((sum, review) => sum + review.rating, 0) /
          driverReviews.length
        : 0;

    return NextResponse.json({
      passengerRating: parseFloat(passengerRating.toFixed(2)),
      driverRating: parseFloat(driverRating.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
