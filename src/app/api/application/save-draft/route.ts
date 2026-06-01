import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";

import { applicationSchema } from "@/schema/applicationSchema";

export async function POST(
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
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

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
        {
          status: 403,
        }
      );
    }

    const body =
      await req.json();

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
        {
          status: 400,
        }
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

    let application =
      await ApplicationModel.findOne(
        {
          userId:
            session.user.id,
          status: "draft",
        }
      );

    if (
      !application
    ) {
      const count =
        await ApplicationModel.countDocuments();

      const applicationNumber = `SR-${new Date().getFullYear()}-${String(
        count + 1
      ).padStart(4, "0")}`;

      application =
        await ApplicationModel.create(
          {
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

            status: "draft",

            paymentStatus:
              "pending",

            applicationFee:
              100,

            isRenewal:
              false,
          }
        );
    } else {
      application.phone =
        phone;

      application.address =
        address;

      application.district =
        district;

      application.pinCode =
        pinCode;

      application.gender =
        gender;

      application.dateOfBirth =
        new Date(
          dateOfBirth
        );

      application.aadharNumber =
        aadharNumber;

      application.photoUrl =
        photoUrl;

      application.signatureUrl =
        signatureUrl;

      application.aadharDocumentUrl =
        aadharDocumentUrl;

      await application.save();
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Draft saved successfully",
        application,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SAVE_DRAFT_ERROR:",
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