import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";

import { hashPassword } from "@/lib/bcrypt";

export async function POST(
  request: Request
) {
  try {
    await dbConnect();

    const {
      token,
      password,
    } = await request.json();

    if (
      !token ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Token and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await Usermodel.findOne({
        resetPasswordToken:
          token,
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reset link",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !user.resetPasswordExpiry ||
      user.resetPasswordExpiry <
        new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reset link has expired",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await hashPassword(
        password
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpiry =
      undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "RESET_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to reset password",
      },
      {
        status: 500,
      }
    );
  }
}