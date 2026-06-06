import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";
import ApplicationModel from "@/models/application";

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

    const user =
      await Usermodel.findById(id)
        .select("-password");

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

    const applications =
      await ApplicationModel.find({
        userId: id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    const latestApplication =
      applications[0] || null;

    return NextResponse.json({
      success: true,
      user,
      latestApplication,
      applications,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch user",
      },
      {
        status: 500,
      }
    );
  }
}