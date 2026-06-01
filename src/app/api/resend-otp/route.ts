import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";
import { createOTP } from "@/lib/otp";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { ApiError } from "@/types/ApiError";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token } = await request.json();

    if (!token) {
      return ApiError.badRequest("Token is required").toResponse();
    }


    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await Usermodel.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return ApiError.badRequest("Invalid or expired session").toResponse();
    }

   
    const now = new Date();
    const lastSent = user.otpLastSentAt;
    const resendCount = user.otpResendCount || 0;

    if (lastSent && now.getTime() - lastSent.getTime() < 60 * 1000) {
      return ApiError.tooManyRequests("Wait before requesting OTP again").toResponse();
    }

    if (resendCount >= 5) {
      return ApiError.tooManyRequests("Maximum resend limit reached").toResponse();
    }

    const { otp, hashedOTP, otpExpiry } = createOTP();


    user.otp = hashedOTP;
    user.otpExpiry = otpExpiry;
    user.otpResendCount = resendCount + 1;
    user.otpLastSentAt = now;

    await user.save();

  
    const emailResult = await sendVerificationEmail(
      user.name,
      user.email,
      otp
    );

    if (!emailResult.success) {
      return ApiError.internal("Failed to resend OTP").toResponse();
    }

    return ApiResponse.ok(
      undefined,
      "OTP resent successfully"
    ).toResponse();

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return ApiError.internal("Something went wrong").toResponse();
  }
}