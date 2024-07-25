import { verifyToken } from "@/utils/verifyToken";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    // Generate a new token
    const newToken = sign(
      {
        id: decoded.id,
        email: decoded.email,
        isDriver: decoded.isDriver,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      },
      process.env.JWT_SECRET!
    );

    // Create the response
    const response = NextResponse.json(
      {
        message: "Token refreshed successfully",
        user: {
          id: decoded.id,
          email: decoded.email,
          isDriver: decoded.isDriver,
        },
      },
      { status: 200 }
    );

    // Set the new token in a cookie
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
