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
      revenueResult,
      monthlyApplications,
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

      // Revenue
      ApplicationModel.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$applicationFee",
            },
          },
        },
      ]),

      // Monthly Applications Trend
      ApplicationModel.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

    const revenue =
      revenueResult[0]
        ?.totalRevenue || 0;

    const statusChart = [
      {
        name: "Pending",
        value: pending,
      },
      {
        name: "Approved",
        value: approved,
      },
      {
        name: "Rejected",
        value: rejected,
      },
      {
        name: "Printed",
        value: printed,
      },
      {
        name: "Dispatched",
        value: dispatched,
      },
      {
        name: "Delivered",
        value: delivered,
      },
    ];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyChart =
      monthlyApplications.map(
        (item) => ({
          month:
            monthNames[
              item._id.month - 1
            ],
          applications:
            item.count,
        })
      );

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

        revenue,
      },

      charts: {
        statusChart,
        monthlyChart,
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