import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const user =
      await Usermodel.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    user.isDeleted =
      !user.isDeleted;

    await user.save();

    return NextResponse.json({
      success: true,
      message: user.isDeleted
        ? "User disabled"
        : "User enabled",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update user",
      },
      { status: 500 }
    );
  }
}