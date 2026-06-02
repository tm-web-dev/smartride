import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";
import ApplicationHistoryModel from "@/models/applicationHistory";

const allowedTransitions: Record<
  string,
  string[]
> = {
  pending: [
    "approved",
    "rejected",
  ],

  approved: [
    "printed",
  ],

  printed: [
    "dispatched",
  ],

  dispatched: [
    "delivered",
  ],

  rejected: [],

  delivered: [],
};

export async function POST(
  req: Request
) {
  try {
    await dbConnect();

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

    const {
      applicationId,
      newStatus,
      remarks,
    } = await req.json();

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
        {
          status: 404,
        }
      );
    }

    const currentStatus =
      application.status;

    if (
      !allowedTransitions[
        currentStatus
      ]?.includes(newStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Invalid transition from ${currentStatus} to ${newStatus}`,
        },
        {
          status: 400,
        }
      );
    }

    application.status =
      newStatus;
console.log("remarks:", remarks);
    switch (newStatus) {
      case "approved":
        application.approvedBy =
  new mongoose.Types.ObjectId(
    session.user.id
  );

        application.approvedAt =
          new Date();

        application.validFrom =
          new Date();

        application.validTill =
          new Date(
            Date.now() +
              365 *
                24 *
                60 *
                60 *
                1000
          );

        break;

      case "rejected":
  application.rejectedBy =
    new mongoose.Types.ObjectId(
      session.user.id
    );

  application.rejectedAt =
    new Date();

  application.rejectionReason =
    remarks || "No reason provided";

  break;

      case "printed":
        application.printedBy =
          new mongoose.Types.ObjectId(
            session.user.id
          );

        application.printedAt =
          new Date();

        break;

      case "dispatched":
        application.dispatchedBy =
          new mongoose.Types.ObjectId(
            session.user.id
          );

        application.dispatchedAt =
          new Date();

        break;

      case "delivered":
        application.deliveredBy =
          new mongoose.Types.ObjectId(
            session.user.id
          );

        application.deliveredAt =
          new Date();

        break;
    }

    await application.save();

console.log(
  "Saved rejection reason:",
  application.rejectionReason
);

const updatedApplication =
  await ApplicationModel.findById(
    applicationId
  );

console.log(
  "Mongo rejection reason:",
  updatedApplication?.rejectionReason
);

await ApplicationHistoryModel.create({
  applicationId: application._id,
  performedBy: new mongoose.Types.ObjectId(
    session.user.id
  ),
  previousStatus: currentStatus,
  newStatus,
  action: `${currentStatus} → ${newStatus}`,
  remarks: remarks || null,
});
    return NextResponse.json(
      {
        success: true,
        message:
          "Status updated successfully",
      }
    );
  } catch (error) {
    console.error(error);

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