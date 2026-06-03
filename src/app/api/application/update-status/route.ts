import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";

import mongoose from "mongoose";

export async function PATCH(
  req: Request
) {
  await dbConnect();

  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const role =
      session.user.role;

    if (
      !["admin", "staff"].includes(
        role
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const body =
      await req.json();

    const {
      applicationId,
      status,
      rejectionReason,
    } = body;

    if (
      !applicationId ||
      !status
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application ID and status are required",
        },
        { status: 400 }
      );
    }

    const allowedStatuses =
      [
        "approved",
        "rejected",
        "printed",
        "dispatched",
        "delivered",
      ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status",
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

    const userObjectId =
  new mongoose.Types.ObjectId(
    session.user.id
  );

    /*
     * APPROVED
     */
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

      application.approvedBy =
           userObjectId;
      application.approvedAt =
        new Date();

      application.rejectionReason =
        "";

      application.rejectedBy =
        undefined;

      application.rejectedAt =
        undefined;
    }

    /*
     * REJECTED
     */
    if (
      status === "rejected"
    ) {
      application.rejectionReason =
        rejectionReason || "";

      application.rejectedBy =
  userObjectId;
      application.rejectedAt =
        new Date();
    }

    /*
     * PRINTED
     */
    if (
      status === "printed"
    ) {
      application.printedBy =
        userObjectId;

      application.printedAt =
        new Date();
    }

    /*
     * DISPATCHED
     */
    if (
      status === "dispatched"
    ) {
     application.dispatchedBy =
  userObjectId;

      application.dispatchedAt =
        new Date();
    }

    /*
     * DELIVERED
     */
    if (
      status === "delivered"
    ) {
      application.deliveredBy =
  userObjectId;

      application.deliveredAt =
        new Date();
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
      {
        status: 200,
      }
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
      {
        status: 500,
      }
    );
  }
}