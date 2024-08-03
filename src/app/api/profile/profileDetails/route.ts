import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
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

    // Fetch the user's profile
    const user = await User.findById(decodedToken.id).select(
      "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate and update the user's ratings
    const reviews = await user.updateRatings();

    console.log("User reviews:", reviews);

    // Create a response object with the user data
    const userResponse = user.toObject();

    // Add the ratings to the response

    // Return the user's profile details including ratings
    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
