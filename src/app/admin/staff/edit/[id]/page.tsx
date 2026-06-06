"use client";

import axios from "axios";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditStaffPage({
  params,
}: Props) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [staff, setStaff] =
    useState<any>(null);

  useEffect(() => {
    const fetchStaff =
      async () => {
        const { id } =
          await params;

        const res =
          await axios.get(
            `/api/admin/staff/edit/${id}`
          );

        setStaff(
          res.data.staff
        );
      };

    fetchStaff();
  }, [params]);

  const handleSave =
    async () => {
      try {
        setLoading(true);

        const { id } =
          await params;

        const res =
          await axios.put(
            `/api/admin/staff/edit/${id}`,
            staff
          );

        toast.success(
          res.data.message
        );

        router.push(
          "/admin/staff"
        );
      } catch {
        toast.error(
          "Failed to update staff"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!staff) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Edit Staff
        </h1>

        <p className="text-muted-foreground">
          Update staff account
        </p>

      </div>

      <div className="space-y-4">

        <Input
          value={staff.name}
          onChange={(e) =>
            setStaff({
              ...staff,
              name:
                e.target.value,
            })
          }
        />

        <Input
          value={staff.email}
          onChange={(e) =>
            setStaff({
              ...staff,
              email:
                e.target.value,
            })
          }
        />

      </div>

      <div className="border rounded-xl p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="font-medium">
              Staff Access
            </p>

            <p className="text-sm text-muted-foreground">
              Disable login access
            </p>

          </div>

          <Switch
            checked={
              !staff.isDeleted
            }
            onCheckedChange={(
              checked
            ) =>
              setStaff({
                ...staff,
                isDeleted:
                  !checked,
              })
            }
          />

        </div>

      </div>

      <Button
        onClick={handleSave}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </Button>

    </div>
  );
}