"use client";

import axios from "axios";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

export default function CreateStaffPage() {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        const res =
          await axios.post(
            "/api/admin/staff/create",
            form
          );

        toast.success(
          res.data.message
        );

        router.push(
          "/admin/staff"
        );
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to create staff"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-xl">

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Create Staff
        </h1>

        <p className="text-muted-foreground">
          Add a new staff member
        </p>

      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >

        <Input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name:
                e.target.value,
            })
          }
        />

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Staff"}
        </Button>

      </form>

    </div>
  );
}   