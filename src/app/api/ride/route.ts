import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await verifyToken(token);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .sort({ departureTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("driver", "firstName lastName");

    const total = await Ride.countDocuments(query);

    return NextResponse.json({
      rides,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching rides" },
      { status: 500 }
    );
  }
}
