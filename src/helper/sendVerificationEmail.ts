import { resend } from "@/lib/resendEmails";
import verificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { ApiError } from "@/types/ApiError";

export async function sendVerificationEmail(name: string, email: string, otp: string): Promise<ApiResponse<string> | ApiError> {
    try {
     await resend.emails.send({
      from: 'SmartRide <no-reply@crewofficials.com>',
      to: email,
      subject: 'SmartRide || Verification Code',
      react: verificationEmail({ name, otp }),
        });
        return ApiResponse.ok("Verification email sent successfully");
        
    } catch (error) {
        console.error("Error sending verification email", error);
        return ApiError.internal("Failed to send verification email");
    }
}