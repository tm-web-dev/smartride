"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  CheckCircle2,
  Download,
  ArrowRight,
  Mail,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams =
    useSearchParams();

  const applicationId =
    searchParams.get(
      "applicationId"
    );

  useEffect(() => {
    window.scrollTo(0, 0);

    document.body.style.overflow =
      "auto";

    document.body.style.position =
      "static";

    document.documentElement.style.overflow =
      "auto";
  }, []);

  return (
    <div className="container max-w-3xl mx-auto py-10 min-h-screen">

      <Card className="border-green-200 shadow-lg">

        <CardHeader className="text-center">

          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-20 w-20 text-green-600" />
          </div>

          <CardTitle className="text-3xl font-bold text-green-700">
            Payment Successful
          </CardTitle>

          <CardDescription className="text-base">
            Your SmartRide Bus
            Concession Card application
            has been submitted
            successfully.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-6">

          {/* Email Notice */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <Mail className="h-4 w-4" />
              Confirmation Email Sent
            </div>

            <p className="text-sm text-green-600 mt-2">
              A confirmation email has
              been sent to your
              registered email address.
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-lg border p-4 bg-muted/40">

            <div className="flex justify-between py-2">
              <span>
                Application ID
              </span>

              <span className="font-medium break-all text-right">
                {applicationId}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>
                Payment Status
              </span>

              <span className="font-medium text-green-600">
                Paid
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>
                Application Status
              </span>

              <span className="font-medium text-amber-600">
                Waiting for Approval
              </span>
            </div>

          </div>

          {/* Next Steps */}
          <div className="rounded-lg border p-4">

            <h3 className="font-semibold mb-3">
              What happens next?
            </h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                ✓ Payment received
                successfully.
              </li>

              <li>
                ✓ Documents will be
                verified by the
                Approver Desk.
              </li>

              <li>
                ✓ Application status
                remains "Waiting for
                Approval" until review.
              </li>

              <li>
                ✓ Once approved, your
                concession card will be
                sent for printing.
              </li>

              <li>
                ✓ Email notifications
                will be sent at every
                major stage.
              </li>
            </ul>

          </div>

          {/* Actions */}
          <div className="grid gap-3">

            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.open(
                  `/api/application/download-pdf/${applicationId}`,
                  "_blank"
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-full"
            >
              <Link href="/dashboard">
                Go To Dashboard

                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}