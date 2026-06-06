import { NextResponse } from "next/server";

import * as XLSX from "xlsx";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";
import ApplicationModel from "@/models/application";

export async function GET() {
  try {
    await dbConnect();

    const users =
      await Usermodel.find({
        role: "user",
      }).lean();

    const rows = [];

    for (const user of users) {
      const latestApplication =
        await ApplicationModel.findOne({
          userId: user._id,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      rows.push({
        Name: user.name,

        Email: user.email,

        Role: user.role,

        Verified:
          user.isVerified
            ? "Yes"
            : "No",

        Disabled:
          user.isDeleted
            ? "Yes"
            : "No",

        Phone:
          latestApplication?.phone ||
          "",

        Gender:
          latestApplication?.gender ||
          "",

        "Date Of Birth":
          latestApplication?.dateOfBirth
            ? new Date(
                latestApplication.dateOfBirth
              ).toLocaleDateString()
            : "",

        Address:
          latestApplication?.address ||
          "",

        District:
          latestApplication?.district ||
          "",

        "PIN Code":
          latestApplication?.pinCode ||
          "",

        "Aadhaar Number":
          latestApplication?.aadharNumber ||
          "",

        "Application Number":
          latestApplication?.applicationNumber ||
          "",

        "Application Status":
  latestApplication?.status
    ?.replaceAll("_", " ")
    ?.toUpperCase() || "",
        "Payment Status":
          latestApplication?.paymentStatus ||
          "",

        "Payment Date":
          latestApplication?.paymentDate
            ? new Date(
                latestApplication.paymentDate
              ).toLocaleDateString()
            : "",

        "Application Fee":
          latestApplication?.applicationFee ||
          "",

          

        "Valid From":
          latestApplication?.validFrom
            ? new Date(
                latestApplication.validFrom
              ).toLocaleDateString()
            : "",

        "Valid Till":
          latestApplication?.validTill
            ? new Date(
                latestApplication.validTill
              ).toLocaleDateString()
            : "",

        "Joined Date":
          new Date(
            user.createdAt
          ).toLocaleDateString(),
      });
    }

    const worksheet =
      XLSX.utils.json_to_sheet(
        rows
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    const buffer =
      XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

    return new Response(
      buffer,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            'attachment; filename="SmartRide-Users.xlsx"',
        },
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to export users",
      },
      {
        status: 500,
      }
    );
  }
}