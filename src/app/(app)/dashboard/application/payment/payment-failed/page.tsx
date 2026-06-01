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

import {
  XCircle,
  RefreshCcw,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();

  const applicationId =
    searchParams.get("applicationId");

  return (
    <div className="container max-w-3xl py-10">
      <Card className="border-red-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-20 w-20 text-red-600" />
          </div>

          <CardTitle className="text-3xl">
            Payment Failed
          </CardTitle>

          <CardDescription className="text-base">
            We could not complete your
            payment. Your application has
            not been submitted for approval.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 bg-muted/40">
            <div className="flex justify-between py-2">
              <span>Application ID</span>
              <span className="font-medium">
                {applicationId}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Payment Status</span>
              <span className="font-medium text-red-600">
                Failed
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Application Status</span>
              <span className="font-medium">
                Payment Pending
              </span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />

              <h3 className="font-semibold">
                Possible Reasons
              </h3>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Payment was cancelled by
                the user.
              </li>

              <li>
                • Insufficient account
                balance.
              </li>

              <li>
                • Network interruption
                during payment.
              </li>

              <li>
                • Bank or UPI transaction
                failure.
              </li>
            </ul>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Button asChild>
              <Link
                href={`/dashboard/application/payment/${applicationId}`}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry Payment
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go To Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}