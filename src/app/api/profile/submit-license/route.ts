import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/Models/userModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { driverLicense, vehicleInfo } = await request.json();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);

    const user = await User.findById(decodedToken.id).select(
      "-password -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dateOfBirth = formatDate(user.dateOfBirth);

    const requestId = await findRequestId(driverLicense.number, dateOfBirth);
    if ("error" in requestId) {
      return NextResponse.json(requestId, { status: 400 });
    }
    console.log("License requestId", requestId);

    user.driverLicense = {
      ...driverLicense,
      verificationStatus: "in_progress",
      requestId: requestId.request_id,
    };
    user.vehicleInfo = vehicleInfo;
    user.isDriver = true;
    user.driverVerificationStatus = "Pending";
    await user.save();

    return NextResponse.json({
      status: "in_progress",
      message: "License verification in progress",
      updatedUser: {
        driverLicense: user.driverLicense,
        vehicleInfo: user.vehicleInfo,
        isDriver: user.isDriver,
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

async function findRequestId(id_number: string, date_of_birth: string) {
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

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("License verification failed:", error);
    return { error: "License verification failed", status: "Failed" };
  }
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
