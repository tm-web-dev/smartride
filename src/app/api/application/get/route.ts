import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";

export async function GET() {
  await dbConnect();

  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session) {
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

    const application =
  await ApplicationModel.findOne(
    {
      userId: session.user.id,
    }
  ).sort({
    createdAt: -1,
  });


    return NextResponse.json(
      {
        success: true,
        application,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET_APPLICATION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}