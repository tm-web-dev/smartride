import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";

import { Resend } from "resend";

const resend = new Resend(
  process.env.RESENDER_API_KEY
);

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

  const application =
    await ApplicationModel.findByIdAndUpdate(
      applicationId,
      {
        paymentStatus: "paid",
        paymentId: razorpay_payment_id,
        paymentDate: new Date(),

        status: "pending",

        validFrom: null,
        validTill: null,
      },
      { new: true }
    );

  if (!application) {
    return NextResponse.json(
      {
        success: false,
        message: "Application not found",
      },
      { status: 404 }
    );
  }
  try {
    await resend.emails.send({
      from:
        "SmartRide <no-reply@crewofficials.com>",

      to: application.email,

      subject:
        "SmartRide Application Submitted Successfully",

      html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
      ">
        
        <div style="
          background:#2563eb;
          color:white;
          padding:20px;
          border-radius:8px;
        ">
          <h1>SmartRide</h1>
          <p>
            Automated Bus Concession Card System
          </p>
        </div>

        <h2>
          Payment Successful
        </h2>

        <p>
          Dear ${application.fullName},
        </p>

        <p>
          Your payment has been received successfully.
        </p>

        <p>
          Your application has been submitted and is now waiting for approval.
        </p>

        <hr />

        <table style="width:100%">
          <tr>
            <td>
              <strong>
                Application Number
              </strong>
            </td>

            <td>
              ${application.applicationNumber}
            </td>
          </tr>

          <tr>
            <td>
              <strong>
                Payment ID
              </strong>
            </td>

            <td>
              ${application.paymentId}
            </td>
          </tr>

          <tr>
            <td>
              <strong>
                Amount Paid
              </strong>
            </td>

            <td>
              ₹${application.applicationFee}
            </td>
          </tr>

          <tr>
            <td>
              <strong>
                Status
              </strong>
            </td>

            <td>
              Waiting For Approval
            </td>
          </tr>
        </table>

        <br />

        <p>
          You will receive another email when the application is approved.
        </p>

        <p>
          Regards,<br />
          SmartRide Team
        </p>
      </div>
    `,
    });

    console.log(
      "Payment success email sent"
    );
  } catch (error) {
    console.error(
      "Email sending failed:",
      error
    );
  }
  return NextResponse.json({
    success: true,
  });
}