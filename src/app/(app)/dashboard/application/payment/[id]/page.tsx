"use client";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  CreditCard,
  Bus,
  ShieldCheck,
} from "lucide-react";

export default function PaymentPage() {
  const params = useParams();

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [
    application,
    setApplication,
  ] = useState<any>(null);

  useEffect(() => {
  const fetchApplication =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/application/get"
          );

        setApplication(
          res.data.application
        );
      } catch (error) {
        console.error(error);
      }
    };

  fetchApplication();
}, []);

  const startPayment =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await axios.post(
            "/api/application/payment/create-order",
            {
              applicationId:
                params.id,
            }
          );

        const options = {
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            data.order.amount,

          currency:
            data.order.currency,

          order_id:
            data.order.id,

          name:
            "SmartRide",

          description:
            "Bus Concession Card Fee",

          handler:
            async (
              response: any
            ) => {
              await axios.post(
                "/api/application/payment/verify",
                {
                  ...response,

                  applicationId:
                    params.id,
                }
              );

              router.push(
                `/dashboard/application/payment/payment-success?applicationId=${params.id}`
              );
            },

          theme: {
            color:
              "#2563eb",
          },
        };

        const rzp =
          new (
            window as any
          ).Razorpay(
            options
          );

        rzp.on(
          "payment.failed",
          async function (
            response: any
          ) {
            try {
              await axios.post(
                "/api/application/payment/failed",
                {
                  applicationId:
                    params.id,

                  error:
                    response.error
                      ?.description ||
                    "Payment failed",
                }
              );

              router.push(
                `/dashboard/application/payment/payment-failed?applicationId=${params.id}`
              );
            } catch (
              error
            ) {
              console.error(
                "Failed payment handler:",
                error
              );
            }
          }
        );

        rzp.open();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="container max-w-2xl py-10">

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />

            SmartRide Payment
          </CardTitle>

          <CardDescription>
            Complete your concession card
            application payment.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-6">

          <div className="rounded-lg border p-4">

            <div className="flex justify-between">

              <span>
                Application Fee
              </span>

              <span className="font-semibold">
                ₹
                {application?.applicationFee ||
                  100}
              </span>

            </div>

          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <ShieldCheck className="h-4 w-4" />

            Secure payment powered by
            Razorpay

          </div>

          <Button
            className="w-full"
            onClick={
              startPayment
            }
            disabled={
              loading
            }
          >

            <CreditCard className="mr-2 h-4 w-4" />

            {loading
              ? "Processing..."
              : `Pay ₹${application?.applicationFee || 100}`}

          </Button>

        </CardContent>

      </Card>

    </div>
  );
}