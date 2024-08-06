import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import Notification from "@/Models/notificationModel";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await verifyToken(token);

    const user = await User.findById(params.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch notifications for the user
    const notifications = await Notification.find({ userId: params.userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to the 50 most recent notifications

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      userId: params.userId,
      read: false,
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await verifyToken(token);

    const user = await User.findById(params.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Mark specified notifications as read
    await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: params.userId },
      { $set: { read: true } }
    );

    return NextResponse.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
