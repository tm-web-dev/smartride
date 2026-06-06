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

    const page =
      Number(
        req.nextUrl.searchParams.get(
          "page"
        )
      ) || 1;

    const limit = 10;

    const query = {
      role: "user",

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
    };

    const users =
      await Usermodel.find(query)
        .select(
          "-password -otp -verifyToken"
        )
        .sort({
          createdAt: -1,
        })
        .skip(
          (page - 1) * limit
        )
        .limit(limit);

    const total =
      await Usermodel.countDocuments(
        query
      );

    return NextResponse.json({
      success: true,

      users,

      total,

      page,

      totalPages: Math.ceil(
        total / limit
      ),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}