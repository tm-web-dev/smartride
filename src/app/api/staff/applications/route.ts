import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";

export async function GET(
  req: Request
) {
  try {
    await dbConnect();

    const { searchParams } =
      new URL(req.url);

    const status =
      searchParams.get("status");

    const query = status
      ? { status }
      : {};

    const applications =
      await ApplicationModel.find(
        query
      )
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch applications",
      },
      {
        status: 500,
      }
    );
  }
}