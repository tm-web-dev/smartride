import { z } from "zod";

export const verifyOtpSchema = z.object({
 otp: z
  .string()
  .trim()
  .min(1, "Verification code is required")
  .length(6, "Enter a 6-digit code")
  .regex(/^\d+$/, "Only numbers are allowed"),
})
.strict();