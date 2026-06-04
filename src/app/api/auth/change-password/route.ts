import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";

import {
  comparePassword,
  hashPassword,
} from "@/lib/bcrypt";

export async function POST(
  request: Request
) {
  try {
    await dbConnect();

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      currentPassword,
      newPassword,
    } =
      await request.json();

    const user =
      await Usermodel.findById(
        session.user.id
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isMatch =
      await comparePassword(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Current password is incorrect",
        },
        {
          status: 400,
        }
      );
    }

    user.password =
      await hashPassword(
        newPassword
      );

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Password updated successfully",
    });
  } catch (error) {
    console.error(
      "CHANGE_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update password",
      },
      {
        status: 500,
      }
    );
  }
}