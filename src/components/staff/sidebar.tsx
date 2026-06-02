"use client";

import Link from "next/link";
import {
  FileText,
  History,
} from "lucide-react";

export default function StaffSidebar() {
  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-8">
        SmartRide Staff
      </h2>

      <div className="space-y-2">

        <Link
          href="/staff/applications"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
        >
          <FileText size={18} />
          Applications
        </Link>

        <Link
          href="/staff/history"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
        >
          <History size={18} />
          Application History
        </Link>

      </div>
    </div>
  );
}