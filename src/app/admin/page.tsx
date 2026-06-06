"use client";

import axios from "axios";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import {
  Users,
  UserCog,
  FileText,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  Printer,
  Truck,
  PackageCheck,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalStaff: number;
  totalApplications: number;

  pending: number;
  approved: number;
  rejected: number;

  printed: number;
  dispatched: number;
  delivered: number;

  revenue: number;
};

export default function AdminPage() {
  const [stats, setStats] =
    useState<Stats | null>(null);

  const [loading, setLoading] =
    useState(true);
const [applicationsEnabled, setApplicationsEnabled] =
  useState(true);


const handleToggle =
  async (
    checked: boolean
  ) => {
    try {
      setApplicationsEnabled(
        checked
      );

      await axios.patch(
        "/api/admin/settings",
        {
          applicationsEnabled:
            checked,
        }
      );

      toast.success(
        checked
          ? "Applications Enabled"
          : "Applications Disabled"
      );
    } catch (error) {
      toast.error(
        "Failed to update settings"
      );
    }
  };
useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings =
  async () => {
    try {
      const res =
        await axios.get(
          "/api/admin/settings"
        );

      setApplicationsEnabled(
        res.data.settings
          .applicationsEnabled
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const res =
            await axios.get(
              "/api/admin/dashboard"
            );

          setStats(
            res.data.stats
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        Loading dashboard...
      </div>
    );
  }
function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-5 bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        {icon}
      </div>

      <h2 className="text-3xl font-bold mt-4">
        {value}
      </h2>
    </div>
  );
}
 return (
  <div className="space-y-8">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  {/* Left Side */}
  <div>
    <h1 className="text-3xl font-bold">
      SmartRide Admin Dashboard
    </h1>

    <p className="text-muted-foreground">
      Manage applications, staff, users and platform settings
    </p>
  </div>

  {/* Right Side */}
  <div className="border rounded-xl px-4 py-3 bg-card min-w-65">

    <div className="flex items-center gap-3">

      <Switch
        checked={applicationsEnabled}
        onCheckedChange={handleToggle}
      />

      <div>
        <p className="font-medium">
          Accept Applications
        </p>

        <p className="text-sm text-muted-foreground">
          {applicationsEnabled
            ? "Applications are open"
            : "Applications are closed"}
        </p>
      </div>

    </div>

  </div>

</div>
    {/* Platform Overview */}
    <div className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold">
          Platform Overview
        </h2>

        <div className="h-px bg-border mt-2" />
      </div>

      <div className="grid md:grid-cols-5 gap-4">

        <Card
          title="Users"
          value={stats?.totalUsers || 0}
          icon={<Users size={20} />}
        />

        <Card
          title="Staff"
          value={stats?.totalStaff || 0}
          icon={<UserCog size={20} />}
        />

        <Card
          title="Applications"
          value={stats?.totalApplications || 0}
          icon={<FileText size={20} />}
        />

        <Card
          title="Pending"
          value={stats?.pending || 0}
          icon={<Clock size={20} />}
        />

        <Card
          title="Revenue"
          value={stats?.revenue || 0}
          icon={<IndianRupee size={20} />}
        />

      </div>
    </div>

    {/* Application Workflow */}
    <div className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold">
          Application Workflow
        </h2>

        <div className="h-px bg-border mt-2" />
      </div>

      <div className="grid md:grid-cols-5 gap-4">

        <Card
          title="Approved"
          value={stats?.approved || 0}
          icon={<CheckCircle size={20} />}
        />

        <Card
          title="Rejected"
          value={stats?.rejected || 0}
          icon={<XCircle size={20} />}
        />

        <Card
          title="Printed"
          value={stats?.printed || 0}
          icon={<Printer size={20} />}
        />

        <Card
          title="Dispatched"
          value={stats?.dispatched || 0}
          icon={<Truck size={20} />}
        />

        <Card
          title="Delivered"
          value={stats?.delivered || 0}
          icon={<PackageCheck size={20} />}
        />

      </div>
    </div>

    {/* Analytics */}
    <div className="border rounded-xl p-8 bg-card">

      <h2 className="text-xl font-semibold">
        Analytics & Reports
      </h2>

      <p className="text-muted-foreground mt-2">
        Application Trends, Revenue Charts,
        Date Filters and Excel Export
        will be added in the next step.
      </p>

    </div>

  </div>
);

}