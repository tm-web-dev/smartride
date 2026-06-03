import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import ApplicationHistoryModel from "@/models/applicationHistory";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session =
      await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(req.url);

    const page = Number(
      searchParams.get("page") || "1"
    );

    const limit = 10;

    const search =
      searchParams.get("search") || "";

    const status =
      searchParams.get("status") || "";

    const query: any = {};

    if (status) {
      query.newStatus = status;
    }

    const allHistory =
      await ApplicationHistoryModel.find(query)
        .populate(
          "applicationId",
          "applicationNumber fullName district"
        )
        .sort({ createdAt: -1 });

    const filteredHistory =
      allHistory.filter((item: any) => {
        const term =
          search.toLowerCase();

        return (
          item.applicationId?.applicationNumber
            ?.toLowerCase()
            .includes(term) ||
          item.applicationId?.fullName
            ?.toLowerCase()
            .includes(term) ||
          item.previousStatus
            ?.toLowerCase()
            .includes(term) ||
          item.newStatus
            ?.toLowerCase()
            .includes(term) ||
          item.remarks
            ?.toLowerCase()
            .includes(term)
        );
      });

    const total =
      filteredHistory.length;

    const paginatedHistory =
      filteredHistory.slice(
        (page - 1) * limit,
        page * limit
      );

    return NextResponse.json({
      success: true,
      history: paginatedHistory,
      pagination: {
        page,
        totalPages: Math.ceil(
          total / limit
        ),
        total,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch history",
      },
      {
        status: 500,
      }
    );
  }
}