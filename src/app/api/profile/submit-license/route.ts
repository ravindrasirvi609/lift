import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/Models/userModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { userId, driverLicense, vehicleInfo } = await request.json();

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
    const dateOfBirth = formatDate(user.dateOfBirth);

    // Verify the license
    const requestId = await findrequestId(driverLicense.number, dateOfBirth);
    console.log("Request ID:", requestId);

    const verificationResult = await verifyLience(requestId.request_id);

    console.log("Verification result:", verificationResult);

    // Update user model with new information
    user.driverLicense = {
      ...driverLicense,
      verificationStatus: verificationResult.status,
    };
    user.vehicleInfo = vehicleInfo;
    user.isDriver = true;
    user.driverVerificationStatus = verificationResult.status;

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

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

async function findrequestId(id_number: string, date_of_birth: string) {
  const apiUrl =
    "https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_driving_license";
  const accountId = process.env.IDFY_ACCOUNT_ID;
  const apiKey = process.env.IDFY_API_KEY;

  const requestBody = {
    task_id: generateUUID(),
    group_id: generateUUID(),
    data: {
      id_number,
      date_of_birth,
      advanced_details: {
        state_info: true,
        age_info: true,
      },
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "account-id": accountId!,
        "api-key": apiKey!,
      },
      body: JSON.stringify(requestBody),
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

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
