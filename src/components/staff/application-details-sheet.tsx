"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  application: any;

  onApprove: () => void;

  onReject: (reason: string) => void;
}

export default function ApplicationDetailsSheet({
  open,
  onOpenChange,
  application,
  onApprove,
  onReject,
}: Props) {
  const [rejectDialogOpen, setRejectDialogOpen] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  if (!application) return null;

  return (
    <>
      {/* Main Review Modal */}
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent
  className="
    !max-w-350!
    w-[95vw]
    h-[92vh]
    overflow-y-auto
    p-0
  "
>
          <DialogHeader className="border-b px-8 py-6">
            <DialogTitle className="text-2xl font-bold">
              Application Review
            </DialogTitle>

            <DialogDescription>
              Review applicant details and documents
              before approving or rejecting.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-8">
            {/* Summary */}
            <div className="border rounded-xl p-5 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Application Number
                  </p>

                  <p className="font-semibold text-lg">
                    {application.applicationNumber}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {application.status}
                </span>
              </div>
            </div>

            {/* Applicant Info */}
            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">
                Applicant Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <InfoCard
                  label="Full Name"
                  value={application.fullName}
                />

                <InfoCard
                  label="Email"
                  value={application.email}
                />

                <InfoCard
                  label="Phone"
                  value={application.phone}
                />

                <InfoCard
                  label="Gender"
                  value={application.gender}
                />

                <InfoCard
                  label="Date Of Birth"
                  value={new Date(
                    application.dateOfBirth
                  ).toLocaleDateString()}
                />

                <InfoCard
                  label="District"
                  value={application.district}
                />

                <div className="md:col-span-2 border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    Address
                  </p>

                  <p className="font-medium mt-1">
                    {application.address}
                  </p>
                </div>

                <InfoCard
                  label="PIN Code"
                  value={application.pinCode}
                />

                <InfoCard
                  label="Aadhaar Number"
                  value={application.aadharNumber}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">
                Documents
              </h3>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <p className="font-medium mb-3">
                    Passport Photo
                  </p>

                  <Image
                    src={application.photoUrl}
                    alt="Photo"
                    width={600}
                    height={600}
                    className="
                      w-full
                      h-87.5
                      rounded-xl
                      border
                      object-cover
                    "
                  />
                </div>

                <div>
                  <p className="font-medium mb-3">
                    Signature
                  </p>

                  <Image
                    src={application.signatureUrl}
                    alt="Signature"
                    width={600}
                    height={250}
                    className="
                      w-full
                      h-87.5
                      rounded-xl
                      border
                      bg-white
                      object-contain
                      p-4
                    "
                  />
                </div>
              </div>

              <div className="mt-8">
                <p className="font-medium mb-3">
                  Aadhaar Document
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12"
                >
                  <a
                    href={
                      application.aadharDocumentUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Aadhaar Document
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          {application.status === "pending" && (
            <div className="sticky bottom-0 border-t bg-background p-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Close
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  setRejectDialogOpen(true)
                }
              >
                Reject Application
              </Button>

              <Button
  onClick={() => {
    onApprove();

    onOpenChange(false);
  }}
>
  Approve Application
</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={
          setRejectDialogOpen
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject Application
            </DialogTitle>

            <DialogDescription>
              Enter the reason for rejection.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) =>
              setRejectionReason(
                e.target.value
              )
            }
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialogOpen(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
  variant="destructive"
  onClick={() => {
    if (
      !rejectionReason.trim()
    ) {
      alert(
        "Please enter a rejection reason"
      );
      return;
    }

    onReject(
      rejectionReason
    );

    setRejectDialogOpen(
      false
    );

    setRejectionReason("");

    // Close main review modal
    onOpenChange(false);
  }}
>
  Reject
</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="font-medium mt-1">
        {value}
      </p>
    </div>
  );
}