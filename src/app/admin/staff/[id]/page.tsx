"use client";

import axios from "axios";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function StaffPage({
  params,
}: Props) {
  const [staff, setStaff] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {
    const fetchStaff =
      async () => {
        const { id } =
          await params;

        const res =
          await axios.get(
            `/api/admin/staff/${id}`
          );

        setStaff(
          res.data.staff
        );

        setStats(
          res.data.stats
        );
      };

    fetchStaff();
  }, [params]);

  if (!staff) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          {staff.name}
        </h1>

        <p className="text-muted-foreground">
          {staff.email}
        </p>
      </div>

      {/* Staff Info */}
      <div className="border rounded-xl p-6">

        <h2 className="font-semibold mb-4">
          Staff Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <p>
            <strong>
              Role:
            </strong>{" "}
            {staff.role}
          </p>

          <p>
            <strong>
              Verified:
            </strong>{" "}
            {staff.isVerified
              ? "Yes"
              : "No"}
          </p>

          <p>
            <strong>
              Status:
            </strong>{" "}
            {staff.isDeleted
              ? "Disabled"
              : "Active"}
          </p>

          <p>
            <strong>
              Joined:
            </strong>{" "}
            {new Date(
              staff.createdAt
            ).toLocaleDateString()}
          </p>

        </div>

      </div>

      {/* Performance */}
      <div className="border rounded-xl p-6">

        <h2 className="font-semibold mb-4">
          Staff Performance
        </h2>

        <div className="grid md:grid-cols-5 gap-4">

          <StatCard
            title="Approved"
            value={
              stats?.approved || 0
            }
          />

          <StatCard
            title="Rejected"
            value={
              stats?.rejected || 0
            }
          />

          <StatCard
            title="Printed"
            value={
              stats?.printed || 0
            }
          />

          <StatCard
            title="Dispatched"
            value={
              stats?.dispatched ||
              0
            }
          />

          <StatCard
            title="Delivered"
            value={
              stats?.delivered ||
              0
            }
          />

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="border rounded-xl p-4">

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}