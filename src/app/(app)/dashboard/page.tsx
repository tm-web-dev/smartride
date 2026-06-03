"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  FileText,
  PlusCircle,
  CreditCard,
  Eye,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await axios.get("/api/application/get");
        setApplication(res.data?.application || null);
      } catch (err) {
        console.log("Error fetching application", err);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, []);

  const getStatusColor = (status: string, isPaid: boolean) => {
    if (!isPaid) return "bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full";

    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full";
      case "rejected":
        return "bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full";
      case "dispatched":
        return "bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full";
      case "delivered":
        return "bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full";
      default:
        return "bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full";
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  // Safely look up payment state flags directly from your data payload
  const isPaid = application?.paymentStatus === "paid";

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your SmartRide concession card
        </p>
      </div>

      {!application ? (
        <div className="border rounded-2xl p-8 bg-card shadow-sm">
          <div className="flex flex-col items-center text-center">
            <FileText size={48} className="mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No Application Found</h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md">
              Start your concession card application process.
            </p>
            <Link href="/dashboard/application/apply">
              <Button className="flex gap-2">
                <PlusCircle size={18} />
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Application Card */}
          <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Current Application</h2>
              <span
                className={`text-xs font-semibold capitalize ${getStatusColor(application.status, isPaid)}`}
              >
                {!isPaid
                  ? "Payment Pending"
                  : application.status === "pending"
                    ? "Waiting for Approval"
                    : application.status === "approved"
                      ? "Approved"
                      : application.status === "rejected"
                        ? "Rejected"
                        : application.status === "dispatched"
                          ? "Card Dispatched"
                          : application.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Application No:</span>{" "}
                {application.applicationNumber}
              </p>

              <p>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>

              {application.status !== "rejected" &&
                application.status !== "pending" &&
                application.validTill && (
                  <p>
                    <span className="font-medium">Valid Till:</span>{" "}
                    {new Date(application.validTill).toLocaleDateString()}
                  </p>
                )}

              {application.status === "pending" && (
                <p className="text-amber-600">
                  Card validity will be assigned after approval.
                </p>
              )}

              {application.status === "rejected" && (
                <div className="border border-red-200 bg-red-50 rounded-xl p-4 mt-2">
                  <h3 className="font-semibold text-red-700 mb-2">
                    Application Rejected
                  </h3>

                  <p className="text-sm text-red-600">
                    {application.rejectionReason ||
                      "No rejection reason provided"}
                  </p>
                </div>
              )}
            </div>

            {/* DYNAMIC ACTION BUTTONS */}
           {/* DYNAMIC ACTION BUTTONS */}
<div className="pt-4 flex gap-3 flex-wrap">
  {isPaid ? (
    <>
      {application.status === "rejected" ? (
        <Button asChild>
          <Link
            href={`/dashboard/application/edit/${application._id}`}
          >
            Edit & Resubmit Application
          </Link>
        </Button>
      ) : application.status === "approved" ||
        application.status === "printed" ||
        application.status === "dispatched" ||
        application.status === "delivered" ? (
        <>
          <Button
            className="flex gap-2"
            asChild
          >
            <Link
              href={`/api/card/${application._id}`}
              target="_blank"
            >
              <FileDown size={16} />
              Download SmartRide Card
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex gap-2"
            asChild
          >
            <Link
              href={`/card-template/${application._id}`}
              target="_blank"
            >
              <Eye size={16} />
              Preview Card
            </Link>
          </Button>
        </>
      ) : (
        <Button
          className="flex gap-2"
          asChild
        >
          <Link
            href={`/api/application/download-pdf/${application._id}`}
            target="_blank"
          >
            <FileDown size={16} />
            Download Receipt PDF
          </Link>
        </Button>
      )}
    </>
  ) : (
    <Button
      className="w-full gap-2 text-sm h-10 px-6 rounded-xl"
      asChild
    >
      <Link
        href={`/dashboard/application/payment/${application._id}`}
      >
        <CreditCard size={16} />
        Proceed with Payment
      </Link>
    </Button>
  )}
</div>
          </div>
        </div>
      )}
    </div>
  );
}
