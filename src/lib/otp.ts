import crypto from "crypto";

const OTP_EXPIRY_MINUTES = 10;

export function createOTP() {
  const otp = crypto.randomInt(100000, 1000000).toString();

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  return {
    otp,         // send to user
    hashedOTP,   // store in DB
    otpExpiry,
  };
}
