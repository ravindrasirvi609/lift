import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import { sendEmail } from "@/helpers/mailer";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    // Check if email is provided
    if (!email) {
      return NextResponse.json(
        { error: "Please provide an email address" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Generate password reset token
    const resetToken = await bcryptjs.hash(user._id.toString(), 10);
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

async function sendPasswordResetEmail(email: string, token: string) {
  try {
    await sendEmail({
      email,
      emailType: "RESET",
      userId: token,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    // Implement a retry mechanism or alert system here
  }
}
