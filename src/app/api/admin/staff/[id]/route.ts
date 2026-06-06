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

    const approved =
      await ApplicationModel.countDocuments(
        {
          approvedBy: id,
        }
      );

    const rejected =
      await ApplicationModel.countDocuments(
        {
          rejectedBy: id,
        }
      );

    const printed =
      await ApplicationModel.countDocuments(
        {
          printedBy: id,
        }
      );

    const dispatched =
      await ApplicationModel.countDocuments(
        {
          dispatchedBy: id,
        }
      );

    const delivered =
      await ApplicationModel.countDocuments(
        {
          deliveredBy: id,
        }
      );

    return NextResponse.json({
      success: true,

      staff,

      stats: {
        approved,
        rejected,
        printed,
        dispatched,
        delivered,
      },
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