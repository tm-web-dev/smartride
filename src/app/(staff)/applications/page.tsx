"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationDetailsSheet from "@/components/staff/application-details-sheet";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

type Application = {
  _id: string;
  applicationNumber: string;
  fullName: string;
  district: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function StaffApplicationsPage() {
  const [status, setStatus] =
    useState("pending");

  const [loading, setLoading] =
    useState(true);

  const [applications, setApplications] =
    useState<Application[]>([]);
    const [
  selectedApplication,
  setSelectedApplication,
] = useState<any>(null);

const [
  openSheet,
  setOpenSheet,
] = useState(false);

  const fetchApplications =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            `/api/staff/applications?status=${status}`
          );

        setApplications(
          res.data.applications || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchApplications();
  }, [status]);

  const updateStatus = async (
  applicationId: string,
  newStatus: string,
  remarks?: string

  ) => {
    try {
      await axios.post(
  "/api/staff/update-status",
  {
    applicationId,
    newStatus,
    remarks,
  }
);

      await fetchApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const renderActions = (
    application: Application
  ) => {
    switch (
      application.status
    ) {
      case "pending":
  return (
    <div className="flex gap-2">

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setSelectedApplication(
            application
          );

          setOpenSheet(true);
        }}
      >
        View Application
      </Button>

    

    </div>
  );

     case "approved":
  return (
    <div className="flex gap-2">

      <Button
        variant="outline"
        onClick={() =>
          window.open(
            `/card-template/${application._id}`,
            "_blank"
          )
        }
      >
        View Card
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          window.open(
  `/api/card/${application._id}`,
  "_blank"
)
        }
      >
        Download PDF
      </Button>

      <Button
        onClick={() =>
          updateStatus(
            application._id,
            "printed"
          )
        }
      >
        Mark Printed
      </Button>

    </div>
  );
      case "printed":
        return (
          <Button
            size="sm"
            onClick={() =>
              updateStatus(
                application._id,
                "dispatched"
              )
            }
          >
            Mark Dispatched
          </Button>
        );

      case "dispatched":
        return (
          <Button
            size="sm"
            onClick={() =>
              updateStatus(
                application._id,
                "delivered"
              )
            }
          >
            Mark Delivered
          </Button>
        );

      default:
        return (
          <span className="text-muted-foreground">
            No Actions
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Applications
        </h1>

        <p className="text-muted-foreground">
          Manage SmartRide applications
        </p>
     
      </div>

      <Tabs
        value={status}
        onValueChange={setStatus}
      >
        <TabsList>
          <TabsTrigger value="pending">
            Pending
          </TabsTrigger>

          <TabsTrigger value="approved">
            Approved
          </TabsTrigger>

          <TabsTrigger value="rejected">
            Rejected
          </TabsTrigger>

          <TabsTrigger value="printed">
            Printed
          </TabsTrigger>

          <TabsTrigger value="dispatched">
            Dispatched
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status}>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-xl mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Application No
                    </TableHead>

                    <TableHead>
                      Applicant
                    </TableHead>

                    <TableHead>
                      District
                    </TableHead>

                    <TableHead>
                      Payment
                    </TableHead>

                    <TableHead>
                      Submitted
                    </TableHead>

                    <TableHead>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {applications.length ===
                  0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10"
                      >
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map(
                      (
                        application
                      ) => (
                        <TableRow
                          key={
                            application._id
                          }
                        >
                          <TableCell>
                            {
                              application.applicationNumber
                            }
                          </TableCell>

                          <TableCell>
                            {
                              application.fullName
                            }
                          </TableCell>

                          <TableCell>
                            {
                              application.district
                            }
                          </TableCell>

                          <TableCell>
                            {
                              application.paymentStatus
                            }
                          </TableCell>

                          <TableCell>
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            {renderActions(
                              application
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
         <ApplicationDetailsSheet
  open={openSheet}
  onOpenChange={setOpenSheet}
  application={selectedApplication}
  onApprove={() =>
    updateStatus(
      selectedApplication._id,
      "approved"
    )
  }
  onReject={(reason) =>
  updateStatus(
    selectedApplication._id,
    "rejected",
    reason
  )
}
/>
    </div>
  );
}