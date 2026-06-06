import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await dbConnect();

    const { id } =
      await params;

    const staff =
      await Usermodel.findById(
        id
      ).select("-password");

    if (!staff) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Staff not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      staff,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch staff",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await dbConnect();

    const { id } =
      await params;

    const body =
      await request.json();

    const {
      name,
      email,
      isDeleted,
    } = body;

    const staff =
      await Usermodel.findByIdAndUpdate(
        id,
        {
          name,
          email,
          isDeleted,
        },
        {
          new: true,
        }
      ).select("-password");

    return NextResponse.json({
      success: true,
      message:
        "Staff updated successfully",
      staff,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update staff",
      },
      {
        status: 500,
      }
    );
  }
}