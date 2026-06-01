import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { ApiError } from "@/types/ApiError";
import { hashPassword } from "@/lib/bcrypt";
import { createOTP } from "@/lib/otp";
import { ApiResponse } from "@/types/ApiResponse";
import crypto from "crypto";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();

        const name = body.name?.trim();
        const email = body.email?.toLowerCase().trim();
        const password = body.password;

        // Validate required fields
        if (!name || !email || !password) {
            return ApiError.badRequest(
                "All fields are required"
            ).toResponse();
        }

        // Find existing user
        const existingUser = await Usermodel.findOne({ email });

        // Prevent staff/admin registration from public signup
        if (
            existingUser &&
            existingUser.role !== "user"
        ) {
            return ApiError.forbidden(
                "Staff accounts cannot register here"
            ).toResponse();
        }

        // Prevent verified user duplicate signup
        if (existingUser?.isVerified) {
            return ApiError.conflict(
                existingUser.isVerified,
                "User already exists. Please log in."
            ).toResponse();
        }

        const now = new Date();

        // OTP resend protection
        if (existingUser) {
            const lastSent = existingUser.otpLastSentAt;
            const resendCount =
                existingUser.otpResendCount || 0;

            // 60-second cooldown
            if (
                lastSent &&
                now.getTime() - lastSent.getTime() <
                    60 * 1000
            ) {
                return ApiError.tooManyRequests(
                    "Wait before requesting OTP again"
                ).toResponse();
            }

            // Max resend limit
            if (resendCount >= 5) {
                return ApiError.tooManyRequests(
                    "Max OTP attempts reached"
                ).toResponse();
            }
        }

        // Hash password
        const hashedPassword =
            await hashPassword(password);

        // Generate OTP
        const { otp, hashedOTP, otpExpiry } =
            createOTP();

        // Generate email verification token
        const rawToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        const verifyTokenExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Existing unverified user
        if (existingUser) {
            existingUser.name = name;

            // Update password only for unverified accounts
            if (!existingUser.isVerified) {
                existingUser.password =
                    hashedPassword;
            }

            existingUser.otp = hashedOTP;
            existingUser.otpExpiry = otpExpiry;

            existingUser.otpResendCount =
                (existingUser.otpResendCount || 0) + 1;

            existingUser.otpLastSentAt = now;

            existingUser.verifyToken =
                hashedToken;

            existingUser.verifyTokenExpiry =
                verifyTokenExpiry;

            // Always enforce public role
            existingUser.role = "user";

            await existingUser.save();
        } else {
            // Create new public user
            const newUser = new Usermodel({
                name,
                email,
                password: hashedPassword,

                otp: hashedOTP,
                otpExpiry,

                otpResendCount: 1,
                otpLastSentAt: now,

                isVerified: false,

                verifyToken: hashedToken,
                verifyTokenExpiry,

                // IMPORTANT:
                // Public signup can ONLY create users
                role: "user",
            });

            await newUser.save();
        }

        // Send OTP email
        const sendEmail =
            await sendVerificationEmail(
                name,
                email,
                otp
            );

        if (!sendEmail.success) {
            return ApiError.internal(
                "Failed to send email"
            ).toResponse();
        }

        return ApiResponse.ok(
            {
                token: rawToken,
            },
            "OTP sent successfully"
        ).toResponse();
    } catch (error) {
        console.error(error);

        return ApiError.internal(
            "Something went wrong"
        ).toResponse();
    }
}