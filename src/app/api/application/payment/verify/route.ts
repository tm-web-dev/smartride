import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";

export async function POST(req: Request) {
  await dbConnect();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    applicationId,
  } = await req.json();

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET!
    )
    .update(
      razorpay_order_id +
        "|" +
        razorpay_payment_id
    )
    .digest("hex");

  if (
    generatedSignature !==
    razorpay_signature
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
      },
      { status: 400 }
    );
  }

  await ApplicationModel.findByIdAndUpdate(
    applicationId,
    {
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      paymentDate: new Date(),

      status: "pending",

      validFrom: new Date(),

      validTill: new Date(
        Date.now() +
          365 * 24 * 60 * 60 * 1000
      ),
    }
  );

  return NextResponse.json({
    success: true,
  });
}