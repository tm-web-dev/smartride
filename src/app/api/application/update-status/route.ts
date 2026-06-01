import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";

export async function PATCH(
  req: Request
) {
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
        { status: 401 }
      );
    }

    const role =
      session.user.role;

    // Only staff
    if (
      ![
        "admin",
        "approver",
        "dispatcher",
      ].includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden",
        },
        { status: 403 }
      );
    }

    const body =
      await req.json();

    const {
      applicationId,
      status,
    } = body;

    if (
      !applicationId ||
      !status
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application ID and status required",
        },
        { status: 400 }
      );
    }

    const application =
      await ApplicationModel.findById(
        applicationId
      );

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application not found",
        },
        { status: 404 }
      );
    }

    // Approver permissions
    if (
      role === "approver"
    ) {
      if (
        ![
          "approved",
          "rejected",
        ].includes(status)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid status",
          },
          {
            status: 400,
          }
        );
      }

      // Set validity on approval
      if (
        status === "approved"
      ) {
        const validFrom =
          new Date();

        const validTill =
          new Date();

        validTill.setFullYear(
          validTill.getFullYear() +
            1
        );

        application.validFrom =
          validFrom;

        application.validTill =
          validTill;
      }
    }

    // Dispatcher permissions
    if (
      role ===
        "dispatcher" &&
      status !==
        "dispatched"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Dispatcher can only dispatch cards",
        },
        { status: 403 }
      );
    }

    application.status =
      status;

    await application.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Application updated successfully",
        application,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE_STATUS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error",
      },
      { status: 500 }
    );
  }
}