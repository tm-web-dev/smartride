import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Application from "@/models/application";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { applicationId, error } =
      await req.json();

    const application =
      await Application.findById(
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

    application.paymentStatus =
      "failed";

    application.status =
      "payment_pending";

    application.paymentFailureReason =
      error || "Payment failed";

    await application.save();

    return NextResponse.json({
      success: true,
      message:
        "Application updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update application",
      },
      { status: 500 }
    );
  }
}