"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Loader2,
  Search,
} from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const fetchHistory =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            `/api/staff/history?page=${page}&search=${search}&status=${statusFilter}`
          );

        setHistory(
          res.data.history || []
        );

        setTotalPages(
          res.data.pagination
            ?.totalPages || 1
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchHistory();
  }, [page, search, statusFilter]);

  const getStatusBadge = (
    status: string
  ) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
            Approved
          </span>
        );

      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
            Rejected
          </span>
        );

      case "printed":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
            Printed
          </span>
        );

      case "dispatched":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            Dispatched
          </span>
        );

      case "delivered":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
            Delivered
          </span>
        );

      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Application History
        </h1>

        <p className="text-muted-foreground">
          View all SmartRide application actions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">

        <div className="relative">
          <Search
            size={16}
            className="
              absolute
              left-3
              top-3
              text-muted-foreground
            "
          />

          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(
                e.target.value
              );
            }}
            className="
              border
              rounded-lg
              pl-9
              pr-3
              py-2
              w-72
              bg-background
            "
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);

            setStatusFilter(
              e.target.value
            );
          }}
          className="
            border
            rounded-lg
            px-3
            py-2
            bg-background
          "
        >
          <option value="">
            All Statuses
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

          <option value="printed">
            Printed
          </option>

          <option value="dispatched">
            Dispatched
          </option>

          <option value="delivered">
            Delivered
          </option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="border rounded-xl overflow-hidden">

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
                    Previous Status
                  </TableHead>

                  <TableHead>
                    New Status
                  </TableHead>

                  <TableHead>
                    Remarks
                  </TableHead>

                  <TableHead>
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {history.length ===
                0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10"
                    >
                      No history found
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map(
                    (item) => (
                      <TableRow
                        key={
                          item._id
                        }
                      >
                        <TableCell className="font-medium">
                          {
                            item
                              .applicationId
                              ?.applicationNumber
                          }
                        </TableCell>

                        <TableCell>
                          {
                            item
                              .applicationId
                              ?.fullName
                          }
                        </TableCell>

                        <TableCell>
                          {getStatusBadge(
                            item.previousStatus
                          )}
                        </TableCell>

                        <TableCell>
                          {getStatusBadge(
                            item.newStatus
                          )}
                        </TableCell>

                        <TableCell className="max-w-xs truncate">
                          {item.remarks ||
                            "-"}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}

              </TableBody>

            </Table>

          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">

            <div className="text-sm text-muted-foreground">
              Page {page} of{" "}
              {totalPages}
            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    page - 1
                  )
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={
                  page ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    page + 1
                  )
                }
              >
                Next
              </Button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}