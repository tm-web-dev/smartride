"use client";

import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import axios from "axios";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

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

import { Loader2 } from "lucide-react";

import { resetPasswordSchema } from "@/schema/resetPasswordSchema";

export default function ResetPasswordPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const form = useForm<
    z.infer<
      typeof resetPasswordSchema
    >
  >({
    resolver: zodResolver(
      resetPasswordSchema
    ),

    defaultValues: {
      password: "",
      confirmPassword:
        "",
    },
  });

  const onSubmit = async (
    data: z.infer<
      typeof resetPasswordSchema
    >
  ) => {
    try {
      setIsSubmitting(true);

      const response =
        await axios.post(
          "/api/auth/reset-password",
          {
            token,
            password:
              data.password,
          }
        );

      toast.success(
        response.data.message
      );

      router.push(
        "/sign-in"
      );
    } catch (
      error: any
    ) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to reset password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md border rounded-xl p-6 bg-card shadow-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Password
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
              name="password"
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
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
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
                "Reset Password"
              )}
            </Button>

          </form>

        </Form>

      </div>

    </div>
  );
}