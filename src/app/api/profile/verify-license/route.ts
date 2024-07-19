import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/Models/userModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

const accountId = process.env.IDFY_ACCOUNT_ID;
const apiKey = process.env.IDFY_API_KEY;

if (!accountId || !apiKey) {
  throw new Error("IDFY_ACCOUNT_ID or IDFY_API_KEY is not set");
}

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "RequestId is required" },
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the license
    const id = user.driverLicense?.requestId || requestId;

    const verificationResult = await verifyLicense(id);

    user.driverVerificationStatus =
      verificationResult.result?.[0]?.result?.source_output?.status ||
      "Unknown";
    user.verificationResult =
      verificationResult.result?.[0]?.result?.source_output || {};

    // Save updated user data
    await user.save();

    return NextResponse.json({
      result: verificationResult,
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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function verifyLicense(requestId: string) {
  console.log("Request ID:", requestId);

  const apiUrl = `https://eve.idfy.com/v3/tasks?request_id=${encodeURIComponent(
    requestId
  )}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "account-id": accountId,
        "api-key": apiKey,
      } as HeadersInit,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("License verification failed:", error);
    if (error instanceof Error) {
      return { error: error.message, status: "Failed" };
    }
    return { error: "License verification failed", status: "Failed" };
  }
}
