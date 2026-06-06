import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";
import ApplicationModel from "@/models/application";

export async function GET() {
  try {
    await dbConnect();

    const [
      totalUsers,
      totalStaff,
      totalApplications,
      pending,
      approved,
      rejected,
      printed,
      dispatched,
      delivered,
    ] = await Promise.all([
      Usermodel.countDocuments({
        role: "user",
      }),

      Usermodel.countDocuments({
        role: "staff",
      }),

      ApplicationModel.countDocuments(),

      ApplicationModel.countDocuments({
        status: "pending",
      }),

      ApplicationModel.countDocuments({
        status: "approved",
      }),

      ApplicationModel.countDocuments({
        status: "rejected",
      }),

      ApplicationModel.countDocuments({
        status: "printed",
      }),

      ApplicationModel.countDocuments({
        status: "dispatched",
      }),

      ApplicationModel.countDocuments({
        status: "delivered",
      }),
    ]);

    return NextResponse.json({
      success: true,

      stats: {
        totalUsers,
        totalStaff,
        totalApplications,

        pending,
        approved,
        rejected,

        printed,
        dispatched,
        delivered,

        revenue: 0,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_DASHBOARD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}