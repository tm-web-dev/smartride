"use client";

import axios from "axios";

import {
  useEffect,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";


type User = {
  _id: string;

  name: string;

  email: string;

  isVerified: boolean;

  isDeleted: boolean;

  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const fetchUsers =
    async () => {
      try {
        const res =
          await axios.get(
            `/api/admin/users?search=${search}`
          );

        setUsers(
          res.data.users
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, [search]);
const toggleUser =
  async (id: string) => {
    try {
      await axios.patch(
        `/api/admin/users/${id}/toggle-status`
      );

      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  <div>
    <h1 className="text-3xl font-bold">
      Users
    </h1>

    <p className="text-muted-foreground">
      Manage SmartRide users
    </p>
  </div>

  <Button asChild>
    <a
      href="/api/admin/users/export"
      target="_blank"
    >
      <Download
        size={16}
        className="mr-2"
      />
      Export Users
    </a>
  </Button>

</div>

      <Input
        placeholder="Search users..."
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

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Verified
              </th>

              <th className="text-left p-4">
                Joined
              </th>
              <th className="text-left p-4">
  Actions
</th>

            </tr>

          </thead>

          <tbody>

            {users.map(
              (user) => (
                <tr
                  key={user._id}
                  className="border-t"
                >
                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.isVerified
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="p-4">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-4">
  <td className="p-4">
  <div className="flex gap-2">

    <Button
      size="sm"
      variant="outline"
      asChild
    >
      <Link
        href={`/admin/users/${user._id}`}
      >
        View
      </Link>
    </Button>

    <Button
      size="sm"
      variant={
        user.isDeleted
          ? "default"
          : "destructive"
      }
      onClick={() =>
        toggleUser(user._id)
      }
    >
      {user.isDeleted
        ? "Enable"
        : "Disable"}
    </Button>

  </div>
</td>
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