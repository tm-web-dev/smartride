import Application from "@/models/application";
import razorpay from "@/lib/razorpay";

export async function POST(req: Request) {
  const { applicationId } =
    await req.json();

  const application =
    await Application.findById(
      applicationId
    );

  if (!application) {
    return Response.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  const amount =
    application.applicationFee;

  const order =
    await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: applicationId,
    });

  return Response.json({
    order,
  });
}