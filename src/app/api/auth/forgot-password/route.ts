import crypto from "crypto";
import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";

import { Resend } from "resend";

import { forgotPasswordSchema } from "@/schema/forgotPasswordSchema";

const resend = new Resend(
  process.env.RESENDER_API_KEY
);

export async function POST(
  request: Request
) {
  try {
    await dbConnect();

    const body =
      await request.json();

    const result =
      forgotPasswordSchema.safeParse(
        body
      );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.error.issues[0]
              ?.message ||
            "Invalid input",
        },
        {
          status: 400,
        }
      );
    }

    const { email } =
      result.data;

    const user =
      await Usermodel.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No account found with this email",
        },
        {
          status: 404,
        }
      );
    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpiry =
      new Date(
        Date.now() +
          1000 *
            60 *
            60
      );

    await user.save();

    const resetLink =
      `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from:
        "SmartRide <no-reply@crewofficials.com>",

      to: user.email,

      subject:
        "Reset Your SmartRide Password",

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          
          <h2>Password Reset Request</h2>

          <p>Dear ${user.name},</p>

          <p>
            We received a request to reset the password for your SmartRide account.
          </p>

          <p>
            Click the button below to reset your password:
          </p>

          <p>
            <a
              href="${resetLink}"
              style="
                display:inline-block;
                background:#2563eb;
                color:white;
                text-decoration:none;
                padding:12px 20px;
                border-radius:6px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in 1 hour.
          </p>

          <p>
            If you did not request a password reset,
            please ignore this email.
          </p>

          <br/>

          <p>
            Regards,<br/>
            SmartRide Team
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(
      "FORGOT_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send reset link",
      },
      {
        status: 500,
      }
    );
  }
}