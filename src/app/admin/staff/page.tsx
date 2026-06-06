"use client";

import axios from "axios";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

type Staff = {
  _id: string;

  name: string;

  email: string;

  isVerified: boolean;

  isDeleted: boolean;

  createdAt: string;
};

export default function StaffPage() {
  const [staff, setStaff] =
    useState<Staff[]>([]);

  const [search, setSearch] =
    useState("");

  const fetchStaff =
    async () => {
      const res =
        await axios.get(
          `/api/admin/staff?search=${search}`
        );

      setStaff(
        res.data.staff
      );
    };

  useEffect(() => {
    fetchStaff();
  }, [search]);

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Staff
          </h1>

          <p className="text-muted-foreground">
            Manage staff members
          </p>
        </div>

        <Button asChild>
          <Link
            href="/admin/staff/create"
          >
            Create Staff
          </Link>
        </Button>

      </div>

      <Input
        placeholder="Search staff..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <div className="border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-muted">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Verified
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {staff.map(
              (member) => (
                <tr
                  key={
                    member._id
                  }
                  className="border-t"
                >
                  <td className="p-4">
                    {member.name}
                  </td>

                  <td className="p-4">
                    {member.email}
                  </td>

                  <td className="p-4">
                    {member.isVerified
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="p-4">
                    {member.isDeleted
                      ? "Disabled"
                      : "Active"}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link
                          href={`/admin/staff/${member._id}`}
                        >
                          View
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link
                          href={`/admin/staff/edit/${member._id}`}
                        >
                          Edit
                        </Link>
                      </Button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}