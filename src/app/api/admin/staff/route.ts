import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";

export async function GET(
  req: NextRequest
) {
  try {
    await dbConnect();

    const search =
      req.nextUrl.searchParams.get(
        "search"
      ) || "";

    const staff =
      await Usermodel.find({
        role: "staff",

        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return NextResponse.json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error(error);

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