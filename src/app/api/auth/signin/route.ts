import { sendEmail } from "@/utils/mailer";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";

const SALT_ROUNDS = 10;

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Check for required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "password",
      "dateOfBirth",
      "gender",
    ];
    for (const field of requiredFields) {
      if (!reqBody[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
      isDriver = false,
      driverLicense,
      vehicleInfo,
    } = reqBody;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number (assuming a simple format, adjust as needed)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate date of birth (ensure user is at least 18 years old)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      return NextResponse.json(
        { error: "User must be at least 18 years old" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      isDriver,
      driverVerificationStatus: isDriver ? "Pending" : "Not Applied",
    });

    // If user is a driver, add driver-specific information
    if (isDriver) {
      if (!driverLicense || !vehicleInfo) {
        return NextResponse.json(
          {
            error:
              "Driver license and vehicle information are required for drivers",
          },
          { status: 400 }
        );
      }
      newUser.driverLicense = driverLicense;
      newUser.vehicleInfo = vehicleInfo;
    }

    const savedUser = await newUser.save();
    console.log(" savedUser", savedUser);

    // Generate verification token
    const verifyToken = await bcryptjs.hash(
      savedUser._id.toString(),
      SALT_ROUNDS
    );
    savedUser.verifyToken = verifyToken;
    savedUser.verifyTokenExpiry = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 24 hours
    await savedUser.save();

    // Send verification email
    await sendVerificationEmail(savedUser.email, verifyToken, savedUser._id);

    return NextResponse.json({
      message:
        "User created successfully. Please check your email to verify your account.",
      success: true,
      userId: savedUser._id,
    });
  } catch (error: any) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign-up. Please try again." },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(
  email: string,
  token: string,
  userId: string
) {
  try {
    await sendEmail({
      email,
      emailType: "VERIFY",
      token,
      userId: userId,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    // You might want to implement a retry mechanism or alert system here
  }
}
