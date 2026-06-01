import connectDB from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";
import { notFound } from "next/navigation";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  const application =
    await ApplicationModel.findById(id).lean();

  if (!application) {
    notFound();
  }

  return (
  <div className="bg-white p-2">
    <div className="max-w-4xl mx-auto bg-white border rounded-lg overflow-hidden">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">
          SMARTRIDE
        </h1>

        <p className="text-sm mt-1">
          Automated Bus Concession Card System
        </p>

        <p className="text-xs opacity-90">
          Government Transport Department
        </p>
      </div>

      <div className="p-4">

        {/* Receipt Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Payment Receipt
            </h2>

            <p className="text-xs text-slate-500">
              Application No: {application.applicationNumber}
            </p>
          </div>

          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            PAID ✓
          </div>
        </div>

        {/* Applicant + Photo + Signature */}
        <div className="grid grid-cols-3 gap-3 mb-4">

          {/* Left */}
          <div className="col-span-2">
            <div className="border rounded-lg p-3 text-sm">
              <h3 className="font-bold text-base mb-2 text-blue-700">
                Applicant Details
              </h3>

              <div className="space-y-1">
                <p>
                  <strong>Name:</strong>{" "}
                  {application.fullName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {application.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {application.phone}
                </p>

                <p>
                  <strong>Gender:</strong>{" "}
                  {application.gender}
                </p>

                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(
                    application.dateOfBirth
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>District:</strong>{" "}
                  {application.district}
                </p>

                <p>
                  <strong>PIN Code:</strong>{" "}
                  {application.pinCode}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {application.address}
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-3">

            {/* Photo */}
            <div className="border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2">
                Photo
              </h3>

              <img
                src={application.photoUrl}
                alt="Applicant"
                className="w-full h-36 object-cover rounded-md border"
              />
            </div>

            {/* Signature */}
            <div className="border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2">
                Signature
              </h3>

              <img
                src={application.signatureUrl}
                alt="Signature"
                className="h-10 object-contain"
              />
            </div>

          </div>
        </div>

        {/* Payment Details */}
        <div className="border rounded-lg p-3 mb-4 bg-blue-50 text-sm">
          <h3 className="font-bold text-base mb-2 text-blue-700">
            Payment Details
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Amount Paid:</strong>{" "}
              ₹{application.applicationFee}
            </p>

            <p>
              <strong>Status:</strong> Paid
            </p>

            <p>
              <strong>Transaction ID:</strong>{" "}
              {application.paymentId || "N/A"}
            </p>

            <p>
              <strong>Payment Date:</strong>{" "}
              {application.paymentDate
                ? new Date(
                    application.paymentDate
                  ).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="border rounded-lg p-3 bg-amber-50 border-amber-300 mb-4 text-sm">
          <h3 className="font-bold text-base text-amber-700">
            Application Status
          </h3>

          <p className="text-amber-800 mt-1">
            Waiting for Approval
          </p>

          <p className="text-xs text-amber-600 mt-1">
            Your payment has been received successfully and the application is awaiting verification.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t pt-3 text-center text-xs text-slate-500">
          <p>
            This is a computer-generated receipt.
          </p>

          <p>
            Generated On: {new Date().toLocaleString()}
          </p>

          <p className="mt-1 font-semibold">
            SmartRide Bus Concession Card System
          </p>
        </div>

      </div>
    </div>
  </div>
);
}