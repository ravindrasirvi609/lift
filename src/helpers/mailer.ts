import User from "@/Models/userModel";
import bcryptjs from "bcryptjs";
import { Resend } from "resend";

export const sendEmail = async ({ email, emailType, token, userId }: any) => {
  try {
    // Check if the emailType is valid (either "VERIFY" or "RESET")
    if (emailType !== "VERIFY" && emailType !== "RESET") {
      throw new Error(
        "Invalid emailType. It should be either 'VERIFY' or 'RESET'."
      );
    }
    // create a hashed token
    const hashedToken = await bcryptjs.hash(token.toString(), 10);
    const resend = new Resend(process.env.RESEND_API_KEY!);

    console.log("hashedToken", hashedToken, emailType, email, userId);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });

      const mailresponse = await resend.emails.send({
        from: "dev@ravindrachoudhary.in",
        to: `${email}`,
        subject: `Verify your email for Your Ride Share`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
        .header { background-color: #F96167; color: #fff; text-align: center; padding: 20px; }
        .content { padding: 20px; }
        .button { display: inline-block; background-color: #F9D423; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #F9E795; color: #000; text-align: center; padding: 10px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="content">
            <p>Welcome to Your Ride Share! Please verify your email address to complete your registration and start enjoying our ride-sharing services.</p>
            <p>
                <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" class="button">Verify Email</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>
            <p>This link will expire in 1 hour for security reasons.</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Ride Share. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `,
      });
      return mailresponse;
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });

      const mailOptions = await resend.emails.send({
        from: "dev@ravindrachoudhary.in",
        to: email,
        subject: `Reset Your Password for Your Ride Share`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
        .header { background-color: #F96167; color: #fff; text-align: center; padding: 20px; }
        .content { padding: 20px; }
        .button { display: inline-block; background-color: #F9D423; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #F9E795; color: #000; text-align: center; padding: 10px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>You've requested to reset your password for Your Ride Share. Click the button below to set a new password:</p>
            <p>
                <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p>
            <p>This link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Ride Share. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `,
      });

      return mailOptions;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
