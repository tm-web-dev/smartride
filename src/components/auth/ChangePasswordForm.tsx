"use client";

import { useState } from "react";

import axios from "axios";

import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Loader2 } from "lucide-react";

import { changePasswordSchema } from "@/schema/changePasswordSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

export default function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const form = useForm<
    z.infer<typeof changePasswordSchema>
  >({
    resolver: zodResolver(
      changePasswordSchema
    ),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: z.infer<
      typeof changePasswordSchema
    >
  ) => {
    try {
      setIsSubmitting(true);

      const response =
        await axios.post(
          "/api/auth/change-password",
          {
            currentPassword:
              data.currentPassword,

            newPassword:
              data.newPassword,
          }
        );

      toast.success(
  "🔐 Password Changed",
  {
    description:
      "Your password has been updated successfully.",
    duration: 5000,
  }
);

      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">

      <div className="border rounded-2xl p-6 bg-card shadow-sm">

        <h1 className="text-2xl font-bold mb-6">
          Change Password
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >

            <FormField
              control={
                form.control
              }
              name="currentPassword"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Current Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="newPassword"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    New Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
              name="confirmPassword"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>

          </form>
        </Form>

      </div>

    </div>
  );
}