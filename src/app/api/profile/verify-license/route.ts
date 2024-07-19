import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/Models/userModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format date of birth to "yyyy-mm-dd"

    // Verify the license
    console.log("Request ID:", requestId);

    const id = "e2efa5ec-fdb3-4f31-a63f-699da5d7f335";

    const verificationResult = await verifyLience(id);

    console.log("Verification result:", verificationResult);

    // Update user model with new information
    // user.driverLicense = {
    //   ...driverLicense,
    //   verificationStatus: verificationResult.status,
    // };
    // user.vehicleInfo = vehicleInfo;
    // user.isDriver = true;
    // user.driverVerificationStatus = verificationResult.status;

    // Save updated user data
    await user.save();

    return NextResponse.json({
      status: verificationResult.status,
      message: verificationResult.message,
      updatedUser: {
        driverLicense: user.driverLicense,
        vehicleInfo: user.vehicleInfo,
        isDriver: user.isDriver,
        driverVerificationStatus: user.driverVerificationStatus,
      },
    });
  } catch (error) {
    console.error("License verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function verifyLience(requestId: string) {
  const apiUrl = `https://eve.idfy.com/v3/tasks?request_id=${requestId}`;
  const accountId = process.env.IDFY_ACCOUNT_ID;
  const apiKey = process.env.IDFY_API_KEY;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "account-id": accountId!,
        "api-key": apiKey!,
      },
    });

    https: if (!response.ok) {
      throw new Error("API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("License verification failed:", error);
    return { error: "License verification failed", status: "Failed" };
  }
}
