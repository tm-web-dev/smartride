import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";

import { applicationSchema } from "@/schema/applicationSchema";
import SettingsModel from "@/models/settings";

export async function POST(
  req: Request
) {
  await dbConnect();

  try {
    // Session check
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

    // Only users can apply
    if (
      session.user.role !==
      "user"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only users can apply",
        },
        { status: 403 }
      );
    }
    const settings =
  await SettingsModel.findOne();

if (
  settings &&
  !settings.applicationsEnabled
) {
  return NextResponse.json(
    {
      success: false,
      message:
        settings.applicationDisabledMessage ||
        "Applications are currently closed.",
    },
    {
      status: 403,
    }
  );
}

    const body =
      await req.json();

    // Validate request
    const validation =
      applicationSchema.safeParse(
        body
      );

    if (
      !validation.success
    ) {
      return NextResponse.json(
        {
          success: false,
          errors:
            validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      phone,
      address,
      district,
      pinCode,
      gender,
      dateOfBirth,
      aadharNumber,
      photoUrl,
      signatureUrl,
      aadharDocumentUrl,
    } = validation.data;

    // Prevent duplicate active application
    const existingApplication =
      await ApplicationModel.findOne(
        {
          userId:
            session.user.id,

          status: {
            $in: [
              "pending",
              "approved",
              "dispatched",
            ],
          },
        }
      );

    if (
      existingApplication
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have an active application",
        },
        { status: 409 }
      );
    }

    // Generate application number
    const count =
      await ApplicationModel.countDocuments();

    const applicationNumber = `SR-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    // Create application
    const application =
  await ApplicationModel.create({
    userId:
      session.user.id,

    applicationNumber,

    fullName:
      session.user.name,

    email:
      session.user.email,

    phone,
    address,
    district,
    pinCode,

    gender,

    dateOfBirth,

    aadharNumber,

    photoUrl,

    signatureUrl,

    aadharDocumentUrl,

    applicationFee:
      settings?.cardFee ||
      100,

    status:
      "pending",

    isRenewal:
      false,
  });

    return NextResponse.json(
      {
        success: true,

        message:
          "Application submitted successfully",

        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "APPLICATION_ERROR:",
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