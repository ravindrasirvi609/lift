import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
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

    const reviews = await Review.find({ ride: params.id }).populate(
      "reviewer reviewed"
    );
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching ride reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
