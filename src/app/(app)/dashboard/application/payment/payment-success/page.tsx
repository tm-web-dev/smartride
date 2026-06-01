"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { CheckCircle2, Download, FileText, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const applicationId = searchParams.get("applicationId");

  return (
    <div className="container max-w-3xl py-10">
      <Card className="border-green-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-20 w-20 text-green-600" />
          </div>

          <CardTitle className="text-3xl">Payment Successful</CardTitle>

          <CardDescription className="text-base">
            Your SmartRide Bus Concession Card application has been submitted
            successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 bg-muted/40">
            <div className="flex justify-between py-2">
              <span>Application ID</span>
              <span className="font-medium">{applicationId}</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Payment Status</span>
              <span className="font-medium text-green-600">Paid</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Application Status</span>
              <span className="font-medium text-amber-600">
                Waiting for Approval
              </span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">What happens next?</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Your payment has been received.</li>

              <li>✓ Your documents will be verified by the Approver Desk.</li>

              <li>
                ✓ Once approved, your card will be sent to the Printer Desk.
              </li>

              <li>✓ You will receive updates via email.</li>
            </ul>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.open(`/api/application/pdf/${applicationId}`, "_blank")
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          <Button asChild variant="secondary" className="w-full">
            <Link href="/dashboard">
              Go To Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
