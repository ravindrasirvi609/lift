import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/Models/userModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { bankAccountInfo } = await request.json();

    console.log("bankInfo", bankAccountInfo);

    if (!bankAccountInfo) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get user data from the database
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    // Fetch the user's profile
    const user = await User.findById(decodedToken.id).select(
      "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
    );
    console.log("user", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("user.driverLicense", bankAccountInfo);

    // Update bank information
    user.bankAccountInfo = bankAccountInfo;

    // Save updated user data
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "Bank information updated successfully",
      updatedUser: {
        bankAccountInfo: user.bankAccountInfo,
      },
    });
  } catch (error) {
    console.error("License verification error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
